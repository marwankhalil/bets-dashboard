import React from 'react';
import { Box } from '@mui/material';
import Username from '../components/Username';
import { useRouter } from 'next/router';
import { setUsername } from '../lib/api';
import { useAuth } from '../context/AuthContext';
export default function NewUser() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();

    const handleUsernameSet = async (username) => {
        try {
            const response = await setUsername(user.user_id, username); 
            console.log("RESPONSE", response);
            if (response.error) {
                return response.error;
            }
            await refreshUser();
            router.push('/matches');
        } catch (error) {
            console.error('Failed to set username:', error);
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
            <Username onSubmit={handleUsernameSet} />
        </Box>
    );
}
