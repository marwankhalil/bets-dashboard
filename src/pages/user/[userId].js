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
  Skeleton
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
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Profile not found</Typography>
      </Box>
    );
  }

  const getStatusColor = (result) => {
    switch (result) {
      case 'won': return 'success';
      case 'lost': return 'error';
      default: return 'warning';
    }
  };

  const formatBetType = (bet) => {
    if (bet.advanced_bet_type === 'team_to_win') {
      const team = bet.bet_parameters?.team;
      if (team === 'team_1') return bet.team_1;
      if (team === 'team_2') return bet.team_2;
      return 'Draw';
    }
    return bet.advanced_bet_type;
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        👤 User Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                  <Avatar
                    sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                  >
                    {profile?.user?.username?.charAt(0)?.toUpperCase() || '?'}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {profile?.user?.username || 'User'}
                  </Typography>
                  <Chip
                    icon={<AccountBalance />}
                    label={`$${(profile?.user?.balance || 0).toFixed(2)}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Betting Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <TrendingUp sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6">{stats.totalBets}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Bets</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <EmojiEvents sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6">{stats.winRate.toFixed(1)}%</Typography>
                      <Typography variant="body2" color="text.secondary">Win Rate</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <AttachMoney sx={{ fontSize: 30, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h6">${stats.totalWagered.toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Wagered</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <AttachMoney sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6">${stats.totalWon.toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Won</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Chip
                    label={`${stats.wonBets} Won`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${stats.lostBets} Lost`}
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${stats.pendingBets} Pending`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* User Bets */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Bets
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {profile?.bets?.length > 0 ? (
                <Stack spacing={4}>
                  {/* Upcoming Bets - Only show for own profile */}
                  {(isOwnProfile || isAdmin) && upcoming.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Upcoming Bets
                      </Typography>
                      <Stack spacing={2}>
                        {upcoming.map((bet) => (
                          <Card key={bet.bet_id} variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    {bet.team_1} vs {bet.team_2}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(bet.match_date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </Typography>
                                </Box>
                                <Chip
                                  label="Upcoming"
                                  color="warning"
                                  size="small"
                                />
                              </Box>

                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Bet Amount
                                  </Typography>
                                  <Typography variant="body1">
                                    ${bet.bet_amount}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Odds
                                  </Typography>
                                  <Typography variant="body1">
                                    {bet.odds}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Bet On
                                  </Typography>
                                  <Typography variant="body1">
                                    {formatBetType(bet)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Potential Win
                                  </Typography>
                                  <Typography variant="body1">
                                    ${(parseFloat(bet.bet_amount) * parseFloat(bet.odds)).toFixed(2)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Past Bets - Show for all profiles */}
                  {past.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Past Bets
                      </Typography>
                      <Stack spacing={2}>
                        {past.map((bet) => (
                          <Card key={bet.bet_id} variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    {bet.team_1} vs {bet.team_2}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(bet.match_date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={bet.result.charAt(0).toUpperCase() + bet.result.slice(1)}
                                  color={getStatusColor(bet.result)}
                                  size="small"
                                />
                              </Box>

                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Bet Amount
                                  </Typography>
                                  <Typography variant="body1">
                                    ${bet.bet_amount}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Odds
                                  </Typography>
                                  <Typography variant="body1">
                                    {bet.odds}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Bet On
                                  </Typography>
                                  <Typography variant="body1">
                                    {formatBetType(bet)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    Potential Win
                                  </Typography>
                                  <Typography variant="body1">
                                    ${(parseFloat(bet.bet_amount) * parseFloat(bet.odds)).toFixed(2)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <SportsSoccer sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No bets yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get started by placing your first bet!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
