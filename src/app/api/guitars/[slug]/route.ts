import { NextResponse } from 'next/server';
import { mockGuitars } from '@/lib/mock-guitars'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const { slug } = await params;

  const guitar = mockGuitars.find(p => p.slug === slug);

  if (guitar) {
    return NextResponse.json(guitar, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Guitar not found' }, { status: 404 });
  }
}