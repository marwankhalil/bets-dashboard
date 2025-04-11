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
          fontWeight: router.pathname === href ? 700 : 500,
          textTransform: 'none',
          fontSize: '0.95rem',
          letterSpacing: '0.5px',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: router.pathname === href ? '100%' : '0%',
            height: '2px',
            background: 'linear-gradient(45deg, #4ecca3, #6c63ff)',
            transition: 'width 0.3s ease',
          },
          '&:hover::after': {
            width: '100%',
          },
          '&:hover': {
            color: '#4ecca3',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.3s ease',
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
          bgcolor: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          '& .MuiMenuItem-root': {
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(78, 204, 163, 0.1)',
            }
          }
        }
      }}
    >
      {user && (
        <>
          <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
            <Link href="/matches" passHref>
              <Button
                fullWidth
                sx={{
                  color: '#ffffff',
                  fontWeight: router.pathname === '/matches' ? 700 : 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    color: '#4ecca3',
                    bgcolor: 'rgba(78, 204, 163, 0.1)',
                  }
                }}
              >
                MATCHES
              </Button>
            </Link>
          </MenuItem>
          <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
            <Link href={`/user/${user.user_id}`} passHref>
              <Button
                fullWidth
                sx={{
                  color: '#ffffff',
                  fontWeight: router.pathname === `/user/${user.user_id}` ? 700 : 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    color: '#4ecca3',
                    bgcolor: 'rgba(78, 204, 163, 0.1)',
                  }
                }}
              >
                MY PROFILE
              </Button>
            </Link>
          </MenuItem>
          <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
            <Link href="/leaderboard" passHref>
              <Button
                fullWidth
                sx={{
                  color: '#ffffff',
                  fontWeight: router.pathname === '/leaderboard' ? 700 : 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    color: '#4ecca3',
                    bgcolor: 'rgba(78, 204, 163, 0.1)',
                  }
                }}
              >
                LEADERBOARD
              </Button>
            </Link>
          </MenuItem>
        </>
      )}
      {!user && (
        <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
          <Button
            fullWidth
            color="inherit"
            onClick={() => {
              router.push('/');
              handleMenuClose();
            }}
            sx={{
              color: '#ffffff',
              textTransform: 'none',
              fontSize: '0.95rem',
              letterSpacing: '0.5px',
              justifyContent: 'flex-start',
              px: 2,
              py: 1.5,
              '&:hover': {
                color: '#4ecca3',
                bgcolor: 'rgba(78, 204, 163, 0.1)',
              }
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
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Link href="/matches" legacyBehavior>
            <a style={{ textDecoration: 'none', color: '#ffffff' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <SportsSoccerIcon sx={{ 
                  color: '#4ecca3',
                  fontSize: '2rem',
                  filter: 'drop-shadow(0 0 5px rgba(78, 204, 163, 0.5))'
                }} />
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ 
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    background: 'linear-gradient(45deg, #4ecca3, #6c63ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px'
                  }}
                >
                  BetZone
                </Typography>
              </Box>
            </a>
          </Link>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {user && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  bgcolor: 'rgba(78, 204, 163, 0.1)',
                  px: 2,
                  py: 0.75,
                  borderRadius: 3,
                  border: '1px solid rgba(78, 204, 163, 0.2)',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)'
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#4ecca3', 
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}
                  >
                    Balance:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#ffffff', 
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  >
                    ${Number(user.balance || 0).toFixed(2)}
                  </Typography>
                </Box>
              )}
              <IconButton
                onClick={handleMobileMenuClick}
                sx={{ 
                  color: '#ffffff',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              {renderMobileMenu()}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {user && (
                <>
                  {navLink('/matches', 'MATCHES')}
                  {navLink(`/user/${user.user_id}`, 'MY PROFILE')}
                  {navLink('/leaderboard', 'LEADERBOARD')}
                </>
              )}

              {user ? (
                <>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    bgcolor: 'rgba(78, 204, 163, 0.1)',
                    px: 2.5,
                    py: 1,
                    borderRadius: 3,
                    border: '1px solid rgba(78, 204, 163, 0.2)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 15px rgba(78, 204, 163, 0.2)'
                    }
                  }}>
                    <Typography variant="body2" sx={{ color: '#4ecca3', fontWeight: 600 }}>
                      Balance:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                      ${Number(user.balance || 0).toFixed(2)}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={handleAvatarClick} 
                    sx={{ 
                      p: 0,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Avatar
                      alt={user.username || 'User'}
                      src={user.photoURL}
                      sx={{ 
                        bgcolor: '#4ecca3',
                        width: 40,
                        height: 40,
                        border: '2px solid #6c63ff'
                      }}
                    >
                      {user.username ? user.username[0].toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 2,
                        bgcolor: 'rgba(26, 26, 46, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        color: '#ffffff',
                        '&:hover': {
                          bgcolor: 'rgba(78, 204, 163, 0.2)'
                        }
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => router.push('/')}
                  sx={{
                    color: '#ffffff',
                    textTransform: 'none',
                    bgcolor: 'rgba(78, 204, 163, 0.1)',
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    border: '1px solid rgba(78, 204, 163, 0.2)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'rgba(78, 204, 163, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 15px rgba(78, 204, 163, 0.2)'
                    }
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
