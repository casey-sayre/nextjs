import { NextResponse } from 'next/server';
import { mockGuitars } from '@/lib/mock-guitars'; // Import your mock data

// This function handles GET requests to /api/guitars
export async function GET(request: Request) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(mockGuitars, { status: 200 });
}
