# Chat endpoints and socket emitter

The chat module is both HTTP-backed and realtime-enabled.

HTTP endpoints:

- `GET /chats/threads`
- `POST /chats/direct`
- `POST /chats/events/:eventId/host-thread`
- `POST /chats/events/:eventId/community`
- `GET /chats/events/:eventId/community`
- `GET /chats/:conversationId/messages`
- `POST /chats/:conversationId/messages`

Socket connection:

- The server uses `ChatGateway` from `src/chat/chat.gateway.ts`.
- Authentication happens during socket connect.
- The client can send the access token in either:
  - `handshake.auth.token`
  - `handshake.auth.accessToken`
  - `Authorization: Bearer <token>`

Connection lifecycle events:

- `realtime:connected` — sent after a socket connects successfully
- `realtime:error` — sent when authentication fails

Room join and leave:

- `realtime:join`
- `realtime:joined`
- `realtime:leave`
- `realtime:left`

Chat-specific socket event:

- `chat:ping` → server responds with `chat:pong`

Realtime message delivery:

- When a message is created, `ChatGateway.emitMessageCreated(...)` emits:
  - `chat:message.created`
- The event is broadcast to recipient user rooms:
  - `user:<userId>`

What this means for the frontend:

- If the socket is connected and the client is joined to the relevant user room, new chat messages arrive in realtime.
- The HTTP API is still the source of truth for thread lists and message history.
- The socket is the live delivery channel for new messages.

Typical client flow:

1. Login and get access token.
2. Open socket with the token.
3. Listen for `realtime:connected`.
4. Fetch chat threads with `GET /chats/threads`.
5. Open a conversation and fetch messages with `GET /chats/:conversationId/messages`.
6. Listen for `chat:message.created` for incoming messages.

