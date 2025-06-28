'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function HomePage() {
  const [slugInput, setSlugInput] = useState('');
  const router = useRouter(); // Initialize the router

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlugInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    if (slugInput.trim()) { // Ensure the input is not empty
      router.push(`/details/${slugInput.trim()}`); // Navigate to the dynamic route
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the Main App Page
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Enter a slug to view details:
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Enter Slug"
            variant="outlined" // Or 'filled', 'standard'
            value={slugInput}
            onChange={handleInputChange}
            placeholder="e.g., product-123" // Still useful for initial guidance
            sx={{ flexGrow: 1 }} // Allows TextField to grow and fill available space
          />
          <Button
            type="submit"
            variant="contained" // Or 'outlined', 'text'
            size="large"       // Or 'medium', 'small'
          >
            Go to Details
          </Button>
        </Box>
      </Box>
    </Container>
  );
}