import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  Container,
  Paper,
  Divider
} from '@mui/material';
import Link from 'next/link';
import { fetchUpcomingMatches } from '../lib/api';

const statusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'warning';
    case 'upcoming':
    default: return 'default';
  }
};

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await fetchUpcomingMatches();
        setMatches(data.matches || []);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            mb: 1
          }}
        >
          Upcoming Matches
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Browse and place bets on upcoming matches
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography color="text.secondary">Loading matches...</Typography>
          </Box>
        ) : matches.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Typography color="text.secondary">
              No upcoming matches available at the moment.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {matches.map((match) => (
              <Grid item xs={12} sm={6} md={4} key={match.match_id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {/* Status Banner */}
                  <Box
                    className="match-status"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'secondary.main',
                      color: 'white',
                      py: 1,
                      px: 2,
                      transform: 'translateY(-100%)',
                      opacity: 0,
                      transition: 'all 0.3s ease-in-out',
                      zIndex: 1
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {match.match_status.toUpperCase()}
                    </Typography>
                  </Box>

                  {/* Main Content */}
                  <CardContent sx={{ 
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    {/* Teams */}
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'text.primary',
                          mb: 1
                        }}
                      >
                        {match.team_1}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'secondary.main',
                          mb: 2
                        }}
                      >
                        vs
                      </Typography>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'text.primary'
                        }}
                      >
                        {match.team_2}
                      </Typography>
                    </Box>

                    {/* Spacer to push date and button to bottom */}
                    <Box sx={{ flex: 1 }} />

                    {/* Date */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {new Date(match.match_date).toLocaleString()}
                    </Typography>

                    {/* Bet Button */}
                    <Link href={`/matches/${match.match_id}`} passHref>
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1rem',
                          bgcolor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.dark'
                          }
                        }}
                      >
                        Place Bet
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
