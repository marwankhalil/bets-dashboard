import { createContext, use, useContext, useEffect, useState } from 'react';
import { auth, provider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { login } from '../lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AUTH", user);
  }, [user])
  const handleGoogleLogin = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Get the ID token
      const token = await firebaseUser.getIdToken();
      
      // Call backend API to create/update user
      const loginResponse = await login({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        idToken: token
      });
      
      setUser(loginResponse);
      return loginResponse;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        const loginResponse = await login({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          idToken: token
        });
        setUser(loginResponse);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const loginResponse = await login({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            idToken: token
          });
          setUser(loginResponse);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, handleGoogleLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 