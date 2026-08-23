# VibezLink Chat Handoff

This document explains the chat system end to end: how to create chats, how to find them again, how to send messages, and which realtime socket events are emitted.

## 1) Chat model

The backend supports these chat conversation types:

- `direct` — one-to-one chat between two users
- `group` — multi-user chat created by any authenticated user
- `host-event` — event host chat that includes the host and confirmed attendees
- `community` — event community chat for an event

Every conversation has:

- `id`
- `type`
- `title`
- `participantUserIds`
- `participants`
- `attendeesOnly`
- `createdAt`
- `updatedAt`
- `lastMessageAt`

## 2) Main HTTP routes

### Chat inbox

`GET /chats`

Use this as the main inbox screen.

It returns:

- your chat threads
- a `New Chat` action
- a `New Group` action

### Group chats only

`GET /chats/groups`

Use this if you want a dedicated group-chat inbox in the UI.

### Legacy thread list alias

`GET /chats/threads`

This returns the same thread data as the inbox route.

## 3) Creating chats

### Direct chat

`POST /chats/direct`

Body:

```json
{
  "recipientUserId": "user-id"
}
```

Behavior:

- creates a one-to-one conversation if it does not exist
- returns the existing conversation if the same two users already have one
- does not require a separate “join” step

### Group chat

`POST /chats/groups`

Body:

```json
{
  "title": "Friday Night Crew",
  "participantUserIds": ["user-1", "user-2"]
}
```

Behavior:

- any authenticated user can create a group
- the creator is automatically added
- at least one other participant is required
- the backend validates that every participant exists

### Event host chat

`POST /chats/events/:eventId/host-thread`

Behavior:

- creates a host-only event chat
- includes the event host
- adds confirmed attendees from that event

### Event community chat

`POST /chats/events/:eventId/community`

Body:

```json
{
  "title": "Afro Summer Festival Community"
}
```

Behavior:

- creates an event community conversation
- includes the event host
- includes confirmed attendees who already bought tickets
- if `title` is omitted, it falls back to `{event title} Community`

## 4) Reading and sending messages

### Get messages

`GET /chats/:conversationId/messages`

Returns the full message history for a conversation.

### Send a message

`POST /chats/:conversationId/messages`

Body:

```json
{
  "message": "Hello everyone!"
}
```

Behavior:

- saves the message
- updates `lastMessageAt`
- creates in-app notifications for the other participants
- emits the realtime message event

## 5) Direct chat flow

The direct chat flow is:

1. Call `POST /chats/direct`
2. Read the returned conversation `id`
3. Open `GET /chats/:conversationId/messages`
4. Send messages with `POST /chats/:conversationId/messages`

Important:

- you do not need to call `POST /chats/direct` again every time you reopen the same chat
- if the direct chat already exists, the backend returns it instead of creating a duplicate

## 6) Group chat flow

The group chat flow is:

1. Call `POST /chats/groups`
2. Read the returned conversation `id`
3. Open `GET /chats/:conversationId/messages`
4. Send messages with `POST /chats/:conversationId/messages`

The group chat is already created after step 1. The frontend only needs the returned conversation ID after that.

## 7) Event community flow

The community flow is:

1. Host or admin calls `POST /chats/events/:eventId/community`
2. Backend creates the event community conversation
3. Frontend stores the returned conversation ID
4. Members open the thread through `GET /chats/:conversationId/messages`
5. Members send messages through `POST /chats/:conversationId/messages`

This is intended for event attendees and the host to keep chatting around one event.

## 8) Realtime socket setup

The chat system uses the shared Socket.IO gateway.

Connect with the same JWT access token used for HTTP:

```ts
import { io } from 'socket.io-client';

const socket = io(API_URL, {
  transports: ['websocket'],
  auth: {
    token: accessToken,
  },
});
```

The token can also be passed as:

- `handshake.auth.accessToken`
- `Authorization: Bearer <token>`

## 9) Socket rooms

The backend supports these room names:

- `user:<userId>`
- `event:<eventId>`
- `host:<hostId>`
- `livestream:<liveStreamId>`
- `notification:<userId>`
- `wallet:<userId>`
- `campaign:<campaignId>`

For chat, the key room is:

- `user:<userId>`

When a message is sent, the backend emits the message to the recipient user rooms.

## 10) Socket events emitted by the chat gateway

### Connection lifecycle

- `realtime:connected`
  - emitted after a successful socket connection

- `realtime:error`
  - emitted when socket authentication fails

### Room management

- `realtime:join`
  - client event to join rooms

- `realtime:joined`
  - server response after rooms are joined

- `realtime:leave`
  - client event to leave rooms

- `realtime:left`
  - server response after rooms are left

### Chat ping

- `chat:ping`
  - client event

- `chat:pong`
  - server response

### New chat message

- `chat:message.created`
  - emitted whenever a message is saved in a chat conversation
  - sent to the relevant recipient user rooms

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

## 11) What the frontend should do

- Use `GET /chats` as the main inbox screen.
- Use `GET /chats/groups` if the UI needs a separate group-only tab.
- Use `POST /chats/direct` to open a one-to-one thread.
- Use `POST /chats/groups` to create a multi-user group.
- Use `POST /chats/events/:eventId/community` for event community chat.
- Use `GET /chats/:conversationId/messages` to load history.
- Use `POST /chats/:conversationId/messages` to send text.
- Listen for `chat:message.created` to update the UI in realtime.
- Listen for `realtime:connected` so the app knows the socket is live.
- Listen for `realtime:error` to show socket auth failures.

## 12) Example curl calls

### Create a direct chat

```bash
curl -X POST 'https://vibezlink-app-on-god-backend-production.up.railway.app/chats/direct' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <your-token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "recipientUserId": "user-id"
  }'
```

### Create a group chat

```bash
curl -X POST 'https://vibezlink-app-on-god-backend-production.up.railway.app/chats/groups' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <your-token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Friday Night Crew",
    "participantUserIds": ["user-1", "user-2"]
  }'
```

### Send a group message

```bash
curl -X POST 'https://vibezlink-app-on-god-backend-production.up.railway.app/chats/<conversationId>/messages' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <your-token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello everyone!"
  }'
```

### Read group messages

```bash
curl -X GET 'https://vibezlink-app-on-god-backend-production.up.railway.app/chats/<conversationId>/messages' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <your-token>'
```

