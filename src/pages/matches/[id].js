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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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

// Dummy player data
const dummyPlayers = {
  team_1: [
    { id: 1, name: 'John Smith', position: 'Forward', scoring_odds: 2.5 },
    { id: 2, name: 'Mike Johnson', position: 'Midfielder', scoring_odds: 3.0 },
    { id: 3, name: 'David Brown', position: 'Forward', scoring_odds: 2.8 },
    { id: 4, name: 'James Wilson', position: 'Defender', scoring_odds: 4.2 },
    { id: 5, name: 'Robert Taylor', position: 'Midfielder', scoring_odds: 3.5 },
    { id: 6, name: 'William Davis', position: 'Forward', scoring_odds: 2.9 },
    { id: 7, name: 'Thomas Anderson', position: 'Midfielder', scoring_odds: 3.2 },
    { id: 8, name: 'Daniel White', position: 'Forward', scoring_odds: 2.7 },
    { id: 9, name: 'Joseph Martin', position: 'Defender', scoring_odds: 4.5 }
  ],
  team_2: [
    { id: 10, name: 'Christopher Lee', position: 'Forward', scoring_odds: 2.7 },
    { id: 11, name: 'Andrew Clark', position: 'Midfielder', scoring_odds: 3.2 },
    { id: 12, name: 'Edward Lewis', position: 'Forward', scoring_odds: 2.9 },
    { id: 13, name: 'George Walker', position: 'Defender', scoring_odds: 4.0 },
    { id: 14, name: 'Henry Hall', position: 'Midfielder', scoring_odds: 3.4 },
    { id: 15, name: 'Charles Young', position: 'Forward', scoring_odds: 2.8 },
    { id: 16, name: 'Frank King', position: 'Midfielder', scoring_odds: 3.3 },
    { id: 17, name: 'Peter Scott', position: 'Forward', scoring_odds: 2.6 },
    { id: 18, name: 'Richard Green', position: 'Defender', scoring_odds: 4.3 }
  ]
};

// Dummy cards data
const cardsOptions = [
  { value: 2.5, label: '2.5 Cards', over_odds: 1.85, under_odds: 1.95 },
  { value: 3.5, label: '3.5 Cards', over_odds: 2.10, under_odds: 1.75 },
  { value: 4.5, label: '4.5 Cards', over_odds: 2.40, under_odds: 1.60 }
];

export default function MatchBetPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, refreshUser } = useAuth();

  const [match, setMatch] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [odds, setOdds] = useState({});
  const [betType, setBetType] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCardsOption, setSelectedCardsOption] = useState('');
  const [cardsBetType, setCardsBetType] = useState(null);

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

    if (!betType && !selectedPlayer && !cardsBetType) {
      setMessage({ type: 'error', text: 'Please select a bet type to place your bet.' });
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
      const betData = {
        user_id: user.user_id,
        match_id: id,
        bet_amount: Number(betAmount),
      };

      if (selectedPlayer) {
        betData.bet_type = `player_${selectedPlayer.id}`;
        betData.odds = selectedPlayer.scoring_odds;
      } else if (cardsBetType) {
        const selectedOption = cardsOptions.find(opt => opt.value === selectedCardsOption);
        betData.bet_type = `cards_${selectedCardsOption}_${cardsBetType}`;
        betData.odds = cardsBetType === 'over' ? selectedOption.over_odds : selectedOption.under_odds;
      } else {
        betData.bet_type = betType;
        betData.odds = parseFloat(odds[betType]);
      }

      const response = await placeBet(betData);

      if (response && response.bet_id) {
        setMessage({ type: 'success', text: '✅ Bet placed successfully!' });
        setBetAmount('');
        setBetType(null);
        setSelectedPlayer(null);
        setSelectedCardsOption('');
        setCardsBetType(null);
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

            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Match Result" />
              <Tab label="Player Scoring" />
              <Tab label="Total Cards" />
            </Tabs>

            {selectedTab === 0 ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Select match outcome:
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 2,
                  mt: 2
                }}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: betType === 'team_1' ? 'primary.main' : 'divider',
                      bgcolor: betType === 'team_1' ? 'primary.light' : 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light',
                        opacity: 0.9
                      }
                    }}
                    onClick={() => {
                      setBetType('team_1');
                      setSelectedPlayer(null);
                      setCardsBetType(null);
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {match.team_1}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 700,
                          mt: 1
                        }}
                      >
                        {odds.team_1}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: betType === 'draw' ? 'primary.main' : 'divider',
                      bgcolor: betType === 'draw' ? 'primary.light' : 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light',
                        opacity: 0.9
                      }
                    }}
                    onClick={() => {
                      setBetType('draw');
                      setSelectedPlayer(null);
                      setCardsBetType(null);
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Draw
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 700,
                          mt: 1
                        }}
                      >
                        {odds.draw}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: betType === 'team_2' ? 'primary.main' : 'divider',
                      bgcolor: betType === 'team_2' ? 'primary.light' : 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light',
                        opacity: 0.9
                      }
                    }}
                    onClick={() => {
                      setBetType('team_2');
                      setSelectedPlayer(null);
                      setCardsBetType(null);
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {match.team_2}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 700,
                          mt: 1
                        }}
                      >
                        {odds.team_2}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            ) : selectedTab === 1 ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Select a player to bet on them scoring:
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      fontWeight: 600
                    }}
                  >
                    {match.team_1}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    pb: 2,
                    mb: 4,
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.3)',
                      },
                    },
                  }}>
                    {dummyPlayers.team_1.map((player) => (
                      <Card
                        key={player.id}
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          borderColor: selectedPlayer?.id === player.id ? 'primary.main' : 'divider',
                          bgcolor: selectedPlayer?.id === player.id ? 'primary.light' : 'background.paper',
                          transition: 'all 0.2s ease-in-out',
                          minWidth: '200px',
                          flexShrink: 0,
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.light',
                            opacity: 0.9
                          }
                        }}
                        onClick={() => {
                          setSelectedPlayer(player);
                          setBetType(null);
                          setCardsBetType(null);
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              mb: 1
                            }}
                          >
                            {player.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {player.position}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: 'primary.main',
                              fontWeight: 700
                            }}
                          >
                            {player.scoring_odds}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      fontWeight: 600
                    }}
                  >
                    {match.team_2}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    pb: 2,
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.3)',
                      },
                    },
                  }}>
                    {dummyPlayers.team_2.map((player) => (
                      <Card
                        key={player.id}
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          borderColor: selectedPlayer?.id === player.id ? 'primary.main' : 'divider',
                          bgcolor: selectedPlayer?.id === player.id ? 'primary.light' : 'background.paper',
                          transition: 'all 0.2s ease-in-out',
                          minWidth: '200px',
                          flexShrink: 0,
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.light',
                            opacity: 0.9
                          }
                        }}
                        onClick={() => {
                          setSelectedPlayer(player);
                          setBetType(null);
                          setCardsBetType(null);
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600,
                              mb: 1
                            }}
                          >
                            {player.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {player.position}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: 'primary.main',
                              fontWeight: 700
                            }}
                          >
                            {player.scoring_odds}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Select total cards over/under:
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Cards Line</InputLabel>
                  <Select
                    value={selectedCardsOption}
                    label="Cards Line"
                    onChange={(e) => {
                      setSelectedCardsOption(e.target.value);
                      setCardsBetType(null);
                    }}
                  >
                    {cardsOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedCardsOption && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Over ${selectedCardsOption} (${cardsOptions.find(opt => opt.value === selectedCardsOption).over_odds})`}
                      clickable
                      variant={cardsBetType === 'over' ? 'filled' : 'outlined'}
                      color={cardsBetType === 'over' ? 'primary' : 'default'}
                      onClick={() => {
                        setCardsBetType('over');
                        setBetType(null);
                        setSelectedPlayer(null);
                      }}
                    />
                    <Chip
                      label={`Under ${selectedCardsOption} (${cardsOptions.find(opt => opt.value === selectedCardsOption).under_odds})`}
                      clickable
                      variant={cardsBetType === 'under' ? 'filled' : 'outlined'}
                      color={cardsBetType === 'under' ? 'primary' : 'default'}
                      onClick={() => {
                        setCardsBetType('under');
                        setBetType(null);
                        setSelectedPlayer(null);
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

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
