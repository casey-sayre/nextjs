// src/app/guitars/[slug]/edit/page.tsx
// This is a SERVER COMPONENT (default in App Router)
// It fetches the existing guitar data from the server-side API or DB.

import { notFound } from 'next/navigation'; // For handling 404 cases
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'; // For displaying fetch errors
import Button from '@mui/material/Button'; // For the "Back to list" button in error state
import Link from 'next/link'; // For Next.js Link in error state

import { type Guitar } from '@/types/Guitar'; // Import the Guitar type definition
import EditGuitarForm from '@/components/EditGuitarForm'; // Import the Client Component form

interface EditGuitarPageProps {
  params: {
    slug: string; // The dynamic segment (slug) from the URL, e.g., 'stratocaster-american-pro'
  };
}

// This async function is the Server Component for the edit page.
export default async function EditGuitarPage({ params }: EditGuitarPageProps) {
  // Await params to ensure the slug is resolved, as per Next.js error messages.
  const { slug } = await params;

  let guitar: Guitar | null = null;
  let error: string | null = null;

  try {
    // Fetch the existing guitar data from your mock API route.
    // In a real application with Prisma, you would directly query your database here:
    // guitar = await prisma.guitar.findUnique({ where: { slug: slug } });
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/guitars/${slug}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // If the response is 404, use Next.js's `notFound()` function.
      // This will render the nearest `not-found.tsx` file or the default 404 page.
      if (response.status === 404) {
        notFound();
      }
      // For other HTTP errors, throw an error to be caught by the catch block.
      throw new Error(`Failed to fetch guitar for editing: ${response.statusText} (${response.status})`);
    }

    // Parse the JSON response into the Guitar type.
    guitar = await response.json();

  } catch (err: any) {
    // Catch any errors during the fetch process (e.g., network issues, API errors).
    console.error('Error fetching guitar for editing:', err);
    error = err.message || 'An unexpected error occurred while fetching guitar data.';
  }

  // --- Render Error/Not Found State ---
  // If an error occurred during fetching or the guitar data is null (and notFound() wasn't called),
  // display an error message to the user.
  if (error || !guitar) {
    return (
      <Container maxWidth="sm" sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Guitar for Editing
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {error || `Guitar with slug "${slug}" could not be found for editing.`}
        </Typography>
        {/* Provide a way for the user to navigate back */}
        <Button variant="contained" component={Link} href="/guitars">
          Back to Guitars List
        </Button>
      </Container>
    );
  }

  // --- Render the Edit Form ---
  // If the guitar data was successfully fetched, render the Client Component form.
  // We pass the fetched `guitar` object as a prop to pre-populate the form fields.
  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Guitar: {guitar.name}
        </Typography>
      </Box>
      {/* The EditGuitarForm component (Client Component) is rendered here. */}
      {/* It receives the guitar data fetched by this Server Component. */}
      <EditGuitarForm guitar={guitar} />
    </Container>
  );
}