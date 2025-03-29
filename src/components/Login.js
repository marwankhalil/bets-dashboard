import React, { useState } from 'react';
import { Button, Box, Typography, Paper, Stack, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { getAuth, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';
import { login, setUsername } from '../lib/api';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Username from './Username';

export default function Login() {
    const router = useRouter();
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUsername, setShowUsername] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loginResponse, setLoginResponse] = useState(null);

    // If user is already logged in and has a username, redirect to matches
    if (user && user.username && !showUsername) {
        router.push('/matches');
        return null;
    }

    const onGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Sign in with Google
            const result = await signInWithPopup(auth, provider);
            const user = result.user;            
            // Get the ID token
            const token = await user.getIdToken();
            
            // Call your backend API to create/update user
            const loginResponse = await login({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                idToken: token
            });

            setLoginResponse(loginResponse);

            if (!loginResponse.username) {
                setShowUsername(true);
                setUserData(loginResponse);
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

    const handleUsernameSet = async (username) => {
        try {
            await setUsername(loginResponse.user_id, username);
            router.push('/matches');
        } catch (error) {
            console.error('Failed to set username:', error);
            setError('Failed to set username. Please try again.');
        }
    };

    if (showUsername) {
        return <Username onSubmit={handleUsernameSet} />;
    }

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
                        Welcome to <span style={{ color: '#00bcd4' }}>BetZone</span>
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
