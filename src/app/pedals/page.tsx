'use client';

import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { Pedal } from '@/types/Pedal';
import PedalSummaryCard from '@/components/PedalSummaryCard';

export default function PedalsPage() {
  const [pedals, setPedals] = useState<Pedal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPedals() {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        // Construct the API URL. Use environment variable for flexibility.
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pedals`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Pedal[] = await response.json();
        setPedals(data);
      } catch (err: any) {
        console.error("Failed to fetch pedals:", err);
        setError(err.message || 'An unknown error occurred while fetching pedals.');
      } finally {
        setLoading(false);
      }
    }

    fetchPedals();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          All Pedals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Click on any card for more details.
        </Typography>
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
      ) : pedals.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No pedals found in the collection.
        </Alert>
      ) : (
        // Responsive Grid for PedalSummaryCard components
        <Grid container spacing={4} justifyContent="center">
          {pedals.map((pedal) => (
            <Grid key={pedal.id} size={{ sm: 12, md: 6, lg: 3}}>
              <PedalSummaryCard pedal={pedal} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}