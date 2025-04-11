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
        <Box sx={{ 
          py: 6,
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.1) 0%, rgba(22, 33, 62, 0.1) 100%)',
          minHeight: '100vh'
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #4ecca3, #6c63ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              letterSpacing: '0.5px'
            }}
          >
            Upcoming Matches
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 6,
              letterSpacing: '0.3px'
            }}
          >
            Browse and place bets on upcoming matches
          </Typography>

          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              py: 6,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <Typography>Loading matches...</Typography>
            </Box>
          ) : matches.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                bgcolor: 'rgba(26, 26, 46, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                No upcoming matches available at the moment.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(matchGroups).map(([day, dayMatches]) => (
                <Box key={day}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#4ecca3',
                      fontWeight: 600,
                      mb: 3,
                      pb: 1,
                      borderBottom: '2px solid',
                      borderColor: 'rgba(78, 204, 163, 0.2)',
                      letterSpacing: '0.5px'
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
                            bgcolor: 'rgba(26, 26, 46, 0.5)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease-in-out',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 12px 40px rgba(78, 204, 163, 0.2)',
                              borderColor: 'rgba(78, 204, 163, 0.3)',
                              '& .match-status': {
                                transform: 'translateY(0)',
                                opacity: 1
                              }
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
                              bgcolor: 'rgba(78, 204, 163, 0.2)',
                              color: '#4ecca3',
                              py: 1,
                              px: 2,
                              transform: 'translateY(-100%)',
                              opacity: 0,
                              transition: 'all 0.3s ease-in-out',
                              zIndex: 1,
                              backdropFilter: 'blur(5px)',
                              WebkitBackdropFilter: 'blur(5px)'
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
                                  color: '#ffffff',
                                  mb: 1,
                                  letterSpacing: '0.5px'
                                }}
                              >
                                {match.team_1}
                              </Typography>
                              <Typography 
                                variant="h6" 
                                component="h2" 
                                sx={{ 
                                  fontWeight: 700,
                                  color: '#4ecca3',
                                  mb: 2,
                                  letterSpacing: '0.5px'
                                }}
                              >
                                vs
                              </Typography>
                              <Typography 
                                variant="h6" 
                                component="h2" 
                                sx={{ 
                                  fontWeight: 700,
                                  color: '#ffffff',
                                  letterSpacing: '0.5px'
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
                              sx={{ 
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'rgba(255, 255, 255, 0.7)'
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
                                bgcolor: 'rgba(78, 204, 163, 0.2)',
                                color: '#4ecca3',
                                border: '1px solid rgba(78, 204, 163, 0.3)',
                                backdropFilter: 'blur(5px)',
                                WebkitBackdropFilter: 'blur(5px)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  bgcolor: 'rgba(78, 204, 163, 0.3)',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 5px 15px rgba(78, 204, 163, 0.2)'
                                },
                                '&.Mui-disabled': {
                                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                                  color: 'rgba(255, 255, 255, 0.3)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            >
                              {match.user_bet !== null ? 'Bet Placed' : 'Place Bet'}
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
