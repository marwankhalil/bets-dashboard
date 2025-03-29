import React, { useState } from 'react';
import { Button, Box, Typography, Paper, Stack, TextField, Alert } from '@mui/material';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

export default function Username({ onSubmit }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username.trim()) {
            setError('Username cannot be empty');
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            setLoading(false);
            return;
        }

        try {
            await onSubmit(username);
        } catch (error) {
            setError('Failed to set username. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="calc(100vh - 64px)"
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
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <PersonAddAltRoundedIcon fontSize="large" sx={{ color: '#00bcd4' }} />
                        <Typography variant="h5" fontWeight={700}>
                            Create Your <span style={{ color: '#00bcd4' }}>Username</span>
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="#cccccc">
                        This will be your display name in BetZone
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={!!error}
                                helperText={error}
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#2e2e2e',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#00bcd4',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#00bcd4',
                                        },
                                        color: '#ffffff',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#cccccc',
                                        '&.Mui-focused': {
                                            color: '#00bcd4',
                                        },
                                    },
                                    '& .MuiHelperText-root': {
                                        color: '#ff8a80',
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
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
                                {loading ? 'Setting username...' : 'Continue'}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Box>
    );
}
