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
  useMediaQuery,
  Skeleton
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
            Leaderboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 4,
              letterSpacing: '0.3px'
            }}
          >
            Top players by balance
          </Typography>

          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              py: 4 
            }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton 
                  key={index}
                  variant="rectangular" 
                  height={60}
                  sx={{ 
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }} 
                />
              ))}
            </Box>
          ) : users.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: 'rgba(26, 26, 46, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                No users found.
              </Typography>
            </Paper>
          ) : (
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                bgcolor: 'rgba(26, 26, 46, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}>
                      Rank
                    </TableCell>
                    <TableCell sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}>
                      Player
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 600,
                        letterSpacing: '0.3px',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      Balance
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((userData, index) => (
                    <TableRow 
                      key={userData.user_id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: userData.user_id === user?.user_id ? 'rgba(78, 204, 163, 0.1)' : 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(78, 204, 163, 0.1)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(78, 204, 163, 0.1)'
                        }
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          py: 2
                        }}
                      >
                        <Link 
                          href={`/user/${userData.user_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: index === 0 ? '#FFD700' : 
                                    index === 1 ? '#C0C0C0' : 
                                    index === 2 ? '#CD7F32' : '#ffffff',
                              fontWeight: index < 3 ? 700 : 400,
                              letterSpacing: '0.3px',
                              textShadow: index < 3 ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
                            }}
                          >
                            #{index + 1}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', py: 2 }}>
                        <Link 
                          href={`/user/${userData.user_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{ 
                                bgcolor: '#4ecca3',
                                width: 40,
                                height: 40,
                                border: '2px solid #6c63ff',
                                boxShadow: '0 4px 20px rgba(78, 204, 163, 0.3)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 6px 24px rgba(78, 204, 163, 0.4)'
                                }
                              }}
                            >
                              {userData.username[0].toUpperCase()}
                            </Avatar>
                            <Typography 
                              variant="body1"
                              sx={{ 
                                color: '#ffffff',
                                fontWeight: 500,
                                letterSpacing: '0.3px'
                              }}
                            >
                              {userData.username}
                            </Typography>
                          </Box>
                        </Link>
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', py: 2 }}
                      >
                        <Link 
                          href={`/user/${userData.user_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#4ecca3',
                              letterSpacing: '0.3px',
                              textShadow: '0 0 10px rgba(78, 204, 163, 0.3)'
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