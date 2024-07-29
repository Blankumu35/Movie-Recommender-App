import React, { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the user exists in MongoDB, if not create the user
        try {
          const response = await axios.post('http://localhost:5000/signup', {
            userId: user.uid,
            displayName: user.displayName,
            firstName: user.displayName.split(' ')[0],
            lastName: user.displayName.split(' ')[1] || '',
            email: user.email,
            photoURL: user.photoURL,
            profilePicColor: generateRandomColor(), // Assume you have a function to generate a random color
            signInMethod: 'google',
          });
          console.log(response.data);
        } catch (error) {
          console.error('Error signing up user:', error);
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const value = {
    currentUser,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Helper function to generate a random color
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};