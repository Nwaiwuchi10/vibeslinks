# Vibezlink Auth And Onboarding Frontend Handoff

Base URL:

```txt
https://<api-host>
```

Use JSON for every request unless noted.

## Production Environment

Required on Vercel:

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=1h
APP_URL=https://<api-host>
LOGIN_URL=https://<frontend-host>/login
RESET_PASSWORD_URL=https://<frontend-host>/reset-password
BREVO_API_KEY=...
MAIL_FROM_EMAIL=no-reply@yourdomain.com
MAIL_FROM_NAME=Vibezlink
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+15017122661
```

If using a Twilio Messaging Service, use this instead of `TWILIO_PHONE_NUMBER`:

```bash
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Phone numbers should be sent as E.164 when possible:

```txt
+14155552671
+2348012345678
+447911123456
```

If the frontend has a local number and selected country code, send both:

```json
{
  "phoneNumber": "4165551234",
  "countryCode": "+1"
}
```

## Email Signup

```http
POST /users/signup
```

```json
{
  "fullName": "Jane Doe",
  "username": "janedoe",
  "country": "United States",
  "email": "jane@example.com",
  "password": "StrongPass1!",
  "receivesNewsletter": true
}
```

Then verify the 6 digit code:

```http
POST /users/verify-email-code
```

```json
{
  "email": "jane@example.com",
  "code": "123456"
}
```

Resend code:

```http
POST /users/verification-code
```

```json
{
  "email": "jane@example.com"
}
```

## Phone Signup

```http
POST /users/signup/phone
```

```json
{
  "fullName": "Jane Doe",
  "username": "janedoe",
  "country": "Canada",
  "phoneNumber": "4165551234",
  "countryCode": "+1",
  "password": "StrongPass1!",
  "receivesNewsletter": true
}
```

Then verify the 6 digit code:

```http
POST /users/verify-phone-code
```

```json
{
  "phoneNumber": "4165551234",
  "countryCode": "+1",
  "code": "123456"
}
```

Resend code:

```http
POST /users/phone-verification-code
```

```json
{
  "phoneNumber": "4165551234",
  "countryCode": "+1"
}
```

## Login

Email or username:

```http
POST /auth/sign-in
```

```json
{
  "emailOrUsername": "janedoe",
  "password": "StrongPass1!"
}
```

Phone:

```http
POST /auth/sign-in/phone
```

```json
{
  "phoneNumber": "4165551234",
  "countryCode": "+1",
  "password": "StrongPass1!"
}
```

Store `access_token` and send it as:

```http
Authorization: Bearer <access_token>
```

## Password Reset

Email reset request:

```http
POST /auth/forgot-password
```

```json
{
  "email": "jane@example.com"
}
```

Email reset confirm:

```http
POST /auth/reset-password
```

```json
{
  "token": "token-from-reset-link",
  "oldPassword": "StrongPass1!",
  "newPassword": "NewStrongPass1!"
}
```

Phone reset request:

```http
POST /auth/forgot-password/phone
```

```json
{
  "phoneNumber": "4165551234",
  "countryCode": "+1"
}
```

Phone reset confirm:

```http
POST /auth/reset-password/phone
```

```json
{
  "phoneNumber": "4165551234",
  "countryCode": "+1",
  "code": "123456",
  "newPassword": "NewStrongPass1!"
}
```

## Username Availability

This is public so it can be used during signup:

```http
GET /users/username-availability?username=janedoe
```

Response:

```json
{
  "username": "janedoe",
  "available": true
}
```

## Onboarding

Options:

```http
GET /users/onboarding/options
```

Auth required.

Returns:

- step 1 interests
- step 2 location
- step 3 follow creators
- step 4 account confirmation
- step 5 become a host
- step 6 host application / submitted
- `maxInterests: 5`
- suggested creators/artists

Submit step 1:

```http
PATCH /users/onboarding
```

```json
{
  "step": 1,
  "interests": ["Afrobeats", "Amapiano", "EDM"]
}
```

Submit step 2:

```json
{
  "step": 2,
  "location": {
    "address": "Topaz Avenue",
    "streetNo": "12",
    "city": "Lekki",
    "state": "Lagos",
    "country": "Nigeria",
    "postalCode": "1234576521"
  }
}
```

Submit step 3:

```json
{
  "step": 3,
  "followedCreatorIds": ["creator-user-id"],
  "followCreatorsCompleted": true
}
```

Submit step 4:

```json
{
  "step": 4,
  "accountConfirmed": true
}
```

Submit step 5:

```json
{
  "step": 5,
  "hostIntroViewed": true
}
```

Submit step 6:

```json
{
  "step": 6,
  "becomeHost": true,
  "hostApplication": {
    "businessOrganizationName": "Vibez Events",
    "businessType": "Event organizer",
    "experience": "I organize live music events.",
    "email": "host@example.com",
    "instagram": "@vibez",
    "tiktok": "@vibez",
    "contact": "+2348000000000"
  },
  "complete": true
}
```

Skip:

```json
{
  "skip": true
}
```

## Vercel Deployment Check

The code builds for Vercel if the environment is configured.

Known requirements:

- `DATABASE_URL` must be present in production, or Railway must provide one of `DATABASE_PUBLIC_URL`, `DATABASE_PRIVATE_URL`, `DATABASE_URL_FIRST`, `DATABASE_URL_RAILWAY`, `RAILWAY_DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `DB_URL`, `DATABASE_CONNECTION_STRING`, or `POSTGRES_CONNECTION_STRING`.
- The local `.env` file is not part of the Railway runtime, so any database values that only exist there will not reach the deployed service.
- `JWT_SECRET` must be present in production.
- Email signup/reset needs `BREVO_API_KEY`, `MAIL_FROM_EMAIL`, and `MAIL_FROM_NAME`.
- Phone signup/reset needs Twilio env vars above.
- Twilio trial accounts may only send to verified recipient numbers.
- Use Vercel Environment Variables for Production, Preview, and Development as needed.
- The project currently uses TypeORM `synchronize: true`; this is convenient but schema-changing in production. A migration workflow is safer long term.

## Curl Verification Summary

Tested successfully:

- public username availability
- email signup
- email code verification
- login with username/password
- forgot password by email
- reset password by email token
- phone signup using Canada/US `+1`
- phone code verification
- phone login
- forgot password by phone
- reset password by phone code
- onboarding options
- onboarding completion
