import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function TopToolbar() {
  // Replace these with your actual values or props
  const username = "John Doe";
  const balance = 1234.56;

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <AccountCircleIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {username}
          </Typography>
        </Box>
        
        <Typography variant="h6">
          ${balance.toLocaleString()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
