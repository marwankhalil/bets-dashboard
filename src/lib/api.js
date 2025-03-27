// src/lib/api.js

const BASE_URL = process.env.BETS_AI_BACKEND_URL || 'http://127.0.0.1:5000'; // fallback to localhost if env var not set
const USER_ID = '550e8400-e29b-41d4-a716-446655440000'; // temp hardcoded

export async function fetchMatches() {
  const res = await fetch(`${BASE_URL}/matches`);
  return await res.json();
}

export async function fetchUpcomingMatches() {
    const res = await fetch(`${BASE_URL}/upcoming_matches`);
    return await res.json();
  }

export async function fetchMatchById(id) {
  const res = await fetch(`${BASE_URL}/matches/${id}`);
  return await res.json();
}

export async function placeBet(betData) {
  const res = await fetch(`${BASE_URL}/bets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(betData)
  });
  return await res.json();
}

export async function fetchUserBets() {
  const res = await fetch(`${BASE_URL}/bets/${USER_ID}`);
  return await res.json();
}
