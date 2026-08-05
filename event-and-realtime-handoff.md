# VibezLink Event and Realtime Handoff

This document summarizes the current event flow, the newer behaviors that were added, and the realtime socket events that the frontend can listen to.

## 1) Event creation

`POST /events`

Key behaviors:

- `eventCover` is required for published events.
- Duplicate event titles are rejected.
- Hosts can create General, VIP, VVIP, or custom ticket tiers.
- `ticketPricingTiers` and `ticketTiers` are both accepted in multipart form.
- Currency defaults to `USD` when omitted in ticket pricing.
- If a published event has paid tiers, `endDateTime` is required.
- If the venue address is provided and coordinates are omitted, Google Geocoding can resolve `venueLocation.latitude` and `venueLocation.longitude` when the API key is configured.
- The response returns:
  - `event.ticketTiers`
  - `ticketPricing.tiers`
  - `notifiedUsers`

What this means for the frontend:

- Always send a real cover image.
- Use the returned `ticketTiers[].id` values later when building the checkout flow.
- Show the returned ticket prices directly instead of guessing them on the client.

## 2) Event discovery

### Get all events

`GET /events`

Notes:

- Newly created events are ordered first.
- The response includes the event metadata, ticket tiers, creator, and venue details.

### Get events near the user

`GET /events/near-you?radiusKm=23`

Notes:

- Default radius is `23 km`.
- The backend uses the signed-in user onboarding location:
  - `onboardingLocation.latitude`
  - `onboardingLocation.longitude`
- The backend compares that to:
  - `event.venueLocation.latitude`
  - `event.venueLocation.longitude`
- Nearby results include:
  - `distanceKm`
  - `locationText`
  - `price`
  - `currency`
  - `date`
  - `peopleIFollowAttending`
  - `followersAttending`

### Get nearby event cards

`GET /events/near-you/cards?radiusKm=23`

Notes:

- Returns a lighter card-style response.
- Nearby results are ordered nearest first.

## 3) Ticket checkout

### Ticket checkout screen

`GET /events/:id/tickets/checkout-screen`

Use this to get the real tier IDs before payment.

Important:

- Do not hardcode placeholder values like `ticket-tier-id`.
- The frontend should use `ticketTiers[].id` from this response.
- This endpoint returns the hosted payment actions and a clear `One-time Payment` Stripe Checkout option.

### Recommended payment flow

`POST /payments/checkout`

This is the recommended one-time Stripe checkout flow for events.

For event tickets:

- send `purchaseType: "event-ticket"`
- send `eventId`
- send the real `tierId`
- send `quantity`

The backend then redirects the user to Stripe-hosted Checkout.

### Legacy direct-card flow

The backend still supports the older PaymentIntent flow for existing integrations:

- `POST /events/:id/tickets/stripe-intent`
- confirm the intent on the frontend with Stripe
- then finalize with `POST /events/:id/tickets/purchase`

Wallet purchases are not the recommended path for paid event tickets.

## 4) Purchase and attendance

### Finalize ticket purchase

`POST /events/:id/tickets/purchase`

Notes:

- This finalizes the purchase after payment succeeds.
- The legacy direct-card flow uses the `paymentIntentId`.
- Successful purchase data is used to build the ticket receipt and attendee data.

### Scan ticket

`POST /events/:id/tickets/scan`

Used for ticket validation / gate scanning.

### Attendees

`GET /events/:id/attendees`

Notes:

- Readable to signed-in event viewers.
- The host dashboard can also reuse this data.

## 5) Event updates and cancellation

### Update event

`PATCH /events/:id`

Notes:

- Ticket tiers can be updated.
- Existing tier IDs should be preserved where possible.
- Venue coordinates can be auto-resolved again if the address changes and coordinates are omitted.

### Cancel event

`POST /events/:id/cancel`

Notes:

- Successful ticket payments are submitted for refund.
- The backend emits cancellation and dashboard refresh events.
- The cancellation response includes refunded purchase details.

## 6) Event notifications

When a published event is created:

- the backend creates notifications for users with in-app notifications enabled
- the notifications are available in `GET /notifications`
- the same payload is emitted in realtime with `notification:new`
- email is attempted separately for users with email notifications enabled

The `notifiedUsers` field in the create-event response is the number of users who were targeted for in-app notification delivery.

## 7) Realtime socket events for events

The backend uses the shared Socket.IO gateway.

### Socket connection events

- `realtime:connected`
- `realtime:error`
- `realtime:joined`
- `realtime:left`
- `chat:pong`

### Event-related realtime events

- `event:comment.created`
  - emitted when someone comments on an event
  - sent to the event room and host dashboard room

- `event:ticket.purchased`
  - emitted when a ticket purchase is completed
  - sent to the event room and host dashboard room

- `event:attendee.joined`
  - emitted after a successful ticket purchase joins the attendee list
  - sent to the event room

- `event:cancelled`
  - emitted when an event is cancelled
  - sent to the event room

- `host:dashboard.updated`
  - emitted when host-facing event data changes
  - sent to the host room

- `notification:new`
  - emitted whenever a new in-app notification is created
  - delivered to the recipient user room

### Room names

- `user:<userId>`
- `event:<eventId>`
- `host:<hostId>`
- `livestream:<liveStreamId>`
- `notification:<userId>`
- `wallet:<userId>`
- `campaign:<campaignId>`

## 8) Social and chat flows tied to events

### Event comments

- `POST /events/:id/comments`
- emits `event:comment.created`

### Event favorites

- `POST /events/:id/favorite`
- `DELETE /events/:id/favorite`

### Event shares

- `POST /events/:id/shares`

### Event invite and attendee-related actions

- `GET /events/:id/friends-attending`
- `GET /events/:id/invite-friends`
- `POST /events/:id/invite-friends`

### Event chat

- `GET /chats`
- `POST /chats/direct`
- `POST /chats/groups`
- `POST /chats/events/:eventId/host-thread`
- `POST /chats/events/:eventId/community`
- `GET /chats/events/:eventId/community`

Socket event:

- `chat:message.created`

## 9) Live stream crossover

Live streams now follow the same general pattern as events:

- paid stream access uses `POST /payments/checkout`
- the frontend should open `GET /live-streams/:id/watch`
- then call `POST /live-streams/:id/join`

Live stream socket events:

- `livestream:updated`
- `livestream:viewer.joined`
- `livestream:audience.updated`
- `livestream:reaction`

## 10) Practical frontend checklist

- Show `ticketTiers` exactly as returned by the backend.
- Use `ticketTiers[].id` for checkout, not the tier name.
- Use `GET /events/:id/tickets/checkout-screen` before payment.
- Use `GET /events/near-you` for the near-me list with the default 23 km radius.
- Listen for `notification:new` to keep the notification icon updated.
- Listen for `event:ticket.purchased`, `event:comment.created`, `event:attendee.joined`, and `event:cancelled` to keep event screens live.
- Use `watchUrl` on live stream cards to open the live stream screen.

