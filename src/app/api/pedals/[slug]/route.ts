import { NextResponse } from 'next/server';
import { mockPedals } from '@/lib/mock-pedals'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const { slug } = await params;

  const pedal = mockPedals.find(p => p.slug === slug);

  if (pedal) {
    return NextResponse.json(pedal, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Pedal not found' }, { status: 404 });
  }
}