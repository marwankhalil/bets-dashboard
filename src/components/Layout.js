import React from 'react';
import { Container, Box } from '@mui/material';
import TopToolbar from './NewToolbar';

export default function Layout({ children }) {
  return (
    <>
      <TopToolbar />
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          minHeight: '100vh',
          py: 6,
        }}
      >
        <Container maxWidth="md">
          {children}
        </Container>
      </Box>
    </>
  );
}
