'use client';

import * as React from 'react';
import Link from 'next/link';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Pedal } from '@/types/Pedal';

interface PedalDetailCardProps {
  pedal: Pedal;
}

const PedalDetail: React.FC<PedalDetailCardProps> = ({ pedal: pedal }) => {
  return (
    <Card sx={{ minWidth: 275, boxShadow: 3 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Pedal Detail
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          {pedal.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pedal.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button size="small" component={Link} href="/pedals">
          Back to Pedals List
        </Button>
      </CardActions>
    </Card>
  );
};

export default PedalDetail;