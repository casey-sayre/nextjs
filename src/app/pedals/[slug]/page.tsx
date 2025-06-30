import { notFound } from 'next/navigation';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

import { Guitar } from '@/types/Guitar';

import PedalDetailCard from '@/components/PedalDetailCard';
import { Pedal } from '@/types/Pedal';

interface DetailsPageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DetailsPage({ params, searchParams }: DetailsPageProps) {
  const { slug } = await params;

  let pedal: Pedal | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pedals/${slug}`);

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch pedal details: ${res.statusText} (${res.status})`);
    }
    pedal = await res.json();

  } catch (err: any) {
    console.error('Error fetching pedal details:', err);
    error = err.message || 'An unexpected error occurred.';
  }

  // Handle error state
  if (error || !pedal) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Guitar Details
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {error || `Guitar with slug "${slug}" could not be loaded.`}
        </Typography>
        <Button variant="contained" component={Link} href="/">
          Go back to Home
        </Button>
      </Container>
    );
  }

  // Render the GuitarDetailCard component, passing the fetched pedal data
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <PedalDetailCard pedal={pedal} />
    </Container>
  );
}