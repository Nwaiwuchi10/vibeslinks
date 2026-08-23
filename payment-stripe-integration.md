# Payment and Stripe Integration

This document explains the parts of the backend that handle payments and how Stripe is used across the payment-related modules.

## Scope

The payment flow lives mainly in these modules:

- `UsersModule`
- `EventsModule`
- `LiveStreamsModule`

These modules share Stripe-based flows for:

- saving cards
- creating payment intents
- verifying successful payments
- funding wallets
- ticket purchases
- paid livestream access
- host payouts through Stripe Connect

## Stripe Environment Variables

The backend expects these Stripe-related env vars:

```env
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_RETURN_URL=
STRIPE_CONNECT_REFRESH_URL=
```

If Stripe is not configured, the payment endpoints return a clear configuration error.

## 1. UsersModule

File locations:

- [`src/users/users.module.ts`](../src/users/users.module.ts)
- [`src/users/users.controller.ts`](../src/users/users.controller.ts)
- [`src/users/users.service.ts`](../src/users/users.service.ts)

### What it handles

This module owns the user-side payment setup:

- Stripe card setup
- saved payment methods
- wallet funding
- wallet balance views
- payment method verification

### Stripe-related endpoints

- `POST /users/me/payment-methods/stripe/setup-intent`
- `POST /users/me/wallet/stripe-intent`
- `POST /users/me/wallet/fund`
- `GET /users/me/wallet`

### Key entities

- `UserPaymentMethod`
- `UserWallet`

### Stripe flow summary

1. The frontend requests a Stripe setup intent for a card.
2. The user confirms the card in Stripe.
3. The backend stores the verified card as a saved payment method.
4. The user can then fund a wallet or reuse the saved card for later payments.

## 2. EventsModule

File locations:

- [`src/events/events.module.ts`](../src/events/events.module.ts)
- [`src/events/events.controller.ts`](../src/events/events.controller.ts)
- [`src/events/events.service.ts`](../src/events/events.service.ts)
- [`src/events/host-dashboard-wallet.controller.ts`](../src/events/host-dashboard-wallet.controller.ts)
- [`src/events/host-dashboard-promotions.controller.ts`](../src/events/host-dashboard-promotions.controller.ts)

### What it handles

This is the largest payment surface in the app. It includes:

- event ticket purchases
- event ticket checkout
- Stripe payment intent creation for tickets
- wallet-based ticket checkout
- host wallet balance and withdrawals
- Stripe Connect account onboarding for host payouts
- promotion campaign payments

### Stripe-related endpoints

- `POST /events/:id/tickets/stripe-intent`
- `POST /events/:id/tickets/purchase`
- `GET /events/:id/tickets/checkout-screen`
- `GET /host-dashboard/wallet`
- `GET /host-dashboard/wallet/transactions`
- `GET /host-dashboard/wallet/statements`
- `POST /host-dashboard/wallet/withdrawals`
- `GET /host-dashboard/wallet/stripe-connect/status`
- `POST /host-dashboard/wallet/stripe-connect/account-link`

### Key entities

- `EventTicketTier`
- `TicketPurchase`
- `WalletTransaction`
- `UserWallet`
- `StripeConnectAccount`
- `PromotionCampaign`

### Stripe flow summary

For tickets:

1. The frontend loads ticket tiers for an event.
2. The user chooses one or more tiers.
3. If payment is Stripe-based, the backend creates a payment intent.
4. The frontend confirms payment with Stripe.
5. The backend finalizes the ticket purchase after verification.

For host payouts:

1. The host connects a Stripe account through Stripe Connect.
2. The backend stores the Stripe Connect account reference.
3. When the host withdraws, the backend creates a Stripe transfer.
4. The host dashboard reflects the wallet and payout status.

For promotion campaigns:

1. The host selects Stripe or wallet payment.
2. The backend prepares the payment payload.
3. Stripe card flows use payment intents.
4. Wallet flows deduct from the internal wallet balance.

## 3. LiveStreamsModule

File locations:

- [`src/live-streams/live-streams.module.ts`](../src/live-streams/live-streams.module.ts)
- [`src/live-streams/live-streams.controller.ts`](../src/live-streams/live-streams.controller.ts)
- [`src/live-streams/live-streams.service.ts`](../src/live-streams/live-streams.service.ts)

### What it handles

This module handles livestream creation and access control, including paid access.

### Stripe-related behavior

- paid livestream access
- payment intent creation for livestream entry
- access records that track whether a stream was paid for

### Key entities

- `LiveStream`
- `LiveStreamAccess`

### Notes

The livestream flow supports payment metadata such as:

- payment method
- payment intent ID
- currency

That allows the frontend to support Stripe entry fees without changing the livestream creation flow itself.

## Shared Payment Entities

These entities are used across the payment stack:

- `UserPaymentMethod`
- `UserWallet`
- `WalletTransaction`
- `StripeConnectAccount`
- `TicketPurchase`
- `EventTicketTier`
- `PromotionCampaign`
- `LiveStreamAccess`

## Frontend Integration Notes

The frontend usually follows this pattern:

1. Request a setup intent or payment intent from the backend.
2. Confirm the payment with Stripe on the client.
3. Send the Stripe confirmation/payment intent ID back to the backend.
4. Let the backend verify and persist the final state.

Important rules:

- Do not treat Stripe confirmation as final until the backend verifies it.
- Use the currency returned by the backend for each specific flow.
- Keep payment method IDs, payment intent IDs, and connect account IDs in the backend only.

## Quick Endpoint Map

### User payments

- `POST /users/me/payment-methods/stripe/setup-intent`
- `POST /users/me/wallet/stripe-intent`
- `POST /users/me/wallet/fund`
- `GET /users/me/wallet`

### Event tickets and payouts

- `POST /events/:id/tickets/stripe-intent`
- `POST /events/:id/tickets/purchase`
- `GET /host-dashboard/wallet`
- `POST /host-dashboard/wallet/withdrawals`
- `GET /host-dashboard/wallet/stripe-connect/status`
- `POST /host-dashboard/wallet/stripe-connect/account-link`

### Livestream access

- paid livestream creation and access verification in `live-streams`

## Practical Summary

If you are working on payment UI, the main files to check first are:

- [`src/users/users.controller.ts`](../src/users/users.controller.ts)
- [`src/users/users.service.ts`](../src/users/users.service.ts)
- [`src/events/events.controller.ts`](../src/events/events.controller.ts)
- [`src/events/events.service.ts`](../src/events/events.service.ts)
- [`src/live-streams/live-streams.controller.ts`](../src/live-streams/live-streams.controller.ts)
- [`src/live-streams/live-streams.service.ts`](../src/live-streams/live-streams.service.ts)

Those files contain the request shapes, Stripe intent creation, verification rules, and the response objects the frontend should follow.
