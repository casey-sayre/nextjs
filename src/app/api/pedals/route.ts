import { NextResponse } from 'next/server';
import { mockPedals } from '@/lib/mock-pedals';

// This function handles GET requests to /api/pedals
export async function GET(request: Request) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(mockPedals, { status: 200 });
}
