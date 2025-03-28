import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function TopToolbar() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLink = (href, label) => (
    <Link href={href} passHref>
      <Button
        sx={{
          color: '#ffffff',
          fontWeight: router.pathname === href ? 'bold' : 500,
          textTransform: 'none',
          borderBottom: router.pathname === href ? '2px solid #00bcd4' : 'none',
          borderRadius: 0,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {label}
      </Button>
    </Link>
  );

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: 'linear-gradient(to right, #141e30, #243b55)',
        borderBottom: '1px solid #2e2e2e'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link href="/matches" legacyBehavior>
            <a style={{ textDecoration: 'none', color: '#ffffff' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer'
                }}
              >
                <SportsSoccerIcon sx={{ color: '#00bcd4' }} />
                <Typography variant="h6" fontWeight={700}>
                  BetZone
                </Typography>
              </Box>
            </a>
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLink('/matches', 'MATCHES')}
            {navLink('/my-bets', 'MY BETS')}

            {/* Avatar & Menu */}
            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar
                alt="User"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#00bcd4',
                  color: '#000',
                  fontWeight: 600
                }}
              >
                U
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiPaper-root': {
                  bgcolor: '#1e1e1e',
                  color: '#fff'
                }
              }}
            >
              <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
