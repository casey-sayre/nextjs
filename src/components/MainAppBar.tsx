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

export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = useState(null); // State for anchoring the menu
  const open = Boolean(anchorEl); // Derived open state

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor when IconButton is clicked
  };

  const handleClose = () => {
    setAnchorEl(null); // Close menu when clicked outside or selecting an item
  };
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
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}