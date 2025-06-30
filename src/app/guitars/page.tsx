'use client';

import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { Guitar } from '@/types/Guitar';
import GuitarSummaryCard from '@/components/GuitarSummaryCard';
import { Fab, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function GuitarsPage() {
  const [guitars, setGuitars] = useState<Guitar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuitars() {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        // Construct the API URL. Use environment variable for flexibility.
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/guitars`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Guitar[] = await response.json();
        setGuitars(data);
      } catch (err: any) {
        console.error("Failed to fetch guitars:", err);
        setError(err.message || 'An unknown error occurred while fetching guitars.');
      } finally {
        setLoading(false);
      }
    }

    fetchGuitars();
  }, []);

  let g = {
    slug: "ss",
    name: "sss",
    description: "xxx",
    strings: {
      size: "8", // "8", "9", "10"
      lastChanged: "" // YYYY-mm-dd
    }
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          All Guitars
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Click on any card for more details.
        </Typography>
        <Box sx={{
          position: 'fixed', // Keep it in place as the user scrolls
          bottom: { xs: 16, md: 24 }, // Bottom margin (adjust for different screen sizes)
          right: { xs: 16, md: 24 },  // Right margin
          zIndex: 1000 // Ensure it's above other content
        }}>
          <Fab
            color="primary" // Uses your theme's primary color
            aria-label="add" // Important for accessibility
            component={Link} // Crucial: use Next.js Link for client-side navigation
            href="/guitars/new" // The URL path to your new guitar form page
          >
            <AddIcon /> {/* The plus icon */}
          </Fab>
        </Box>
      </Box>

      {/* Conditional Rendering based on loading, error, and data state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error} Please try again later.
        </Alert>
      ) : guitars.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No guitars found in the collection.
        </Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {guitars.map((guitar) => (
            <Grid key={guitar.id} size={{ sm: 12, md: 6, lg: 3 }}>
              <GuitarSummaryCard guitar={guitar} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}