'use client'
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { loginAction, logoutAction } from '@/actions/auth';
import { AuthSession } from '@/lib/auth';

interface MainAppBarProps {
  session: AuthSession | null; // Accept AuthSession from parent layout
}

export default function ButtonAppBar({ session }: MainAppBarProps) {
  const [anchorEl, setAnchorEl] = useState(null); // State for anchoring the menu
  const open = Boolean(anchorEl); // Derived open state of menu
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor when IconButton is clicked
  };

  const handleClose = () => {
    setAnchorEl(null); // Close menu when clicked outside or selecting an item
  };

  const handleLogin = async () => {
    // This will perform the server-side redirect to Cognito
    await loginAction();
  };

  const handleSignOut = async () => {
    // This will perform the server-side sign out (clear cookies)
    await logoutAction();
    router.refresh(); // Tell router to refresh current page to re-evaluate auth state
    router.push('/'); // Redirect to home page after sign out
  };

  const isAuthenticated = !!session;
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem component={Link} href="/guitars" onClick={handleClose}>Guitars</MenuItem>
            <MenuItem component={Link} href="/pedals" onClick={handleClose}>Pedals</MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Guitar Gear
          </Typography>
          {isAuthenticated ? (
              <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <Button color="inherit" onClick={handleLogin}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}