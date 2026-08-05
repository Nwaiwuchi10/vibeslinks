# Live Event Flow

This note maps the mobile live event screens to the backend endpoints and realtime events.

## Host setup

- `POST /live-streams` creates the live stream draft.
- `PATCH /live-streams/:id` updates the scheduled or active live stream.
- `POST /live-streams/:id/start` starts the stream and returns a fresh Agora publisher token.
- `POST /live-streams/:id/end` ends the stream.

## Viewer entry

- `GET /live-streams/:id/watch-screen` loads the watch screen data.
- `POST /live-streams/:id/viewer-token` returns the audience token and records the viewer.
- `POST /live-streams/:id/join` performs the access check, records the join, and emits realtime updates.

## Realtime socket events

- `livestream:viewer.joined` fires when a viewer joins or receives paid access.
- `livestream:audience.updated` fires with the same audience payload so the UI can refresh the viewer panel without polling.
- `livestream:reaction` fires when someone reacts during the stream.
- `notification:new` fires for host notifications.
- `host:dashboard.updated` fires when host-side live data changes.

## What the mobile UI should listen for

- Refresh the viewer list or viewer count when `livestream:viewer.joined` arrives.
- Keep the attendee panel in sync with `livestream:audience.updated`.
- Update reaction chips and counts from `livestream:reaction`.
- Show badge or toast updates from `notification:new`.

## Attendees visibility

- `GET /events/:id/attendees` is readable to any signed-in event viewer.
- The host dashboard can use the same data for management screens.

## Practical note

- If the live event screen shows a list of attendees or guests, it should prefer the realtime socket event first and fall back to the HTTP endpoint when the screen opens.
