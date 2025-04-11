import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Alert,
  Stack,
  Container
} from '@mui/material';
import { fetchMatchById, placeBet } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const statusColor = (status) => {
  switch (status) {
    case 'completed': return '#4ecca3';
    case 'in_progress': return '#ffd700';
    case 'upcoming':
    default: return '#6c63ff';
  }
};

export default function MatchBetPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, refreshUser } = useAuth();

  const [match, setMatch] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [odds, setOdds] = useState({});
  const [betType, setBetType] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadMatch() {
      try {
        const data = await fetchMatchById(id);
        if (data && data.match) {
          setMatch(data.match);
          const odds = {
            team_1: data.match.odds_team_1,
            draw: data.match.odds_draw,
            team_2: data.match.odds_team_2
          };
          setOdds(odds);
        } else {
          router.push('/404');
        }
      } catch (err) {
        console.error(err);
        router.push('/404');
      }
    }
    if (id) {
      loadMatch();
    }
  }, [id]);

  const handleBet = async () => {
    setMessage(null);

    if (!betType) {
      setMessage({ type: 'error', text: 'Please select a team or draw to bet on.' });
      return;
    }

    if (!betAmount || isNaN(betAmount) || Number(betAmount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid bet amount.' });
      return;
    }

    if (Number(betAmount) > user.balance) {
      setMessage({ type: 'error', text: 'You do not have enough balance to place this bet.' });
      return;
    }

    try {
      const response = await placeBet({
        user_id: user.user_id,
        match_id: id,
        bet_type: betType,
        bet_amount: Number(betAmount),
        odds: parseFloat(odds[betType])
      });

      if (response && response.bet_id) {
        setMessage({ type: 'success', text: '✅ Bet placed successfully!' });
        setBetAmount('');
        setBetType(null);
        await refreshUser();
        router.push(`/user/${user.user_id}`);
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to place bet.' });
    }
  };

  if (!match) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      color: 'rgba(255, 255, 255, 0.7)'
    }}>
      <Typography>Loading...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="md">
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
            mb: 1,
            letterSpacing: '0.5px'
          }}
        >
          🧾 Place Your Bet
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 6,
            letterSpacing: '0.3px'
          }}
        >
          Match: {match.team_1} vs {match.team_2}
        </Typography>

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
            <Stack spacing={3}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    mb: 1
                  }}
                >
                  {match.team_1} vs {match.team_2}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
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
                  {new Date(match.match_date).toLocaleString()}
                </Typography>
                <Chip
                  label={match.match_status.toUpperCase()}
                  sx={{ 
                    bgcolor: `${statusColor(match.match_status)}20`,
                    color: statusColor(match.match_status),
                    border: `1px solid ${statusColor(match.match_status)}`,
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: `${statusColor(match.match_status)}30`
                    }
                  }}
                />
              </Box>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                '& .MuiChip-root': {
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(78, 204, 163, 0.2)'
                  }
                }
              }}>
                <Chip
                  label={`${match.team_1} (${odds.team_1})`}
                  clickable
                  variant={betType === 'team_1' ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: betType === 'team_1' ? 'rgba(78, 204, 163, 0.2)' : 'transparent',
                    color: betType === 'team_1' ? '#4ecca3' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${betType === 'team_1' ? 'rgba(78, 204, 163, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    fontWeight: 600
                  }}
                  onClick={() => setBetType('team_1')}
                />
                <Chip
                  label={`Draw (${odds.draw})`}
                  clickable
                  variant={betType === 'draw' ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: betType === 'draw' ? 'rgba(78, 204, 163, 0.2)' : 'transparent',
                    color: betType === 'draw' ? '#4ecca3' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${betType === 'draw' ? 'rgba(78, 204, 163, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    fontWeight: 600
                  }}
                  onClick={() => setBetType('draw')}
                />
                <Chip
                  label={`${match.team_2} (${odds.team_2})`}
                  clickable
                  variant={betType === 'team_2' ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: betType === 'team_2' ? 'rgba(78, 204, 163, 0.2)' : 'transparent',
                    color: betType === 'team_2' ? '#4ecca3' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${betType === 'team_2' ? 'rgba(78, 204, 163, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    fontWeight: 600
                  }}
                  onClick={() => setBetType('team_2')}
                />
              </Box>

              <TextField
                label="Bet Amount"
                type="number"
                fullWidth
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(78, 204, 163, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4ecca3',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#4ecca3',
                    },
                  },
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleBet}
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
                  }
                }}
              >
                Place Bet
              </Button>

              {message && (
                <Alert 
                  severity={message.type}
                  sx={{
                    bgcolor: message.type === 'error' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(78, 204, 163, 0.1)',
                    color: message.type === 'error' ? '#ff4444' : '#4ecca3',
                    border: `1px solid ${message.type === 'error' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(78, 204, 163, 0.2)'}`,
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    '& .MuiAlert-icon': {
                      color: message.type === 'error' ? '#ff4444' : '#4ecca3'
                    }
                  }}
                >
                  {message.text}
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
