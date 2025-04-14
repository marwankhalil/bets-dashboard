import React, { useState } from 'react';
import { Button, Box, Typography, Paper, Stack, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const router = useRouter();
    const { user, handleGoogleLogin } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // If user is already logged in and has a username, redirect to matches
    if (user && user.username) {
        router.push('/matches');
        return null;
    } else if (user && !user.username) {
        router.push('/new-user');
        return null;
    }

    const onGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const loginResponse = await handleGoogleLogin();
            
            if (!loginResponse.username) {
                router.push('/new-user');
            } else {
                router.push('/matches');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="calc(100vh - 64px)" // Subtract the height of the toolbar
            sx={{
                background: (theme) => theme.palette.background.default,
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
                        Welcome to <span style={{ color: '#00bcd4' }}>FantasyBets</span>
                    </Typography>
                    <Typography variant="body2" color="#cccccc">
                        Dive into the game and compete with your friends.
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <Button
                        variant="contained"
                        startIcon={<GoogleIcon />}
                        onClick={onGoogleLogin}
                        size="large"
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            bgcolor: '#00bcd4',
                            '&:hover': { bgcolor: '#00acc1' },
                            color: '#000',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
