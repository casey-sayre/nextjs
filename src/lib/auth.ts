// src/lib/auth.ts
// This file contains server-side authentication utilities.
// It should NOT have a 'use client' directive.

import { cookies, headers } from 'next/headers'; // 'cookies' is now async
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'; // For API route responses
import { sign, verify } from 'jsonwebtoken'; // For JWT handling
import jwkToPem from 'jwk-to-pem'; // To convert JWKS keys to PEM format
import { randomBytes, createHash } from 'crypto'; // For PKCE

// --- Environment Variables ---
// Using '!' for non-null assertion as these are expected to be present in .env.local
const COGNITO_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION!;
const COGNITO_USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const COGNITO_APP_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const COGNITO_REDIRECT_URI = process.env.COGNITO_REDIRECT_URI!; // No NEXT_PUBLIC_ prefix, as it's server-only
const AUTH_SECRET = process.env.AUTH_SECRET!; // Secret for signing session cookies

const COGNITO_AUTH_URL = `${COGNITO_DOMAIN}/oauth2/authorize`;
const COGNITO_TOKEN_URL = `${COGNITO_DOMAIN}/oauth2/token`;
const COGNITO_JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

// --- Session Cookie Name ---
const SESSION_COOKIE_NAME = 'app_session';
const PKCE_VERIFIER_COOKIE_NAME = 'pkce_code_verifier';

// --- Type Definitions ---
export interface AuthSession {
  userId: string;
  email: string;
  username: string; // Or whatever primary identifier you use
  role?: string; // Example role from Cognito groups or custom claims
  accessToken: string; // For making API calls to backend
  idToken: string; // For verifying identity
  exp: number; // Expiration timestamp (Unix epoch time in seconds)
}

// --- PKCE Utilities (Proof Key for Code Exchange) ---
// Generates a cryptographically random string for PKCE
function generateCodeVerifier(): string {
  // randomBytes(32) generates 32 random bytes
  // toString('base64url') encodes them securely for URL use
  return randomBytes(32).toString('base64url');
}

// Hashes the code verifier to create the code challenge
function generateCodeChallenge(verifier: string): string {
  const hash = createHash('sha256').update(verifier).digest('base64url');
  return hash;
}

// --- JWT Verification Cache ---
// Cache for PEM encoded public keys from Cognito's JWKS endpoint
let pems: { [key: string]: string } = {};

// Fetches and caches Cognito's JSON Web Key Set (JWKS)
async function fetchAndCacheCognitoJwks() {
  if (Object.keys(pems).length > 0) return; // Already cached

  try {
    const response = await fetch(COGNITO_JWKS_URL);
    const data = await response.json();

    pems = data.keys.reduce((acc: { [key: string]: string }, key: any) => {
      // Convert JWK (JSON Web Key) to PEM (Privacy-Enhanced Mail) format
      // This is necessary for 'jsonwebtoken' library to verify signatures.
      acc[key.kid] = jwkToPem({ kty: key.kty, n: key.n, e: key.e });
      return acc;
    }, {});
    console.log('Cognito JWKS fetched and cached.');
  } catch (error) {
    console.error('Error fetching Cognito JWKS:', error);
    pems = {}; // Clear cache on error
    throw new Error('Failed to fetch Cognito public keys.');
  }
}

// --- Main Authentication Functions ---

/**
 * Redirects the user's browser to the Cognito Hosted UI for login.
 * This function is typically called from a client component (e.g., login button click).
 */
export async function redirectToCognitoLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store the codeVerifier in an HttpOnly cookie for later PKCE validation
  // 'await cookies()' is crucial here as 'cookies()' is async in Next.js 15.x
  (await cookies()).set(PKCE_VERIFIER_COOKIE_NAME, codeVerifier, {
    httpOnly: true, // Not accessible by client-side JavaScript
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    path: '/', // Accessible across the entire domain
    maxAge: 60 * 5, // Valid for 5 minutes (for the duration of the login flow)
    sameSite: 'lax', // Protects against some CSRF attacks
  });

  const loginUrl = new URL(COGNITO_AUTH_URL);
  loginUrl.searchParams.append('response_type', 'code'); // Requesting an authorization code
  loginUrl.searchParams.append('client_id', COGNITO_APP_CLIENT_ID);
  loginUrl.searchParams.append('redirect_uri', COGNITO_REDIRECT_URI);
  loginUrl.searchParams.append('scope', 'openid profile email'); // Requesting standard OIDC scopes
  loginUrl.searchParams.append('code_challenge', codeChallenge);
  loginUrl.searchParams.append('code_challenge_method', 'S256'); // SHA256 hashing method for PKCE

  // Generate and append state for CSRF protection.
  // This value is verified upon redirect back from Cognito.
  const state = randomBytes(16).toString('hex');
  // 'await cookies()' is crucial here
  (await cookies()).set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 5, // Valid for 5 minutes
    sameSite: 'lax',
  });
  loginUrl.searchParams.append('state', state);

  // Perform the server-side redirect to the Cognito Hosted UI
  redirect(loginUrl.toString());
}

/**
 * Handles the callback from Cognito after a user logs in.
 * This function is used by the API Route (e.g., src/app/api/auth/callback/route.ts).
 */
export async function handleCognitoCallback(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code'); // The authorization code from Cognito
  const state = searchParams.get('state'); // The state parameter from Cognito
  const error = searchParams.get('error'); // Any error message from Cognito

  // 'await cookies()' is crucial here. Get the cookie store once for multiple operations.
  const cookieStore = await cookies();

  if (error) {
    console.error('Cognito Callback Error:', error);
    // Redirect to login page with an error message
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }

  // --- State Verification (CSRF Protection) ---
  const storedState = cookieStore.get('oauth_state')?.value;
  cookieStore.delete('oauth_state'); // Clear state cookie immediately after use
  if (!state || state !== storedState) {
    console.error('State mismatch in Cognito callback.');
    return NextResponse.redirect(new URL('/login?error=state_mismatch', request.url));
  }

  if (!code) {
    console.error('No authorization code received from Cognito.');
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  // --- PKCE Verifier Retrieval ---
  const codeVerifier = cookieStore.get(PKCE_VERIFIER_COOKIE_NAME)?.value;
  cookieStore.delete(PKCE_VERIFIER_COOKIE_NAME); // Clear verifier cookie immediately
  if (!codeVerifier) {
    console.error('No PKCE code verifier found in cookie.');
    return NextResponse.redirect(new URL('/login?error=pkce_missing', request.url));
  }

  try {
    // --- Exchange Authorization Code for Tokens ---
    const tokenResponse = await fetch(COGNITO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Construct the URL-encoded body for the token exchange request
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: COGNITO_APP_CLIENT_ID,
        redirect_uri: COGNITO_REDIRECT_URI,
        code, // The authorization code
        code_verifier: codeVerifier, // The PKCE code verifier
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Cognito Token Exchange Error:', errorData);
      throw new Error(`Failed to exchange code for tokens: ${errorData.error_description || tokenResponse.statusText}`);
    }

    const tokens = await tokenResponse.json();
    const { id_token, access_token, refresh_token, expires_in } = tokens;

    // --- Validate ID Token (CRITICAL SECURITY STEP) ---
    // Fetch and cache Cognito's public keys (JWKS) to verify JWT signatures
    await fetchAndCacheCognitoJwks();

    // Verify the ID Token's signature and claims
    // const decodedIdToken = verify(id_token, (header: any, callback: any) => {
    //   const pem = pems[header.kid];
    //   if (!pem) {
    //     return callback(new Error('Public key not found for token KID.'));
    //   }
    //   callback(null, pem);
    // }, {
    //   // Add standard JWT verification options:
    //   audience: COGNITO_APP_CLIENT_ID, // Ensure token is for your app client
    //   issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`, // Ensure token comes from correct issuer
    //   algorithms: ['RS256'], // Specify expected signing algorithm
    // }) as any; // Cast to any for now; in a real app, define a precise JWT payload interface

    const decodedIdToken: any = await new Promise((resolve, reject) => {
      verify(id_token, (header: any, callback: any) => { // Key provider callback
        const pem = pems[header.kid];
        if (!pem) {
          return callback(new Error('Public key not found for token KID.'));
        }
        callback(null, pem);
      }, { // Options for verification
        audience: COGNITO_APP_CLIENT_ID,
        issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`,
        algorithms: ['RS256'],
      }, (err, decoded) => { // Result callback for the verify function itself
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });

    const userId = decodedIdToken.sub; // Standard JWT 'subject' claim (Cognito user ID)
    const email = decodedIdToken.email; // Email claim
    const username = decodedIdToken['cognito:username'] || decodedIdToken.preferred_username; // Cognito username
    const roles = decodedIdToken['cognito:groups'] || []; // Example: Get roles from Cognito groups claim

    // --- Create and Sign App Session Cookie ---
    // This session payload will be stored in an HttpOnly cookie
    const sessionPayload: AuthSession = {
      userId,
      email,
      username,
      role: roles.length > 0 ? roles[0] : undefined, // Assign first role if available
      accessToken: access_token, // Store for future API calls
      idToken: id_token, // Store for client-side identity (if needed)
      exp: Math.floor(Date.now() / 1000) + expires_in, // Expiration timestamp
    };

    // Sign the session payload with your secret key.
    // This creates a secure, verifiable session cookie.
    const signedSession = sign(sessionPayload, AUTH_SECRET); // Session cookie valid for 1 hour

    // Set the HttpOnly session cookie
    // 'await cookies()' is crucial here
    cookieStore.set(SESSION_COOKIE_NAME, signedSession, {
      httpOnly: true, // Not accessible by client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      path: '/', // Accessible across the entire domain
      maxAge: 60 * 60, // 1 hour max age (match JWT expiry or less)
      sameSite: 'lax', // Protects against some CSRF attacks
    });

    // Optionally, store the refresh token in a long-lived, HttpOnly cookie for silent re-authentication.
    // This requires more advanced handling (e.g., checking expiration, calling token endpoint with refresh_token).
    // cookies().set('refresh_token', refresh_token, { /* ... longer maxAge ... */ });

    // Redirect the user to a protected page (e.g., /guitars) after successful login
    return NextResponse.redirect(new URL('/guitars', request.url));

  } catch (error) {
    console.error('Error during Cognito callback token exchange or verification:', error);
    return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
  }
}

/**
 * Retrieves and verifies the user's session from the HttpOnly cookie.
 * This function is used by Server Components and Server Actions.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  // Ensure Cognito public keys are cached for JWT verification
  await fetchAndCacheCognitoJwks();

  // 'await cookies()' is crucial here
  const sessionCookieStore = await cookies();
  const sessionCookie = sessionCookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null; // No session cookie found
  }

  try {
    // Verify the signed session cookie using your AUTH_SECRET
    const session = verify(sessionCookie, AUTH_SECRET) as AuthSession;

    // Check if the session is expired based on the 'exp' claim in the payload
    // 'exp' is in seconds, Date.now() is in milliseconds, so convert.
    if (session.exp * 1000 < Date.now()) {
      console.log('Session cookie expired.');
      await signOut(); // Automatically sign out if session expired
      return null;
    }

    // In a real application, you might also want to:
    // 1. Verify the 'accessToken' and 'idToken' within the session (if stored) against Cognito's JWKS
    //    for stronger security and freshness checks.
    // 2. Implement logic to refresh the accessToken silently if it's near expiration,
    //    using the refresh_token (if stored).

    return session;

  } catch (error) {
    console.error('Error verifying session cookie:', error);
    await signOut(); // Clear invalid or tampered session
    return null;
  }
}

/**
 * Signs out the user by deleting the session cookies.
 * This function is used by client components calling a server action.
 */
export async function signOut() {
  // 'await cookies()' is crucial here
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(PKCE_VERIFIER_COOKIE_NAME); // Clear any lingering PKCE cookies
  cookieStore.delete('oauth_state'); // Clear any lingering state cookies
}
