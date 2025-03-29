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
  Stack
} from '@mui/material';
import { fetchMatchById, placeBet } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const statusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'warning';
    case 'upcoming':
    default: return 'default';
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
        router.push('/my-bets');
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to place bet.' });
    }
  };

  if (!match) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🧾 Place Your Bet
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Match: {match.team_1} vs {match.team_2}
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">
                {match.team_1} vs {match.team_2}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(match.match_date).toLocaleString()}
              </Typography>
              <Chip
                label={match.match_status.toUpperCase()}
                color={statusColor(match.match_status)}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${match.team_1} (${odds.team_1})`}
                clickable
                variant={betType === 'team_1' ? 'filled' : 'outlined'}
                color={betType === 'team_1' ? 'primary' : 'default'}
                onClick={() => setBetType('team_1')}
              />
              <Chip
                label={`Draw (${odds.draw})`}
                clickable
                variant={betType === 'draw' ? 'filled' : 'outlined'}
                color={betType === 'draw' ? 'primary' : 'default'}
                onClick={() => setBetType('draw')}
              />
              <Chip
                label={`${match.team_2} (${odds.team_2})`}
                clickable
                variant={betType === 'team_2' ? 'filled' : 'outlined'}
                color={betType === 'team_2' ? 'primary' : 'default'}
                onClick={() => setBetType('team_2')}
              />
            </Box>

            <TextField
              label="Bet Amount"
              type="number"
              fullWidth
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBet}
            >
              Place Bet
            </Button>

            {message && (
              <Alert severity={message.type}>
                {message.text}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
