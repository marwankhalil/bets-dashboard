import React from 'react';
import { Button, Box, Typography, TextField, Paper, Stack } from '@mui/material';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

export default function SetUsername({ onSubmit }) {
  const [username, setUsername] = React.useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

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
          minWidth: 400,
          maxWidth: '90%',
          textAlign: 'center',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        }}
      >
        <Stack spacing={4}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <PersonAddAltRoundedIcon fontSize="large" sx={{ color: '#00bcd4' }} />
            <Typography variant="h5" fontWeight={700}>
              Create Your <span style={{ color: '#00bcd4' }}>Username</span>
            </Typography>
          </Box>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="e.g. footyking42"
            sx={{
              input: { color: '#ffffff' },
              label: { color: '#cccccc' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00bcd4' },
                '&:hover fieldset': { borderColor: '#00acc1' },
                '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
              },
            }}
            InputLabelProps={{ style: { color: '#cccccc' } }}
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={!username.trim()}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#00bcd4',
              '&:hover': { bgcolor: '#00acc1' },
              color: '#000',
              opacity: username.tr,
              color: '#000',
            }}
          >
            Save and Continue
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
