'use client';

import * as React from 'react';
import Link from 'next/link';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Guitar } from '@/types/Guitar';

interface GuitarSummaryCardProps {
  guitar: Guitar;
}

const GuitarSummaryCard: React.FC<GuitarSummaryCardProps> = ({ guitar }) => {
  const guitarDetailUrl = `/guitars/${guitar.slug}`;
  return (
    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Guitar Summary
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          {guitar.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {guitar.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button size="small" component={Link} href={guitarDetailUrl}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default GuitarSummaryCard;