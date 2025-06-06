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
import { useRouter } from 'next/router';
import { fetchUpcomingMatches } from '../lib/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const groupMatchesByDay = (matches) => {
  const groups = {};
  matches.forEach(match => {
    const date = new Date(match.match_date);
    const dayKey = date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(match);
  });
  return groups;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadMatches() {
      try {
        if (!user || !user.user_id) return;
        
        const data = await fetchUpcomingMatches(user.user_id);
        // Sort matches by match_date in ascending order
        const sortedMatches = (data.matches || []).sort((a, b) => 
          new Date(a.match_date) - new Date(b.match_date)
        );
        setMatches(sortedMatches);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [user]);

  const handleBetClick = (matchId, hasBet) => {
    if (!hasBet) {
      router.push(`/matches/${matchId}`);
    }
  };

  const matchGroups = groupMatchesByDay(matches);

  return (
    <ProtectedRoute>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.entries(matchGroups).map(([day, dayMatches]) => (
                <Box key={day}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {day}
                  </Typography>
                  <Grid container spacing={3}>
                    {dayMatches.map((match) => (
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

                            {/* Time */}
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
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              {new Date(match.match_date).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </Typography>

                            {/* Bet Button */}
                            <Button 
                              variant="contained" 
                              fullWidth
                              disabled={match.user_bet !== null}
                              onClick={() => handleBetClick(match.match_id, match.user_bet !== null)}
                              sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                bgcolor: match.user_bet !== null ? 'grey.400' : 'primary.main',
                                '&:hover': {
                                  bgcolor: match.user_bet !== null ? 'grey.400' : 'primary.dark'
                                }
                              }}
                            >
                              {match.user_bet !== null ? "Bet Placed" : "Place Bet"}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
