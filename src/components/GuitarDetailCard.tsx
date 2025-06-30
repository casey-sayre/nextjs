'use client';

import * as React from 'react';
import Link from 'next/link';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { type Guitar } from '@/types/Guitar';

interface GuitarDetailCardProps {
  guitar: Guitar;
}

const GuitarDetailCard: React.FC<GuitarDetailCardProps> = ({ guitar }) => {
  return (
    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Full Guitar Details
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          {guitar.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Slug: {guitar.slug}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {guitar.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" component="div">
            Strings:
          </Typography>
          <Typography variant="body2">
            Size: {guitar.strings.size}
          </Typography>
          <Typography variant="body2">
            Last Changed: {guitar.strings.lastChanged}
          </Typography>
        </Box>

      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button size="small" component={Link} href="/guitars">
          Back to Guitars List
        </Button>
      </CardActions>
    </Card>
  );
};

export default GuitarDetailCard;