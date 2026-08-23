# VibezLink Socket Reference

This backend now exposes a Socket.IO gateway on the same Nest server and port as
the HTTP API.

I searched the codebase for:

- `@WebSocketGateway`
- `@SubscribeMessage`
- `WebSocketServer`
- `Gateway`
- socket client emitters

## What This Means For The Frontend

Use Socket.IO from the same backend origin you already use for HTTP:

- Local backend: `http://localhost:3000`
- Production backend: your Railway API URL

There is no separate `localhost:3001` realtime server.

Connect with the same JWT you use for HTTP:

```ts
import { io } from 'socket.io-client';

const socket = io(API_URL, {
  transports: ['websocket'],
  auth: {
    token: accessToken,
  },
});
```

The socket currently publishes chat message events so the UI can update in real
time instead of polling.

## Module By Module

### Users

HTTP endpoints that drive user-related updates:

- `POST /users/register`
- `POST /users/verify-registration`
- `POST /users/verify-email-code`
- `POST /users/verify-phone-code`
- `POST /users/login`
- `GET /users/me/onboarding`
- `PATCH /users/me/onboarding`
- `PATCH /users/me/profile`
- `GET /users/me/settings`
- `PATCH /users/me/settings`
- `GET /users/me/payment-methods`
- `POST /users/me/payment-methods`
- `GET /users/me/wallet`
- `POST /users/me/wallet/fund`

### Events

HTTP endpoints commonly used for refresh-driven UI updates:

- `GET /events/:id/comments`
- `POST /events/:id/comments`
- `GET /events/:id/friends-attending`
- `GET /events/:id/invite-friends`
- `POST /events/:id/invite-friends`
- `POST /events/:id/favorite`
- `DELETE /events/:id/favorite`
- `POST /events/:id/views`
- `GET /events/recent-views`
- `GET /events/my-tickets`
- `POST /events/:id/tickets/purchase`
- `POST /events/:id/tickets/purchases/:purchaseId/cancel`

### Live Streams

HTTP endpoints used for live stream updates:

- `GET /live-streams`
- `GET /live-streams/live`
- `GET /live-streams/creators-on-live`
- `GET /live-streams/watch-feed`
- `GET /live-streams/search`
- `GET /live-streams/find-events`
- `POST /live-streams/:id/request`
- `DELETE /live-streams/:id/request`
- `POST /live-streams/:id/reactions`
- `POST /live-streams/:id/access`
- `POST /live-streams/:id/viewer-token`

### Chat

Chat still has the HTTP endpoints, but it now also emits socket events:

- `GET /chats/threads`
- `POST /chats/direct`
- `POST /chats/events/:eventId/host-thread`
- `POST /chats/events/:eventId/community`
- `GET /chats/events/:eventId/community`
- `GET /chats/:conversationId/messages`
- `POST /chats/:conversationId/messages`

Socket events:

- `realtime:connected`
- `realtime:error`
- `chat:pong`
- `chat:message.created`

### Host Dashboard

HTTP endpoints used for dashboard refresh:

- `GET /host-dashboard/overview`
- `GET /host-dashboard/events`
- `GET /host-dashboard/events/:eventId`
- `GET /host-dashboard/events/:eventId/attendees`
- `GET /host-dashboard/tickets`
- `GET /host-dashboard/reach`
- `GET /host-dashboard/saves`
- `GET /host-dashboard/shares`
- `GET /host-dashboard/audience`
- `GET /host-dashboard/audience/followers`
- `GET /host-dashboard/audience/following`
- `GET /host-dashboard/audience/new-followers`

### Wallet

HTTP endpoints used for balance and transaction refresh:

- `GET /host-dashboard/wallet`
- `GET /host-dashboard/wallet/transactions`
- `POST /host-dashboard/wallet/withdrawals`
- `POST /host-dashboard/wallet/withdrawals/preview`
- `GET /host-dashboard/wallet/stripe-connect/status`
- `POST /host-dashboard/wallet/stripe-connect/account-link`

### Promotions

HTTP endpoints used for campaign refresh:

- `GET /host-dashboard/promotions`
- `GET /host-dashboard/promotions/overview`
- `GET /host-dashboard/promotions/events`
- `GET /host-dashboard/promotions/campaign-types`
- `POST /host-dashboard/promotions/estimate`
- `POST /host-dashboard/promotions`
- `POST /host-dashboard/promotions/:campaignId/payment-confirmation`
- `GET /host-dashboard/promotions/:campaignId/performance`
- `POST /host-dashboard/promotions/:campaignId/end`

## Socket Emit Status

Current gateway:

- gateway: `ChatGateway`
- namespace: default namespace
- transport: Socket.IO
- auth: JWT access token in `socket.auth.token` or `Authorization: Bearer ...`

Current event:

- `chat:message.created`

Payload shape:

```ts
{
  id: string;
  conversationId: string;
  senderUserId: string;
  sender: {
    id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
    role?: string;
  };
  message: string;
  createdAt: Date;
  recipientUserIds: string[];
}
```
