# VibezLink social signup and login setup

The frontend completes the Google, Facebook, or Apple provider flow. It then
sends the provider token to this API. The API verifies that token, reads the
verified provider user ID, email, full name, first and last names, and profile
picture, then returns the VibezLink user and a VibezLink JWT.

## Backend environment variables

Set these on Railway and restart the deployment:

```env
JWT_SECRET=<long-random-production-secret>
GOOGLE_CLIENT_ID=<google-web-oauth-client-id>
FACEBOOK_APP_ID=<meta-app-id>
FACEBOOK_APP_SECRET=<meta-app-secret>
APPLE_SERVICE_ID=<apple-services-id-for-the-web>
CORS_ORIGINS=http://localhost:5173,https://<frontend-domain>
```

`APPLE_CLIENT_ID` is also supported as an alias for `APPLE_SERVICE_ID`, and
`GOOGLE_OAUTH_CLIENT_ID` is supported as an alias for `GOOGLE_CLIENT_ID`.

Never place `FACEBOOK_APP_SECRET` or `JWT_SECRET` in frontend code or in a
`VITE_*` environment variable.

## Google Cloud Console

1. Open Google Cloud Console, create or select the VibezLink project, and
   configure the OAuth consent screen/Google Auth Platform branding.
2. Create a client with application type **Web application**.
3. Add the frontend origins under **Authorized JavaScript origins**:
   `http://localhost:5173` and `https://<frontend-domain>`.
4. The popup/callback version used by Google Identity Services does not require
   a backend redirect URL. If the frontend deliberately uses redirect mode,
   add its exact frontend receiver URL under **Authorized redirect URIs**.
5. Copy the Web client ID to both frontend configuration and Railway's
   `GOOGLE_CLIENT_ID`. Do not send a Google API access token to this API; send
   the Google Identity Services `credential` ID-token JWT.

Frontend to API:

```ts
await fetch(`${API_URL}/users/signup/sso`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'google',
    credential: googleCredentialResponse.credential,
    acceptedTerms: true,
  }),
});
```

For a returning user, send the same body without `acceptedTerms` to
`POST /auth/sign-in/sso`.

## Meta for Developers (Facebook)

1. Open Meta for Developers, create an app, and add the authentication/Facebook
   Login use case for a consumer-facing app.
2. In **Settings > Basic**, copy **App ID** and **App Secret** to Railway as
   `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`. Add the app domain, privacy
   policy URL, terms URL, and data-deletion instructions required for Live mode.
3. Enable the JavaScript SDK login and add `https://<frontend-domain>` to the
   allowed JavaScript SDK domains/origins.
4. Request `public_profile,email`. The backend requires Facebook to return an
   email address for a new account.
5. If the frontend SDK uses an OAuth redirect, add its exact frontend callback
   (for example `https://<frontend-domain>/auth/facebook/callback`) under
   **Valid OAuth Redirect URIs**. There is no `/auth/facebook/callback` route in
   this backend.
6. While the Meta app is in Development mode, only app roles/testers can log in.
   Complete the required review and switch it to Live before public use.

Frontend to API:

```ts
await fetch(`${API_URL}/users/signup/sso`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'facebook',
    accessToken: facebookAuthResponse.accessToken,
    acceptedTerms: true,
  }),
});
```

## Mobile frontend wiring

On mobile, the Facebook button should do two things:

1. Ask Facebook for a real provider `accessToken`.
2. Send that token to this backend.

Do not invent your own token string on the frontend. Use the token returned by
the Facebook SDK, then forward it to the API.

For a login button, call `POST /auth/sign-in/sso`:

```ts
async function signInWithFacebook(facebookAccessToken: string) {
  const response = await fetch(`${API_URL}/auth/sign-in/sso`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'facebook',
      accessToken: facebookAccessToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Facebook sign in failed');
  }

  return response.json();
}
```

For a signup button, call `POST /users/signup/sso` with `acceptedTerms: true`:

```ts
async function signUpWithFacebook(facebookAccessToken: string) {
  const response = await fetch(`${API_URL}/users/signup/sso`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'facebook',
      accessToken: facebookAccessToken,
      acceptedTerms: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Facebook signup failed');
  }

  return response.json();
}
```

Example React Native button:

```tsx
import { Pressable, Text } from 'react-native';

type Props = {
  onPress: () => Promise<void>;
};

export function FacebookLoginButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <Text>Continue with Facebook</Text>
    </Pressable>
  );
}
```

The backend returns the VibezLink JWT as `access_token`. Store that token and
use it for future API requests with `Authorization: Bearer <access_token>`.

## Apple Developer

Apple web login requires a paid Apple Developer membership and a primary App ID.

1. In **Certificates, Identifiers & Profiles**, enable **Sign in with Apple** on
   the primary App ID.
2. Register a **Services ID** such as `com.viblinkz.web`, enable Sign in with
   Apple, and associate it with the primary App ID.
3. Configure the production frontend domain and an exact frontend return URL,
   for example `https://<frontend-domain>/auth/apple/callback`. Apple requires
   HTTPS for the web return URL; use a development HTTPS URL for browser tests.
4. Put the Services ID in Railway as `APPLE_SERVICE_ID` and use that same value
   as the frontend Apple `clientId`.
5. Request the `name email` scopes. Apple supplies the name only on the first
   authorization, so the frontend must send it with that first identity token.

Frontend to API after the Apple callback:

```ts
await fetch(`${API_URL}/users/signup/sso`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'apple',
    identityToken: appleAuthorization.id_token,
    fullName: appleFullName,
    acceptedTerms: true,
  }),
});
```

## API responses and route behavior

New social account:

```json
{
  "message": "Social signup successful. You can continue onboarding.",
  "provider": "google",
  "isNewUser": true,
  "access_token": "vibezlink-jwt",
  "user": {
    "id": "uuid",
    "fullName": "Jane Doe",
    "name": "Jane Doe",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "profilePictureUrl": "https://provider.example/avatar.jpg",
    "country": "Nigeria",
    "plan": "free",
    "role": "user",
    "onboardingCompleted": false,
    "ssoProvider": "google"
  }
}
```

- `POST /users/signup/sso` creates a new user or signs in the already-linked
  user. This signup route requires `acceptedTerms: true`.
- `POST /auth/sign-in/sso` signs in an already-linked user.
- Store `access_token`; it is the VibezLink bearer token. Do not store or use the
  provider token as the VibezLink session token.
- Send authenticated API requests with `Authorization: Bearer <access_token>`.
