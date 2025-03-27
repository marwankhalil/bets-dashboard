import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box
} from '@mui/material';
import Link from 'next/link';
import { fetchUpcomingMatches } from '../lib/api'; // 👈 import

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

    useEffect(() => {
        async function loadMatches() {
          const data = await fetchUpcomingMatches();
          setMatches(data.matches || []);
        }
        loadMatches();
      }, []);

  return (
    <>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🧩 Match Grid
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Browse upcoming matches.
      </Typography>

      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} sm={6} md={4} key={match.match_id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#fff'
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Link href={`/matches/${match.match_id}`} passHref>
                  <Button variant="contained" fullWidth>
                    Bet Now
                  </Button>
                </Link>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
