import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Link from 'next/link';
import { fetchLeaderboard } from '../lib/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await fetchLeaderboard();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

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
            Leaderboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            Top players by balance
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography color="text.secondary">Loading leaderboard...</Typography>
            </Box>
          ) : users.length === 0 ? (
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
                No users found.
              </Typography>
            </Paper>
          ) : (
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((userData, index) => (
                    <TableRow 
                      key={userData.user_id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: userData.user_id === user?.user_id ? 'rgba(0, 188, 212, 0.1)' : 'inherit',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Link 
                          href={`/user/${userData.user_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: index === 0 ? '#FFD700' : 
                                    index === 1 ? '#C0C0C0' : 
                                    index === 2 ? '#CD7F32' : 'inherit',
                              fontWeight: index < 3 ? 700 : 400
                            }}
                          >
                            #{index + 1}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`/user/${userData.user_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{ 
                                bgcolor: 'primary.main',
                                width: 32,
                                height: 32
                              }}
                            >
                              {userData.username[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="body1">
                              {userData.username}
                            </Typography>
                          </Box>
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        <Link 
                          href={`/user/${userData.user_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600,
                              color: 'primary.main'
                            }}
                          >
                            ${Number(userData.balance).toFixed(2)}
                          </Typography>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </ProtectedRoute>
  );
} 