import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBpWjr5xYmI1DCfw8iQyiT8W1iFkvHWqBM",
    authDomain: "bets-dashboard.firebaseapp.com",
    projectId: "bets-dashboard",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
