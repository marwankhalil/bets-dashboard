import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchUserProfile } from '../../lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Stack,
  Divider,
  Skeleton,
  Container
} from '@mui/material';
import { AccountBalance, SportsSoccer, TrendingUp, EmojiEvents, AttachMoney } from '@mui/icons-material';

export default function UserProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchUserProfile(userId);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 6,
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.1) 0%, rgba(22, 33, 62, 0.1) 100%)',
          minHeight: '100vh'
        }}>
          <Skeleton 
            variant="rectangular" 
            height={200} 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }} 
          />
          <Skeleton 
            variant="rectangular" 
            height={400} 
            sx={{ 
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }} 
          />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 6,
          textAlign: 'center',
          color: '#ff4444'
        }}>
          <Typography>{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 6,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <Typography>Profile not found</Typography>
        </Box>
      </Container>
    );
  }

  const getStatusColor = (result) => {
    switch (result) {
      case 'won': return '#4ecca3';
      case 'lost': return '#ff4444';
      default: return '#ffd700';
    }
  };

  const calculateStats = (bets) => {
    if (!bets || bets.length === 0) return {
      totalBets: 0,
      wonBets: 0,
      lostBets: 0,
      pendingBets: 0,
      totalWagered: 0,
      totalWon: 0,
      winRate: 0
    };

    const stats = bets.reduce((acc, bet) => {
      acc.totalBets++;
      acc.totalWagered += parseFloat(bet.bet_amount);
      
      if (bet.result === 'won') {
        acc.wonBets++;
        acc.totalWon += parseFloat(bet.bet_amount) * parseFloat(bet.odds);
      } else if (bet.result === 'lost') {
        acc.lostBets++;
      } else {
        acc.pendingBets++;
      }
      
      return acc;
    }, {
      totalBets: 0,
      wonBets: 0,
      lostBets: 0,
      pendingBets: 0,
      totalWagered: 0,
      totalWon: 0
    });

    stats.winRate = stats.totalBets > 0 ? (stats.wonBets / (stats.wonBets + stats.lostBets)) * 100 : 0;

    return stats;
  };

  const stats = calculateStats(profile?.bets);

  const separateBets = (bets) => {
    if (!bets) return { upcoming: [], past: [] };
    
    const now = new Date();
    return bets.reduce((acc, bet) => {
      const matchDate = new Date(bet.match_date);
      if (matchDate > now) {
        acc.upcoming.push(bet);
      } else {
        acc.past.push(bet);
      }
      return acc;
    }, { upcoming: [], past: [] });
  };

  const { upcoming, past } = separateBets(profile?.bets);
  const isOwnProfile = user?.user_id === userId;
  const isAdmin = user?.user_id === "071cf80b-ccfc-4387-83a0-7396957ade62";

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        py: 6,
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.1) 0%, rgba(22, 33, 62, 0.1) 100%)',
        minHeight: '100vh'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4ecca3, #6c63ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            letterSpacing: '0.5px'
          }}
        >
          👤 User Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ 
                borderRadius: 3,
                bgcolor: 'rgba(26, 26, 46, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(78, 204, 163, 0.2)',
                  borderColor: 'rgba(78, 204, 163, 0.3)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    <Avatar
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mb: 2, 
                        bgcolor: '#4ecca3',
                        border: '2px solid #6c63ff',
                        boxShadow: '0 4px 20px rgba(78, 204, 163, 0.3)'
                      }}
                    >
                      {profile?.user?.username?.charAt(0)?.toUpperCase() || '?'}
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        mb: 2
                      }}
                    >
                      {profile?.user?.username || 'User'}
                    </Typography>
                    <Chip
                      icon={<AccountBalance sx={{ color: '#4ecca3' }} />}
                      label={`$${(profile?.user?.balance || 0).toFixed(2)}`}
                      sx={{
                        bgcolor: 'rgba(78, 204, 163, 0.1)',
                        color: '#4ecca3',
                        border: '1px solid rgba(78, 204, 163, 0.2)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        '&:hover': {
                          bgcolor: 'rgba(78, 204, 163, 0.2)'
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card sx={{ 
                borderRadius: 3,
                bgcolor: 'rgba(26, 26, 46, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(78, 204, 163, 0.2)',
                  borderColor: 'rgba(78, 204, 163, 0.3)'
                }
              }}>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#ffffff',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      mb: 2
                    }}
                  >
                    Betting Statistics
                  </Typography>
                  <Divider sx={{ 
                    mb: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <TrendingUp sx={{ 
                          fontSize: 30, 
                          color: '#4ecca3', 
                          mb: 1,
                          filter: 'drop-shadow(0 0 5px rgba(78, 204, 163, 0.3))'
                        }} />
                        <Typography 
                          variant="h6"
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 700
                          }}
                        >
                          {stats.totalBets}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            letterSpacing: '0.3px'
                          }}
                        >
                          Total Bets
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <EmojiEvents sx={{ 
                          fontSize: 30, 
                          color: '#4ecca3', 
                          mb: 1,
                          filter: 'drop-shadow(0 0 5px rgba(78, 204, 163, 0.3))'
                        }} />
                        <Typography 
                          variant="h6"
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 700
                          }}
                        >
                          {stats.winRate.toFixed(1)}%
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            letterSpacing: '0.3px'
                          }}
                        >
                          Win Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <AttachMoney sx={{ 
                          fontSize: 30, 
                          color: '#4ecca3', 
                          mb: 1,
                          filter: 'drop-shadow(0 0 5px rgba(78, 204, 163, 0.3))'
                        }} />
                        <Typography 
                          variant="h6"
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 700
                          }}
                        >
                          ${stats.totalWagered.toFixed(2)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            letterSpacing: '0.3px'
                          }}
                        >
                          Total Wagered
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <AttachMoney sx={{ 
                          fontSize: 30, 
                          color: '#4ecca3', 
                          mb: 1,
                          filter: 'drop-shadow(0 0 5px rgba(78, 204, 163, 0.3))'
                        }} />
                        <Typography 
                          variant="h6"
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 700
                          }}
                        >
                          ${stats.totalWon.toFixed(2)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            letterSpacing: '0.3px'
                          }}
                        >
                          Total Won
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    gap: 1
                  }}>
                    <Chip
                      label={`${stats.wonBets} Won`}
                      sx={{
                        bgcolor: 'rgba(78, 204, 163, 0.1)',
                        color: '#4ecca3',
                        border: '1px solid rgba(78, 204, 163, 0.2)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        '&:hover': {
                          bgcolor: 'rgba(78, 204, 163, 0.2)'
                        }
                      }}
                    />
                    <Chip
                      label={`${stats.lostBets} Lost`}
                      sx={{
                        bgcolor: 'rgba(255, 68, 68, 0.1)',
                        color: '#ff4444',
                        border: '1px solid rgba(255, 68, 68, 0.2)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 68, 68, 0.2)'
                        }
                      }}
                    />
                    <Chip
                      label={`${stats.pendingBets} Pending`}
                      sx={{
                        bgcolor: 'rgba(255, 215, 0, 0.1)',
                        color: '#ffd700',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 215, 0, 0.2)'
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* User Bets */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: 3,
              bgcolor: 'rgba(26, 26, 46, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(78, 204, 163, 0.2)',
                borderColor: 'rgba(78, 204, 163, 0.3)'
              }
            }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    mb: 2
                  }}
                >
                  User Bets
                </Typography>
                <Divider sx={{ 
                  mb: 3,
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }} />
                
                {profile?.bets?.length > 0 ? (
                  <Stack spacing={4}>
                    {/* Upcoming Bets - Only show for own profile */}
                    {(isOwnProfile || isAdmin) && upcoming.length > 0 && (
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            mb: 2
                          }}
                        >
                          Upcoming Bets
                        </Typography>
                        <Stack spacing={2}>
                          {upcoming.map((bet) => (
                            <Card 
                              key={bet.bet_id} 
                              sx={{ 
                                borderRadius: 3,
                                bgcolor: 'rgba(26, 26, 46, 0.3)',
                                backdropFilter: 'blur(5px)',
                                WebkitBackdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  bgcolor: 'rgba(26, 26, 46, 0.4)',
                                  borderColor: 'rgba(78, 204, 163, 0.3)'
                                }
                              }}
                            >
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box>
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        letterSpacing: '0.3px'
                                      }}
                                    >
                                      {bet.team_1} vs {bet.team_2}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mt: 1
                                      }}
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                      </svg>
                                      {new Date(bet.match_date).toLocaleString()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'right' }}>
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        color: '#4ecca3',
                                        fontWeight: 700
                                      }}
                                    >
                                      ${bet.bet_amount}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: 'rgba(255, 255, 255, 0.7)'
                                      }}
                                    >
                                      Odds: {bet.odds}
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* Past Bets */}
                    {past.length > 0 && (
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            mb: 2
                          }}
                        >
                          Past Bets
                        </Typography>
                        <Stack spacing={2}>
                          {past.map((bet) => (
                            <Card 
                              key={bet.bet_id} 
                              sx={{ 
                                borderRadius: 3,
                                bgcolor: 'rgba(26, 26, 46, 0.3)',
                                backdropFilter: 'blur(5px)',
                                WebkitBackdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  bgcolor: 'rgba(26, 26, 46, 0.4)',
                                  borderColor: 'rgba(78, 204, 163, 0.3)'
                                }
                              }}
                            >
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box>
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        letterSpacing: '0.3px'
                                      }}
                                    >
                                      {bet.team_1} vs {bet.team_2}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mt: 1
                                      }}
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                      </svg>
                                      {new Date(bet.match_date).toLocaleString()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'right' }}>
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        color: getStatusColor(bet.result),
                                        fontWeight: 700
                                      }}
                                    >
                                      ${bet.result === 'won' ? (bet.bet_amount * bet.odds).toFixed(2) : bet.bet_amount}
                                    </Typography>
                                    <Chip
                                      label={bet.result.toUpperCase()}
                                      size="small"
                                      sx={{
                                        bgcolor: `${getStatusColor(bet.result)}20`,
                                        color: getStatusColor(bet.result),
                                        border: `1px solid ${getStatusColor(bet.result)}`,
                                        backdropFilter: 'blur(5px)',
                                        WebkitBackdropFilter: 'blur(5px)',
                                        fontWeight: 600,
                                        '&:hover': {
                                          bgcolor: `${getStatusColor(bet.result)}30`
                                        }
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Typography 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    No bets found
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
