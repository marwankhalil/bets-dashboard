import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  Box
} from '@mui/material';
import { fetchUserBets } from '../lib/api';

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

  useEffect(() => {
    async function loadBets() {
      try {
        const data = await fetchUserBets();
        setBets(data.bets || []);
        console.log(data.bets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBets();
  }, []);

  if (loading) return <Typography>Loading your bets...</Typography>;

  const sortByDate = (list) => list.sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

  const upcomingBets = sortByDate(bets.filter(bet => bet.result === 'pending'));
  const pastBets = sortByDate(bets.filter(bet => bet.result !== 'pending'));

  const renderBets = (betList) => (
    <Stack spacing={3}>
      {betList.map((bet) => (
        <Card key={bet.bet_id} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {bet.team_1} vs {bet.team_2}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(bet.match_date).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Amount: ${bet.bet_amount} | Odds: {bet.odds}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Bet on: {bet.bet_type === 'team_1' ? bet.team_1 : bet.bet_type === 'team_2' ? bet.team_2 : 'Draw'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm="auto" sx={{ mt: { xs: 2, sm: 0 } }}>
                <Chip
                  label={bet.result?.toUpperCase() || 'PENDING'}
                  color={resultColor(bet.result)}
                  size="medium"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🎯 My Bets
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        View your upcoming and completed bets below.
      </Typography>

      {upcomingBets.length > 0 && (
        <>
          <Typography variant="h6" mb={2}>Upcoming Bets</Typography>
          {renderBets(upcomingBets)}
        </>
      )}

      {pastBets.length > 0 && (
        <Box mt={6}>
          <Typography variant="h6" mb={2}>Past Bets</Typography>
          {renderBets(pastBets)}
        </Box>
      )}

      {bets.length === 0 && (
        <Typography>No bets yet. Go place your first one!</Typography>
      )}
    </Box>
  );
}
