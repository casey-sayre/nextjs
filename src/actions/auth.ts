'use server';

import { redirectToCognitoLogin, signOut } from '@/lib/auth';

/**
 * Server Action to initiate the login flow by redirecting to Cognito.
 * Called directly from a client component.
 */
export async function loginAction() {
  await redirectToCognitoLogin();
}

/**
 * Server Action to sign out the user by clearing session cookies.
 * Called directly from a client component.
 */
export async function logoutAction() {
  await signOut();
}
