// src/components/EditGuitarForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Link from 'next/link';

import { type Guitar } from '@/types/Guitar';
import { updateGuitar } from '@/actions/guitars';

interface EditGuitarFormProps {
  guitar: Guitar;
}

export default function EditGuitarForm({ guitar }: EditGuitarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Add hidden fields for ID and original slug
    formData.append('id', guitar.id);
    formData.append('originalSlug', guitar.slug); // Pass the original slug for revalidation

    try {
      const result = await updateGuitar(formData);
      if (result && result.error) {
        setError(result.error);
        setSuccess(null);
      }
    } catch (e: any) {
      console.error("Client-side error during form submission:", e);
      setError(e.message || "An unexpected error occurred.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      action={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: 1,
      }}
    >
      <input type="hidden" name="id" value={guitar.id} />
      <input type="hidden" name="originalSlug" value={guitar.slug} />

      <TextField
        label="Guitar Name"
        name="name"
        variant="outlined"
        fullWidth
        required
        defaultValue={guitar.name}
      />
      <TextField
        label="Description"
        name="description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        required
        defaultValue={guitar.description}
      />
      <TextField
        label="Strings Size (e.g., 9, 10)"
        name="stringsSize"
        variant="outlined"
        fullWidth
        required
        defaultValue={guitar.strings.size}
      />
      <TextField
        label="Strings Last Changed Date (YYYY-MM-DD)"
        name="stringsLastChanged"
        variant="outlined"
        fullWidth
        required
        placeholder="YYYY-MM-DD"
        defaultValue={guitar.strings.lastChanged}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="outlined" component={Link} href={`/guitars/${guitar.slug}`} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Stack>
    </Box>
  );
}