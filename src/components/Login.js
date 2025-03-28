import React from 'react';
import { Button, Box, Typography, Paper, Stack } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

export default function Login({ onLogin }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(to right, #141e30, #243b55)',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          px: 5,
          py: 6,
          borderRadius: 6,
          minWidth: 360,
          maxWidth: '90%',
          textAlign: 'center',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={700}>
            Welcome to <span style={{ color: '#00bcd4' }}>BetZone</span>
          </Typography>
          <Typography variant="body2" color="#cccccc">
            Dive into the game and compete with your friends.
          </Typography>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={onLogin}
            size="large"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#00bcd4',
              '&:hover': { bgcolor: '#00acc1' },
              color: '#000',
            }}
          >
            Sign in with Google
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
