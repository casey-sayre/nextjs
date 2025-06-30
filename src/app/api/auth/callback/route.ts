import { handleCognitoCallback } from '@/lib/auth';

// This function will be called by Next.js for GET requests to /api/auth/callback
// It takes the incoming Request object and returns a NextResponse.
export async function GET(request: Request) {
  return handleCognitoCallback(request);
}
