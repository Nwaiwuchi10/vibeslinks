# VibezLink Frontend API Handoff

## Overview

This document contains everything required to connect the VibezLink frontend to the backend API.

---

# Production

## Base URL

```txt
https://vibezlink-app-on-god-backend-production.up.railway.app
```

Use this URL as the root for all API requests.

If your frontend has a socket host setting, point it at the same backend origin.
The realtime server now runs on the same Nest process and port as the API.

Example:

```http
GET https://vibezlink-app-on-god-backend-production.up.railway.app/events
```

---

# Swagger Documentation

Interactive API Documentation

```txt
https://vibezlink-app-on-god-backend-production.up.railway.app/api-docs
```

OpenAPI Specification (JSON)

```txt
https://vibezlink-app-on-god-backend-production.up.railway.app/api-docs-json
```

Use Swagger to inspect:

- Request body
- Response body
- Required fields
- Optional fields
- Enums
- Authentication requirements
- Status codes

---

# Local Development

Backend

```txt
http://localhost:3000
```

Use the same `http://localhost:3000` origin for any frontend realtime/socket
base URL as well.

Socket.IO example:

```ts
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  transports: ['websocket'],
  auth: {
    token: accessToken,
  },
});
```

Swagger

```txt
http://localhost:3000/api-docs
```

---

# Frontend Environment Variable

For Vite:

```env
VITE_API_BASE_URL=https://vibezlink-app-on-god-backend-production.up.railway.app
```

Example usage

```ts
const API = import.meta.env.VITE_API_BASE_URL;
```

---

# Authentication

Protected endpoints require an Access Token.

Header

```http
Authorization: Bearer <access_token>
```

Example

```http
GET /users/me/settings
Authorization: Bearer eyJhbGciOi...
```

---

# Health Check

## Root

```http
GET /
```

Response

```txt
Hello Vibezlink!
```

---

# API Modules

---

# Authentication

Base

```txt
/auth
```

Endpoints

```http
POST /users/login
POST /auth/sign-in
POST /auth/sign-in/phone
POST /auth/sign-in/sso

POST /auth/forgot-password
POST /auth/forgot-password/phone

POST /auth/reset-password
POST /auth/reset-password/phone

POST /auth/logout
```

---

# Users

Base

```txt
/users
```

Authentication

```http
POST /users/register

POST /users/verify-registration

POST /users/verify-email-code

POST /users/verify-phone-code

POST /users/signup/sso

GET /users/countries

GET /users

GET /users/me/onboarding

GET /users/onboarding

GET /users/onboarding/options

GET /users/me/username-suggestions

GET /users/onboarding/username-suggestions

GET /users/username-availability

PATCH /users/me/onboarding

PATCH /users/onboarding

PATCH /users/me/profile

GET /users/me/settings

PATCH /users/me/settings

GET /users/me/payment-methods

POST /users/me/payment-methods/stripe/setup-intent

POST /users/me/payment-methods

PATCH /users/me/payment-methods/:id/default

DELETE /users/me/payment-methods/:id

GET /users/me/wallet

POST /users/me/wallet/stripe-intent

POST /users/me/wallet/fund

POST /users/me/profile-picture

GET /users/role-upgrade-requests

POST /users/role-upgrade-requests
```

---

# Events

Base

```txt
/events
```

Endpoints

```http
POST /events

GET /events

GET /events/create-options

GET /events/artist-options

GET /events/near-you

GET /events/near-you/cards

GET /events/recommended/cards

GET /events/search-screen

GET /events/search

GET /events/recent-views

GET /events/my-tickets

GET /events/drafts

GET /events/:id

GET /events/:id/details-screen

GET /events/:id/comments

POST /events/:id/comments

POST /events/:id/save-and-continue

POST /events/:id/views

POST /events/:id/favorite

DELETE /events/:id/favorite

POST /events/:id/share

GET /events/:id/gallery

POST /events/:id/gallery

GET /events/gallery/:galleryItemId/share

GET /events/gallery/:galleryItemId/download

POST /events/gallery/:galleryItemId/reactions/love

DELETE /events/gallery/:galleryItemId/reactions/love

DELETE /events/gallery/:galleryItemId

POST /events/:id/duplicate

GET /events/:id/attendees

GET /events/:id/friends-attending

GET /events/:id/invite-friends

POST /events/:id/invite-friends

GET /events/:id/collaborators

POST /events/:id/collaborators

DELETE /events/:id/collaborators/:collaboratorId

GET /events/:id/analytics

GET /events/:id/report.pdf

POST /events/:id/tickets/scan

PATCH /events/:id

DELETE /events/:id

POST /events/:id/tickets/stripe-intent

POST /events/:id/tickets/purchase

GET /events/:id/tickets/checkout-screen

GET /events/:id/tickets/purchases

GET /events/:id/tickets/purchases/:purchaseId

POST /events/:id/tickets/purchases/:purchaseId/cancel
```

---

# Live Streams

Base

```txt
/live-streams
```

Endpoints

```http
GET /live-streams

GET /live-streams/create-options

GET /live-streams/live

GET /live-streams/creators-on-live

GET /live-streams/watch-feed

GET /live-streams/find-events

GET /live-streams/search

POST /live-streams

GET /live-streams/:id/watch

POST /live-streams/:id/request

DELETE /live-streams/:id/request

POST /live-streams/:id/reactions

POST /live-streams/:id/access

POST /live-streams/:id/viewer-token
```

---

# Host Dashboard

Base

```txt
/host-dashboard
```

Endpoints

```http
GET /host-dashboard/overview

GET /host-dashboard/events

GET /host-dashboard/events/:eventId

GET /host-dashboard/events/:eventId/attendees

GET /host-dashboard/tickets

GET /host-dashboard/reach

GET /host-dashboard/saves

GET /host-dashboard/shares

GET /host-dashboard/audience

GET /host-dashboard/audience/followers

GET /host-dashboard/audience/following

GET /host-dashboard/audience/new-followers

GET /host-dashboard/wallet

GET /host-dashboard/wallet/transactions

POST /host-dashboard/wallet/withdrawals/preview

POST /host-dashboard/wallet/withdrawals

GET /host-dashboard/wallet/stripe-connect/status

POST /host-dashboard/wallet/stripe-connect/account-link

GET /host-dashboard/wallet/statements

GET /host-dashboard/promotions/overview

GET /host-dashboard/promotions/events

GET /host-dashboard/promotions/campaign-types

POST /host-dashboard/promotions/estimate

POST /host-dashboard/promotions

POST /host-dashboard/promotions/:campaignId/payment-confirmation

GET /host-dashboard/promotions/:campaignId/receipt

GET /host-dashboard/promotions/:campaignId/performance

GET /host-dashboard/promotions

GET /host-dashboard/promotions/:campaignId/end-preview

POST /host-dashboard/promotions/:campaignId/end
```

---

# Chat

Base

```txt
/chats
```

Endpoints

```http
GET /chats/threads

POST /chats/direct

POST /chats/events/:eventId/host-thread

POST /chats/events/:eventId/community

GET /chats/events/:eventId/community

GET /chats/:conversationId/messages

POST /chats/:conversationId/messages
```

---

# API Request Flow

Every request should follow this pattern.

```ts
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

---

# Error Handling

The frontend should gracefully handle common HTTP responses.

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 201    | Created               |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 422    | Validation Error      |
| 500    | Internal Server Error |

---

# Notes

- Use the Production Base URL for deployed applications.
- Use the Local URL during development.
- All protected endpoints require a valid Bearer Token.
- Always refer to the Swagger documentation for the latest request and response schemas.
- Do not hardcode request payloads or response models; generate or derive them from the OpenAPI specification where possible.
- Multipart endpoints (e.g., profile picture uploads) should use `multipart/form-data`.
- Payment-related endpoints use Stripe intents as documented in Swagger.
- Route parameters (e.g., `:id`, `:eventId`, `:conversationId`) must be replaced with actual resource identifiers before making requests.

---

# Backend Resources

| Resource       | URL                                                                          |
| -------------- | ---------------------------------------------------------------------------- |
| Production API | https://vibezlink-app-on-god-backend-production.up.railway.app               |
| Swagger UI     | https://vibezlink-app-on-god-backend-production.up.railway.app/api-docs      |
| OpenAPI JSON   | https://vibezlink-app-on-god-backend-production.up.railway.app/api-docs-json |
| Local API      | http://localhost:3000                                                        |
| Local Swagger  | http://localhost:3000/api-docs                                               |

---

**Version:** 1.0.0

**Project:** VibezLink

**Purpose:** Frontend Integration Guide

**Last Updated:** July 2026
