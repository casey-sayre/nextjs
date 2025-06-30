# Demo - Guitar Equipment

nextjs react MUI cognito prisma postgres

## Authentication

```shell
# .env.local

# Next.js App Base URL (for API calls back to itself)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cognito User Pool Configuration
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_YQrR5MOCK
NEXT_PUBLIC_COGNITO_APP_CLIENT_ID=5o379a4fdt0updn6fjpf5nMOCK
NEXT_PUBLIC_COGNITO_DOMAIN=https://MOCK.auth.us-east-1.amazoncognito.com

# The Callback URL in your Next.js app that Cognito redirects to
COGNITO_REDIRECT_URI=http://localhost:3000/api/auth/callback

# A secret key for signing/encrypting cookies.
AUTH_SECRET=DEV-0197c107-c713-MOCK-MOCK-8a6abcaa3b3d-0197c108-MOCK-MOCK-9157-09cccc481930

```

token handling in `src/lib/auth.ts`

### Cognito User Pool App Client setup

Log in to the AWS Management Console, navigate to Cognito, select your User Pool, and then click on "App Clients" on the left.

Define your application

Application type: "Single-page application (SPA)".

Name your application:

Enter a descriptive name, e.g., nextjs-app-client or my-guitar-app-spa.

Enter a return URL: http://localhost:3000/api/auth/callback

On the `Login pages` add an `Allowed sign-out URL`: http://localhost:3000/api/auth/callback

Click the "Create app client" button at the bottom of this page.

Look under the "OAuth 2.0 grant types" section (or similar name).

Ensure that only Authorization code is checked. The "SPA" type should do this automatically.

OpenID Connect scopes: Ensure that openid, profile, and email are checked.

Identity providers:
Under "Identity providers", ensure Cognito user pool directory is checked.

