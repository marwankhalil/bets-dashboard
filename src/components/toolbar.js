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
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function TopToolbar() {
  const router = useRouter();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const open = Boolean(anchorEl);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    handleMenuClose();
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
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'flex-start' : 'center',
          px: isMobile ? 2 : 1,
        }}
      >
        {label}
      </Button>
    </Link>
  );

  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={mobileMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          minWidth: 200,
          bgcolor: '#1e1e1e',
          border: '1px solid #2e2e2e',
        }
      }}
    >
      {user && (
        <>
          <MenuItem sx={{ p: 0 }}>
            {navLink('/matches', 'MATCHES')}
          </MenuItem>
          <MenuItem sx={{ p: 0 }}>
            {navLink('/my-bets', 'MY BETS')}
          </MenuItem>
          <MenuItem sx={{ p: 0 }}>
            {navLink('/leaderboard', 'LEADERBOARD')}
          </MenuItem>
        </>
      )}
      {!user && (
        <MenuItem sx={{ p: 0 }}>
          <Button
            color="inherit"
            onClick={() => {
              router.push('/');
              handleMenuClose();
            }}
            sx={{
              color: '#ffffff',
              textTransform: 'none',
              width: '100%',
              justifyContent: 'flex-start',
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Login
          </Button>
        </MenuItem>
      )}
    </Menu>
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
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  BetZone
                </Typography>
              </Box>
            </a>
          </Link>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  mr: 1
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#00bcd4', 
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    Balance:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#ffffff', 
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    ${Number(user.balance || 0).toFixed(2)}
                  </Typography>
                </Box>
              )}
              <IconButton
                onClick={handleMobileMenuClick}
                sx={{ color: '#ffffff' }}
              >
                <MenuIcon />
              </IconButton>
              {renderMobileMenu()}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user && (
                <>
                  {navLink('/matches', 'MATCHES')}
                  {navLink('/my-bets', 'MY BETS')}
                  {navLink('/leaderboard', 'LEADERBOARD')}
                </>
              )}

              {user ? (
                <>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    mr: 1
                  }}>
                    <Typography variant="body2" sx={{ color: '#00bcd4', fontWeight: 600 }}>
                      Balance:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                      ${Number(user.balance || 0).toFixed(2)}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.username || 'User'}
                      src={user.photoURL}
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32
                      }}
                    >
                      {user.username ? user.username[0].toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => router.push('/')}
                  sx={{
                    color: '#ffffff',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
