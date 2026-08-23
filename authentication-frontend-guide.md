# VibezLink Authentication API Guide

Frontend integration guide for VibezLink authentication and user-related endpoints.

## Base URL

```txt
Production: https://<your-railway-domain>
Local:      http://localhost:3000
```

Set `APP_URL` on Railway to your live backend domain so Swagger and email links use the correct base URL.

All request and response bodies are JSON unless otherwise stated.

## Swagger API Docs

After installing the Swagger packages and redeploying, frontend developers can
open:

```txt
https://<your-railway-domain>/api-docs
```

Local development:

```txt
http://localhost:3000/api-docs
```

The raw OpenAPI JSON is available at:

```txt
/api-docs-json
```

For protected endpoints, click **Authorize** in Swagger UI and enter:

```txt
Bearer <access_token>
```

The access token comes from `POST /auth/sign-in`.

## General Rules

### Headers

Public endpoints:

```http
Content-Type: application/json
```

Protected endpoints:

```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

### Auth Token

Successful sign-in responses return:

```json
{
  "access_token": "jwt_token_here"
}
```

Store this token securely on the client and include it in the `Authorization` header for protected endpoints.

### User Roles

Possible roles:

```ts
type UserRole = 'admin' | 'artist' | 'host' | 'patron' | 'user';
```

### Standard User Object

Password is never returned.

```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "firstName": "Jane",
  "lastName": "Doe",
  "country": "Nigeria",
  "email": "jane@example.com",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "ssoProvider": "google",
  "ssoProviderUserId": "google-oauth-sub",
  "role": "user",
  "isActive": true
}
```

`ssoProvider` and `ssoProviderUserId` may be `null` or absent for password-created accounts.

## Authentication Flow Summary

### Password Signup

1. Frontend submits signup form to `POST /users/signup`.
2. Backend sends a verification email.
3. User clicks verification link.
4. Backend verifies email and redirects the user to the configured login page.
5. Frontend signs user in with `POST /auth/sign-in`.

### SSO Signup And Login

1. Frontend completes provider auth with Google, Facebook, or Apple.
2. Frontend sends the provider token to the backend.
3. Backend verifies the token with the provider and extracts the trusted profile.
4. Backend creates or links the account and returns `access_token` immediately.
5. Frontend stores the token and continues onboarding.

Important: the backend now verifies the provider token. Do not trust `providerUserId` from the client.

### Password Reset

1. Frontend submits email to `POST /auth/forgot-password`.
2. Backend sends reset link by email.
3. User opens reset screen from email link.
4. Frontend extracts `token` from URL query params.
5. Frontend submits `token`, `oldPassword`, and `newPassword` to `POST /auth/reset-password`.
6. Backend redirects flow information by returning `loginUrl`; frontend should route user to login.

Important: Reset password requires the old password to match and the new password to be different.

## Public Endpoints

## Health Check

### `GET /`

Checks whether the deployed API is running.

Example:

```bash
curl -i https://<your-railway-domain>/
```

Success response:

```http
HTTP/2 200
```

```txt
Hello Vibezlink!
```

## Countries

### `GET /users/countries`

Returns the supported country list for signup forms.

Example:

```bash
curl -i https://<your-railway-domain>/users/countries
```

Success response:

```json
["Nigeria", "Ghana", "..."]
```

Use this endpoint to populate the country dropdown instead of hardcoding countries in the frontend.

## Figma Auth Flow

Use these endpoints for the Figma auth screens from splash/welcome through registration:

```http
GET /users/auth-flow/options
POST /users/register
POST /users/verify-registration
POST /auth/sign-in
```

`POST /users/register` accepts `method: "email"`, `"phone"`, `"google"`, `"facebook"`, or `"apple"`.

Email example:

```json
{
  "method": "email",
  "fullName": "Mutiu Puyol",
  "username": "mutiupuyol",
  "email": "mutiu@example.com",
  "password": "StrongPass1!",
  "acceptedTerms": true
}
```

Phone example:

```json
{
  "method": "phone",
  "fullName": "Mutiu Puyol",
  "username": "mutiupuyol",
  "phoneNumber": "+2348012345678",
  "password": "StrongPass1!",
  "acceptedTerms": true
}
```

SSO example:

```json
{
  "provider": "facebook",
  "accessToken": "facebook-user-access-token",
  "acceptedTerms": true
}
```

`country` is optional in the Figma flow and defaults to `Nigeria`.

## Password Signup

### `POST /users/signup`

Creates a pending user and sends an email verification link plus a 6 digit verification code.

Request body:

```json
{
  "fullName": "Mutiu Puyol",
  "username": "mutiupuyol",
  "country": "Nigeria",
  "email": "mutiu@example.com",
  "password": "StrongPass1!",
  "receivesNewsletter": true
}
```

The older payload with `firstName` and `lastName` still works.

Success response:

```http
HTTP/2 201
```

```json
{
  "message": "Verification email sent. Please verify your email to continue."
}
```

Development and test environments may also return `verificationUrl` and `verificationCode`. Production should rely on the email-delivered link or code.

Validation rules:

- `fullName`, `country`, `email`, and `password` are required unless sending separate `firstName` and `lastName`.
- `username` is optional, but when sent it must be unique.
- Email must be valid.
- Country must exist in `GET /users/countries`.
- Password must contain at least 8 characters, uppercase, lowercase, number, and special character.
- Duplicate pending or verified emails return `409`.

Common errors:

```json
{
  "message": "Full name, country, email and password are required",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Username must be 3 to 30 characters and only include letters, numbers, dots or underscores",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Enter a valid email address",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Select a valid country",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Password must contain 8+ characters including uppercase, lowercase, a number and a special character",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "The email address you entered is already registered. Please use a different email address",
  "error": "Conflict",
  "statusCode": 409
}
```

## SSO Signup

### `POST /users/signup/sso`

Creates the verified SSO user immediately after the frontend has completed provider verification.

Supported providers:

```ts
type SsoProvider = 'google' | 'facebook' | 'apple';
```

Request body:

```json
{
  "provider": "google",
  "credential": "google-id-token-from-gis",
  "acceptedTerms": true
}
```

Google example:

```json
{
  "provider": "google",
  "credential": "google-id-token-from-gis",
  "acceptedTerms": true
}
```

Facebook example:

```json
{
  "provider": "facebook",
  "accessToken": "facebook-user-access-token",
  "acceptedTerms": true
}
```

Apple example:

```json
{
  "provider": "apple",
  "identityToken": "apple-identity-token-jwt",
  "fullName": "Jane Doe",
  "acceptedTerms": true
}
```

Success response:

```http
HTTP/2 201
```

```json
{
  "message": "Social signup successful. You can continue onboarding.",
  "provider": "google",
  "isNewUser": true,
  "access_token": "jwt-token",
  "user": {
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

Frontend flow:

1. The frontend completes Google, Facebook, or Apple login.
2. The frontend sends the provider token to `POST /users/signup/sso`.
3. The backend verifies the token, creates or links the user, and returns `access_token`.
4. The frontend stores the token and routes straight into onboarding.

Common errors:

```json
{
  "message": "SSO provider must be google, facebook or apple",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "A provider verification token is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "A verified email address is required for social signup",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Verify Email

### `GET /users/verify-email?token=<token>`

Called from the email verification link. This endpoint redirects, so the frontend usually does not call it manually.

Example:

```txt
https://<your-railway-domain>/users/verify-email?token=<token>
```

Success behavior:

```http
HTTP/2 302
Location: <configured-login-url>
```

Common errors:

```json
{
  "message": "Verification token is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

### `POST /users/verification-code`

Resends a 6 digit verification code for a pending signup.

Request body:

```json
{
  "email": "mutiu@example.com"
}
```

Success response:

```json
{
  "message": "Verification code sent. Please check your email."
}
```

### `POST /users/verify-email-code`

Verifies the code entered in the signup screen.

Request body:

```json
{
  "email": "mutiu@example.com",
  "code": "123456"
}
```

Success response:

```json
{
  "message": "Email verified successfully. Please log in."
}
```

```json
{
  "message": "Invalid or expired verification link",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Password Sign In

### `POST /auth/sign-in`

Primary password login endpoint.

Request body:

```json
{
  "email": "mutiu@example.com",
  "password": "StrongPass1!"
}
```

Success response:

```http
HTTP/2 201
```

```json
{
  "message": "Sign in successful",
  "provider": "google",
  "isNewUser": false,
  "user": {
    "id": "uuid",
    "fullName": "Puyol Mutiu",
    "name": "Mutiu Puyol",
    "firstName": "Puyol",
    "lastName": "Mutiu",
    "country": "Nigeria",
    "email": "Puyol@example.com",
    "role": "user",
    "isActive": true
  },
  "access_token": "jwt_token_here"
}
```

Common errors:

```json
{
  "message": "Email and password are required",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Email verification required",
  "error": "Forbidden",
  "statusCode": 403
}
```

```json
{
  "message": "Your credientials are incorrect, please check again to confirm",
  "error": "Unauthorized",
  "statusCode": 401
}
```

Frontend behavior:

- On success, store `access_token`.
- Use `user.role` to control role-based UI.
- On `403 Email verification required`, show a message asking user to check email.
- On `401`, show invalid credentials message.
- default role for every registered user will be `user` and the user role shold not be displayed in the screen.

## Legacy Password Login

### `POST /users/login`

Legacy login endpoint. Prefer `POST /auth/sign-in` for new frontend work.

Request body:

```json
{
  "email": "Puyol@example.com",
  "password": "StrongPass1!"
}
```

Success response:

```json
{
  "user": {
    "id": "uuid",
    "name": "Puyol Mutiu",
    "firstName": "Puyol",
    "lastName": "Mutiu",
    "country": "Nigeria",
    "email": "jane@example.com",
    "role": "user",
    "isActive": true
  },
  "access_token": "jwt_token_here"
}
```

## SSO Sign In

### `POST /auth/sign-in/sso`

Logs in a verified SSO user.

Request body:

```json
{
  "provider": "google",
  "credential": "google-id-token-from-gis"
}
```

Success response:

```http
HTTP/2 201
```

```json
{
  "message": "Sign in successful",
  "user": {
    "id": "uuid",
    "name": "Puyol Mutiu",
    "firstName": "Mutiu",
    "lastName": "Puyol",
    "country": "Nigeria",
    "email": "Mutiu@example.com",
    "ssoProvider": "google",
    "ssoProviderUserId": "google-oauth-sub",
    "role": "user",
    "isActive": true
  },
  "access_token": "jwt_token_here"
}
```

Common errors:

```json
{
  "message": "SSO provider must be google, facebook or apple",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "A provider verification token is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "A verified email address is required for social signup",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Your credientials are incorrect, please check again to confirm",
  "error": "Unauthorized",
  "statusCode": 401
}
```

Frontend behavior:

- Complete Google, Facebook, or Apple auth first.
- Send the provider token to the backend.
- Login succeeds only when the backend verifies the provider token and finds the linked account.
- If the endpoint returns `401`, route the user to SSO signup or show account-not-found messaging.

## Forgot Password

### `POST /auth/forgot-password`

Sends a reset password link to the registered email address.

Request body:

```json
{
  "email": "puyol@example.com"
}
```

Success response:

```http
HTTP/2 201
```

```json
{
  "message": "Password reset link sent. Please check your email."
}
```

Development and test environments may also return `resetUrl`. Production should rely on the email link.

Common errors:

```json
{
  "message": "Email is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Registered email address not found",
  "error": "Not Found",
  "statusCode": 404
}
```

Frontend behavior:

- Ask for registered email.
- On success, show "Check your email" message.
- Do not expect `resetUrl` in production.

## Reset Password

### `POST /auth/reset-password`

Completes password reset using the email token.

Request body:

```json
{
  "token": "reset-token-from-email-url",
  "oldPassword": "StrongPass1!",
  "newPassword": "NewStrongPass1!"
}
```

Success response:

```http
HTTP/2 201
```

```json
{
  "message": "Password reset successful. Please log in.",
  "loginUrl": "https://frontend-login-url/login"
}
```

Common errors:

```json
{
  "message": "Password reset token is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Old password is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Password must contain 8+ characters including uppercase, lowercase, a number and a special character",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Invalid or expired password reset link",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Your credientials are incorrect, please check again to confirm",
  "error": "Unauthorized",
  "statusCode": 401
}
```

```json
{
  "message": "New password must be different from the old password",
  "error": "Bad Request",
  "statusCode": 400
}
```

Frontend behavior:

- Extract `token` from the reset link query string.
- Collect `oldPassword` and `newPassword`.
- On success, redirect user to login.
- Reset tokens are single-use and expire after 30 minutes.

## Logout

### `POST /auth/logout`

Revokes the current JWT.

Headers:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request body:

```json
{}
```

Success response:

```http
HTTP/2 201
```

```json
{
  "message": "Logout successful"
}
```

Common errors:

```json
{
  "message": "Missing access token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

```json
{
  "message": "Invalid or expired access token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

Frontend behavior:

- Call logout with the current token.
- Clear local auth state after success.
- If logout returns `401`, still clear local auth state because the token is already unusable.

## Protected User Endpoints

All endpoints in this section require:

```http
Authorization: Bearer <access_token>
```

## Get All Users

### `GET /users`

Admin/user protected list endpoint.

Success response:

```json
[
  {
    "id": "uuid",
    "name": "Mutiu Puyol",
    "firstName": "Mutiu",
    "lastName": "Puyol",
    "country": "Nigeria",
    "email": "Mutiu@example.com",
    "role": "user",
    "isActive": true
  }
]
```

## Get One User

### `GET /users/:id`

Success response:

```json
{
  "id": "uuid",
  "name": "Mutiu Emmanuel",
  "firstName": "Mutiu",
  "lastName": "Emmanuel",
  "country": "Nigeria",
  "email": "emma@example.com",
  "role": "user",
  "isActive": true
}
```

Common error:

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

## Update User

### `PATCH /users/:id`

Updates user `name` and/or `email`.

Request body:

```json
{
  "name": "Nwaiwu A. Uche",
  "email": "uche.doe@example.com"
}
```

Success response returns the updated user without password.

## Request Role Upgrade

### `POST /users/role-upgrade-requests`

Allows a logged-in user to request becoming an artist, host, or patron.

Request body:

```json
{
  "requestedRole": "host",
  "hostApplication": {
    "businessOrganizationName": "Vibez Events",
    "businessType": "Event organizer",
    "experience": "I organize live music events.",
    "email": "host@example.com",
    "instagram": "@vibez",
    "tiktok": "@vibez",
    "contact": "+2348000000000"
  }
}
```

Allowed values:

```ts
type RequestedRole = 'artist' | 'host' | 'patron' | 'patrons';
```

Success response:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "requestedRole": "artist",
  "status": "pending",
  "hostApplication": {
    "businessOrganizationName": "Vibez Events",
    "businessType": "Event organizer",
    "experience": "I organize live music events.",
    "email": "host@example.com",
    "instagram": "@vibez",
    "tiktok": "@vibez",
    "contact": "+2348000000000"
  },
  "createdAt": "2026-05-08T10:00:00.000Z",
  "updatedAt": "2026-05-08T10:00:00.000Z"
}
```

Common errors:

```json
{
  "message": "Requested role must be artist, host or patron",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "Admin users cannot request role upgrades",
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": "User already has a pending role request",
  "error": "Conflict",
  "statusCode": 409
}
```

## Admin Role Upgrade Review

These endpoints require the authenticated user to have `role: "admin"`.

### `GET /users/role-upgrade-requests`

Returns all role upgrade requests ordered newest first.

Success response:

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "requestedRole": "artist",
    "status": "pending",
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T10:00:00.000Z",
    "user": {
      "id": "uuid",
      "name": "Mutiu Mike",
      "email": "jane@example.com",
      "role": "user",
      "isActive": true
    }
  }
]
```

### `PATCH /users/role-upgrade-requests/:id/accept`

Approves a pending role upgrade request.

Success response:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "requestedRole": "artist",
  "status": "approved",
  "reviewedByUserId": "admin-user-id",
  "reviewedAt": "2026-05-08T10:00:00.000Z",
  "createdAt": "2026-05-08T10:00:00.000Z",
  "updatedAt": "2026-05-08T10:00:00.000Z"
}
```

### `PATCH /users/role-upgrade-requests/:id/reject`

Rejects a pending role upgrade request.

Success response:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "requestedRole": "artist",
  "status": "rejected",
  "reviewedByUserId": "admin-user-id",
  "reviewedAt": "2026-05-08T10:00:00.000Z",
  "createdAt": "2026-05-08T10:00:00.000Z",
  "updatedAt": "2026-05-08T10:00:00.000Z"
}
```

Common admin errors:

```json
{
  "message": "Admin access required",
  "error": "Forbidden",
  "statusCode": 403
}
```

```json
{
  "message": "Role upgrade request not found",
  "error": "Not Found",
  "statusCode": 404
}
```

```json
{
  "message": "Role upgrade request has already been reviewed",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Admin User Deletion

These endpoints require the authenticated user to have `role: "admin"`.

### `DELETE /users/:id`

Deletes one user.

Success response:

```json
{
  "message": "User deleted successfully"
}
```

### `DELETE /users`

Deletes all users, pending users, and role upgrade requests.

Use only from a protected admin tool.

Success response:

```json
{
  "message": "All users deleted successfully"
}
```

## Frontend Implementation Checklist

- Use `GET /users/countries` to populate country options.
- Use `POST /users/signup` for password signup.
- Use `POST /users/signup/sso` for Google or Apple signup.
- Use `POST /auth/sign-in`, not legacy `POST /users/login`, for password login.
- Use `POST /auth/sign-in/sso` for SSO login.
- Store `access_token` after login.
- Attach `Authorization: Bearer <access_token>` on protected requests.
- Clear local auth state after logout, even if the logout endpoint returns `401`.
- Treat `403 Email verification required` as a separate UI state from invalid credentials.
- Do not expect `verificationUrl` or `resetUrl` in production responses.
- Extract password reset `token` from the email link URL.
- Reset password form must collect `oldPassword` and `newPassword`.
- Validate password strength on the frontend before submitting.

## Live Streams With Agora

Only authenticated users with role `host` or `admin` can create a live stream.
Use Agora on the client with the `appId`, `channelName`, `uid`, and `token`
returned by the backend.

### Environment Variables

Put these in the backend `.env`:

```env
AGORA_APP_ID=your_agora_project_app_id
AGORA_APP_CERTIFICATE=your_agora_project_app_certificate
AGORA_TOKEN_EXPIRE_SECONDS=3600
```

Keep `AGORA_APP_CERTIFICATE` server-only. Do not put it in the frontend app.

### Create Options

```http
GET /live-streams/create-options
Authorization: Bearer <access_token>
```

Response:

```json
{
  "wizardSteps": [
    {
      "key": "details",
      "title": "Go Live",
      "description": "Choose a title, cover and live category.",
      "fields": ["title", "coverUrl", "category"]
    },
    {
      "key": "privacy",
      "title": "Privacy Settings",
      "description": "Control who can join your live stream.",
      "fields": ["privacy", "ticketPrice"]
    },
    {
      "key": "preview",
      "title": "Preview",
      "description": "Review the stream details before starting.",
      "fields": ["status", "agora"]
    }
  ],
  "categoryOptions": [
    { "label": "Music", "value": "music" },
    { "label": "DJ Session", "value": "dj-session" },
    { "label": "Podcast", "value": "podcast" },
    { "label": "Event Stream", "value": "event-stream" },
    { "label": "Interview", "value": "interview" }
  ],
  "privacyOptions": [
    { "label": "All", "value": "all" },
    { "label": "Public", "value": "public" },
    { "label": "Followers Only", "value": "followers-only" },
    { "label": "Ticket Holders Only", "value": "ticket-holders-only" },
    { "label": "Private Invite", "value": "private-invite" }
  ],
  "categories": [
    { "label": "Music", "value": "music" },
    { "label": "DJ Session", "value": "dj-session" },
    { "label": "Podcast", "value": "podcast" },
    { "label": "Event Stream", "value": "event-stream" },
    { "label": "Interview", "value": "interview" }
  ],
  "privacySettings": [
    { "label": "All", "value": "all" },
    { "label": "Public", "value": "public" },
    { "label": "Followers Only", "value": "followers-only" },
    { "label": "Ticket Holders Only", "value": "ticket-holders-only" },
    { "label": "Private Invite", "value": "private-invite" }
  ],
  "feePercent": 3,
  "recommendedTicketPrice": 0
}
```

Frontend use:

```text
Use wizardSteps to drive the live stream create flow.
Use categoryOptions and privacyOptions for the dropdowns in the UI.
Keep categories and privacySettings as backwards-compatible aliases for older screens.
Use recommendedTicketPrice when rendering the ticket price input default.
```

### Create Live Stream

```http
POST /live-streams
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request:

```json
{
  "title": "Friday Night Session",
  "coverUrl": "https://example.com/live-cover.jpg",
  "category": "music",
  "privacy": "all",
  "ticketPrice": 5000
}
```

Response includes the saved live stream and the host Agora token:

```json
{
  "liveStream": {
    "id": "uuid",
    "title": "Friday Night Session",
    "coverUrl": "https://example.com/live-cover.jpg",
    "category": "music",
    "privacy": "all",
    "ticketPrice": 5000,
    "feePercent": 3,
    "viewerCount": 0,
    "viewerCountLabel": "#0",
    "agoraChannelName": "live-uuid",
    "status": "scheduled",
    "isLive": false,
    "badgeLabel": null,
    "host": {
      "id": "user-id",
      "name": "Host User",
      "username": "hostuser",
      "avatarUrl": "https://example.com/host.jpg",
      "verified": true
    },
    "elapsedLabel": "now",
    "elapsedSeconds": 0,
    "createdAt": "2026-06-03T09:23:26.366Z"
  },
  "agora": {
    "appId": "agora_app_id",
    "channelName": "live-uuid",
    "uid": "current-user-id",
    "role": "host",
    "expiresIn": 3600,
    "token": "agora_rtc_token"
  }
}
```

### Viewer Token

```http
POST /live-streams/:id/viewer-token
Authorization: Bearer <access_token>
```

Use this when an audience member joins the stream. The response uses
`role: "audience"` and an Agora subscriber token for the same channel.

### Live Stream Cards

Use this for the horizontal live cards shown in the home/feed UI.

```http
GET /live-streams
Authorization: Bearer <access_token>
```

Optional filter:

```http
GET /live-streams?status=live
```

For the "Creators on Live" screen, use the explicit live-only endpoint:

```http
GET /live-streams/live
Authorization: Bearer <access_token>
```

For the home "Creators on Live" feed, use the card response with creator
social counts:

```http
GET /live-streams/creators-on-live
Authorization: Bearer <access_token>
```

Response:

```json
{
  "title": "Creators on Live",
  "liveCount": 1,
  "search": {
    "enabled": true,
    "placeholder": "Search creators or streams",
    "endpoint": "/live-streams/search"
  },
  "cards": [
    {
      "id": "uuid",
      "title": "Join me with, me paint the art",
      "coverUrl": "https://example.com/live-cover.jpg",
      "category": "music",
      "privacy": "all",
      "ticketPrice": 0,
      "feePercent": 3,
      "viewerCount": 29100,
      "viewerCountLabel": "#29.1K",
      "status": "live",
      "isLive": true,
      "badgeLabel": "LIVE",
      "agoraChannelName": "live-uuid",
      "host": {
        "id": "host-user-id",
        "name": "Olivia",
        "username": "olivia",
        "avatarUrl": "https://example.com/olivia.jpg",
        "verified": true
      },
      "elapsedLabel": "5m",
      "elapsedSeconds": 300,
      "createdAt": "2026-05-25T14:44:17.000Z",
      "followersCount": 4300,
      "followingCount": 120,
      "streamsCount": 8
    }
  ],
  "action": {
    "label": "See All",
    "method": "GET",
    "endpoint": "/live-streams/creators-on-live"
  }
}
```

Frontend mapping for the card:

```txt
cover image: coverUrl
main text: title
avatar: host.avatarUrl
name: host.name
badge: host.verified
time: elapsedLabel
live pill: badgeLabel
viewer pill: viewerCountLabel
```

### Search Live Streams

Use this for the find/search control on the live creators screen. It searches
live streams by stream title, live category, host name, or host username.

```http
GET /live-streams/search?q=paint
Authorization: Bearer <access_token>
```

Optional filters:

```http
GET /live-streams/search?q=music&category=music&status=live&limit=20
```

`GET /live-streams/find-events` is kept as a compatibility alias for live
search and defaults to `status=live`.

Response uses the same card shape as `GET /live-streams/live`:

```json
[]
```

## Friends Attending Event

Use this for the "Friends Attending Event" screen. It returns confirmed ticket
holders for the event who either follow the current user or are followed by the
current user.

```http
GET /events/:id/friends-attending
Authorization: Bearer <access_token>
```

Response:

```json
{
  "event": {
    "id": "event-id",
    "title": "Friday Night Live",
    "imageUrl": "https://example.com/poster.jpg",
    "startsAt": "2026-06-01T18:00:00.000Z",
    "venue": "Eko Convention Centre"
  },
  "summary": {
    "totalFriendsAttending": 7,
    "requesterIsAttending": true
  },
  "friends": [
    {
      "id": "user-id",
      "name": "Sophia Carter",
      "username": "sophia",
      "avatarUrl": "https://example.com/sophia.jpg",
      "relationship": "mutual",
      "verified": false,
      "ticketQuantity": 1
    }
  ],
  "action": {
    "label": "Buy Tickets",
    "method": "POST",
    "endpoint": "/events/event-id/tickets/purchase"
  }
}
```

Frontend mapping for the list:

```txt
avatar: friends[].avatarUrl
name: friends[].name
small badge/icon: friends[].verified or relationship
bottom button: action.label
```

## Event Near You Cards

Use this endpoint for the "Event Near You" screen. It returns the screen title,
search metadata, event cards, and the bottom `Discover Events` action.

```http
GET /events/near-you/cards
Authorization: Bearer <access_token>
```

Optional radius filter:

```http
GET /events/near-you/cards?radiusKm=25
```

Response:

```json
{
  "title": "Event Near You",
  "search": {
    "enabled": true,
    "placeholder": "Search events",
    "endpoint": "/events/near-you/cards"
  },
  "cards": [
    {
      "id": "event-id",
      "title": "Can You see my cute face",
      "imageUrl": "https://example.com/event.jpg",
      "locationText": "Lekki Ikate, Lagos Nigeria",
      "dateTimeText": "May 15 • 9:00 PM",
      "priceText": "₦130,000 /Person",
      "distanceKm": 4.2,
      "attendees": {
        "total": 5,
        "avatars": [
          {
            "id": "user-id",
            "name": "Sophia Carter",
            "avatarUrl": "https://example.com/sophia.jpg"
          }
        ]
      },
      "action": {
        "label": "View Event",
        "method": "GET",
        "endpoint": "/events/event-id"
      }
    }
  ],
  "action": {
    "label": "Discover Events",
    "method": "GET",
    "endpoint": "/events/near-you/cards"
  }
}
```

Frontend mapping:

```txt
screen title: title
search button: search
card image: cards[].imageUrl
card title: cards[].title
location row: cards[].locationText
date row: cards[].dateTimeText
price row: cards[].priceText
avatar stack: cards[].attendees.avatars
bottom button: action.label
```

## Other Events You May Like

Use this feed for the home screen section that mixes interests, location,
favorites, recent views, and some randomization so the list feels fresh.

```http
GET /events/recommended/cards
Authorization: Bearer <access_token>
```

Optional limit:

```http
GET /events/recommended/cards?limit=6
```

Response:

```json
{
  "title": "Other events you may like",
  "search": {
    "enabled": true,
    "placeholder": "Search events",
    "endpoint": "/events/search"
  },
  "cards": [
    {
      "id": "event-id",
      "title": "Afro Summer Festival",
      "imageUrl": "https://example.com/event.jpg",
      "locationText": "Lekki Ikate, Lagos Nigeria",
      "dateTimeText": "May 15 • 9:00 PM",
      "priceText": "₦80,000 /Person",
      "attendees": {
        "total": 5,
        "avatars": [
          {
            "id": "user-id",
            "name": "Sophia Carter",
            "avatarUrl": "https://example.com/sophia.jpg"
          }
        ]
      },
      "action": {
        "label": "View Event",
        "method": "GET",
        "endpoint": "/events/event-id"
      },
      "matchReasons": ["Matches your interest in music", "Happening around you"]
    }
  ],
  "action": {
    "label": "Discover Events",
    "method": "GET",
    "endpoint": "/events/recommended/cards"
  }
}
```

## Event Search And Recent Views

Use this for the search screen with recent search terms and recent viewed event
cards.

```http
GET /events/search-screen
Authorization: Bearer <access_token>
```

Response:

```json
{
  "search": {
    "placeholder": "type text",
    "endpoint": "/events/search",
    "method": "GET"
  },
  "recentSearches": [
    {
      "id": "recent-search-id",
      "query": "Music Event",
      "updatedAt": "2026-05-27T09:00:00.000Z",
      "action": {
        "label": "Music Event",
        "method": "GET",
        "endpoint": "/events/search?q=Music%20Event"
      }
    }
  ],
  "recentViews": [
    {
      "id": "event-id",
      "title": "Worship De King",
      "imageUrl": "https://example.com/event.jpg",
      "locationText": "Lekki Ikate, Lagos",
      "dateTimeText": "May 15 • 9:00 PM",
      "priceText": "₦15,000 /Person",
      "attendees": {
        "total": 5,
        "avatars": []
      },
      "action": {
        "label": "View Event",
        "method": "GET",
        "endpoint": "/events/event-id"
      }
    }
  ]
}
```

Search events:

```http
GET /events/search?q=music&limit=20
Authorization: Bearer <access_token>
```

Calling search with a non-empty `q` saves the term into `recentSearches`.

Recent viewed event cards:

```http
GET /events/recent-views
Authorization: Bearer <access_token>
```

Record a view manually:

```http
POST /events/:id/views
Authorization: Bearer <access_token>
```

`GET /events/:id` also records a recent view automatically for published events.

## Event Details Screen

Use this endpoint for the full event details screen. The payload starts with the
event image in `hero.imageUrl`, then returns each visible section from the UI.

```http
GET /events/:id/details-screen
Authorization: Bearer <access_token>
```

Response shape:

```json
{
  "hero": {
    "imageUrl": "https://example.com/event.jpg",
    "title": "Deejay Coded Showcase",
    "categoryLabel": "Nightlife"
  },
  "summary": {
    "title": "Deejay Coded Showcase",
    "locationText": "Lekki, Lagos Nigeria",
    "dateTimeText": "May 15 • 9:00 PM",
    "attendeeCountLabel": "13,940+",
    "attendees": [],
    "inviteAction": {
      "label": "View invite",
      "endpoint": "/events/event-id/friends-attending"
    }
  },
  "about": {
    "title": "About Event",
    "description": "Experience one of the biggest Afrobeats festivals...",
    "readMore": { "enabled": true, "label": "Read more" }
  },
  "organizer": {
    "title": "Organizer",
    "host": {
      "name": "Vibez Nation",
      "caption": "Hosted by",
      "avatarUrl": "https://example.com/host.jpg"
    }
  },
  "directions": {
    "title": "Directions",
    "map": {
      "latitude": 6.4281,
      "longitude": 3.4219,
      "address": "Jagede Toyo No 4 Ibeju Lekki Lagos Nigeria"
    }
  },
  "featuredArtists": {
    "title": "Featured Artists (3)",
    "artists": []
  },
  "ticketCards": {
    "title": "Ticket Cards",
    "tickets": []
  },
  "countdown": {
    "title": "Event Start In",
    "days": "05",
    "hours": "22",
    "minutes": "05",
    "seconds": "01"
  },
  "comments": {
    "title": "3 Comments",
    "inputPlaceholder": "Leave a comment",
    "canView": true,
    "canPost": true,
    "accessNote": "People attending this event can leave comments",
    "seeAllAction": {
      "label": "See all",
      "method": "GET",
      "endpoint": "/events/event-id/comments"
    },
    "postAction": {
      "label": "Send",
      "method": "POST",
      "endpoint": "/events/event-id/comments",
      "body": {
        "message": "string"
      }
    },
    "items": []
  },
  "relatedEvents": {
    "title": "Other events you may like",
    "cards": []
  },
  "stickyPurchase": {
    "priceText": "₦80,000 /Person",
    "label": "Buy Tickets",
    "endpoint": "/events/event-id/tickets/purchase"
  }
}
```

### Ticket Checkout Flow

Use the checkout screen endpoint to power the ticket picker, the buyer form,
and the payment method bottom sheet:

```http
GET /events/:id/tickets/checkout-screen
Authorization: Bearer <access_token>
```

Use Stripe for card payments:

```http
POST /events/:id/tickets/stripe-intent
Authorization: Bearer <access_token>
```

The frontend should send one or more ticket items, then pass the returned
`paymentIntentId` back into:

```http
POST /events/:id/tickets/purchase
Authorization: Bearer <access_token>
```

Backend env vars for Stripe:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Use the test keys from the Stripe Dashboard in development. The secret key
stays on the backend. The publishable key can be exposed to the frontend. If
you later wire webhooks, the webhook secret comes from `stripe listen` or from
the webhook endpoint configuration in the Stripe Dashboard.

## Event Attendee Chat

Event comments are the chat for users attending the same event. Confirmed
ticket holders for that exact event can view and post. The event host,
collaborators, and admins can also view and post.

```http
GET /events/:id/comments
Authorization: Bearer <access_token>
```

Response:

```json
{
  "event": {
    "id": "event-id",
    "title": "Deejay Coded Showcase"
  },
  "canPost": true,
  "inputPlaceholder": "Leave a comment",
  "total": 1,
  "comments": [
    {
      "id": "comment-id",
      "message": "Who is coming from downtown?",
      "likeCount": 0,
      "createdAt": "2026-05-27T10:00:00.000Z",
      "author": {
        "id": "user-id",
        "name": "comms_daily",
        "username": "comms_daily",
        "avatarUrl": "https://example.com/avatar.jpg",
        "verified": false
      }
    }
  ]
}
```

Post a comment:

```http
POST /events/:id/comments
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "message": "Me, I am coming from there"
}
```

## Quick Curl Smoke Tests

Replace sample values with real production data where required.

```bash
curl -i https://<your-railway-domain>/
```

```bash
curl -i -X POST https://<your-railway-domain>/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"StrongPass1!"}'
```

```bash
curl -i -X POST https://<your-railway-domain>/auth/sign-in/sso \
  -H "Content-Type: application/json" \
  -d '{"provider":"google","credential":"google-id-token-from-gis"}'
```

```bash
curl -i -X POST https://<your-railway-domain>/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com"}'
```

```bash
curl -i -X POST https://<your-railway-domain>/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"RESET_TOKEN","oldPassword":"StrongPass1!","newPassword":"NewStrongPass1!"}'
```

```bash
curl -i -X POST https://<your-railway-domain>/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```
