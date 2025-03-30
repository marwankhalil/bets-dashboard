import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Paper,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import { fetchUserBets } from '../lib/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
const resultColor = (result) => {
  switch (result) {
    case 'won': return 'success';
    case 'lost': return 'error';
    case 'pending':
    default: return 'warning';
  }
};

export default function MyBetsPage() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadBets() {
      try {
        const data = await fetchUserBets(user.user_id);
        setBets(data.bets || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBets();
  }, []);

  const sortByDate = (list, ascending = true) => 
    list.sort((a, b) => ascending 
      ? new Date(a.match_date) - new Date(b.match_date)
      : new Date(b.match_date) - new Date(a.match_date)
    );

  const upcomingBets = sortByDate(bets.filter(bet => bet.result === 'pending'), true);
  const pastBets = sortByDate(bets.filter(bet => bet.result !== 'pending'), false);

  const BetItem = ({ bet }) => (
    <Box
      sx={{
        py: 2,
        px: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        '&:hover': {
          borderColor: 'primary.main'
        }
      }}
    >
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '1.1rem'
              }}
            >
              {bet.team_1} vs {bet.team_2}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}
            >
              {new Date(bet.match_date).toLocaleString()}
            </Typography>
          </Box>
          {bet.result !== 'pending' && (
            <Chip
              label={bet.result?.toUpperCase()}
              color={resultColor(bet.result)}
              size="small"
              sx={{
                bgcolor: bet.result === 'won' ? 'success.light' : 'error.light',
                color: bet.result === 'won' ? 'success.dark' : 'error.dark',
                '& .MuiChip-label': {
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            Amount: ${bet.bet_amount}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            Odds: {bet.odds}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            Bet on: {bet.bet_type === 'team_1' ? bet.team_1 : bet.bet_type === 'team_2' ? bet.team_2 : 'Draw'}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

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
            My Bets
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            Track your upcoming and past bets
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography color="text.secondary">Loading your bets...</Typography>
            </Box>
          ) : bets.length === 0 ? (
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
                You haven't placed any bets yet.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={4}>
              {upcomingBets.length > 0 && (
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary'
                    }}
                  >
                    Upcoming Bets
                  </Typography>
                  <Stack spacing={2}>
                    {upcomingBets.map((bet) => (
                      <BetItem key={bet.bet_id} bet={bet} />
                    ))}
                  </Stack>
                </Box>
              )}

              {pastBets.length > 0 && (
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary'
                    }}
                  >
                    Past Bets
                  </Typography>
                  <Stack spacing={2}>
                    {pastBets.map((bet) => (
                      <BetItem key={bet.bet_id} bet={bet} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
