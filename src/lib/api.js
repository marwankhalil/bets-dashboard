// src/lib/api.js

const BASE_URL = process.env.NEXT_PUBLIC_BETS_API_BACKEND_URL || 'http://127.0.0.1:5000'; // fallback to localhost if env var not set
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

export async function fetchUserBets(user_id) {
  const res = await fetch(`${BASE_URL}/bets/${user_id}`);
  return await res.json();
}

export async function login(user) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firebase_uid: user.uid, email: user.email, id_token: user.idToken, display_name: user.displayName }),
  });
  return await res.json();
}

export async function setUsername(user_id, username) {
  const res = await fetch(`${BASE_URL}/api/set_username`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: user_id, username: username }),
  });
  return await res.json();
}