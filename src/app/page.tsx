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
          Guitar Gear Inventory and Journal
        </Typography>

      </Box>
    </Container>
  );
}