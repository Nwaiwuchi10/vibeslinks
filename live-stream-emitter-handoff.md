# Live stream endpoints and realtime emitter

The live stream module is HTTP-driven, but it is also wired to the shared realtime gateway for live updates.

HTTP endpoints:

- `POST /live-streams`
- `PATCH /live-streams/:id`
- `POST /live-streams/:id/start`
- `POST /live-streams/:id/end`
- `DELETE /live-streams/:id`
- plus the other live stream endpoints already exposed by the module for access, reactions, requests, and audience features

Realtime rooms:

- `livestream:<liveStreamId>`
- `host:<hostId>`

Shared socket gateway:

- Live stream updates use `ChatGateway` from `src/chat/chat.gateway.ts`.
- The same authenticated socket connection can receive live stream events.

Live stream socket events emitted by the backend:

- `livestream:updated`
  - emitted when a live stream is created, updated, started, ended, or deleted
  - sent to both the live stream room and the host room

- `host:dashboard.updated`
  - emitted when a live stream changes in a way the host dashboard should refresh

- `notification:new`
  - emitted to the host when a viewer request or other live stream notification is created

- `livestream:reaction`
  - emitted when a viewer sends a live stream reaction
  - sent to the live stream room

- `livestream:viewer.joined`
  - emitted when access is granted and a viewer joins the live stream audience
  - sent to both the live stream room and the host room

What this means for the frontend:

- The HTTP endpoints manage the lifecycle of the stream.
- The socket emitter pushes live updates into the active room.
- If the frontend joins `livestream:<id>` and `host:<hostId>`, it can update the UI in realtime without polling.

Typical client flow:

1. Login and get access token.
2. Open the socket with the token.
3. Join the correct rooms.
4. Call the HTTP endpoint to create/start/update/end the stream.
5. Listen for `livestream:updated`, `livestream:reaction`, `livestream:viewer.joined`, `host:dashboard.updated`, and `notification:new`.

