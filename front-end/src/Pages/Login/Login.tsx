import './Login.css';
import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import GoogleButton from 'react-google-button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {auth, db, signInWithGoogle} from "../../firebase/firebase"
import { doSignInWithEmailandPassword, doSignInWithGoogle } from '../../firebase/auth';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [signInMethod, setSignInMethod] = useState('google.com');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: '/' } };

    // Handle Email/Password Login
   const login = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
        setIsSigningIn(true);
        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                email,
                password,
            });

            if (response.status === 200) {
                const { userId } = response.data;
                console.log(response.data)

  
                localStorage.setItem("ID", userId);

                navigate('/');
                window.location.reload();
            } else {
                setErrorMessage('Invalid email or password');
                setIsSigningIn(false);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Internal Server Error');
            setIsSigningIn(false);
        }
    }
};
const onGoogleSignIn = async () => {
  if (!isSigningIn) {
    setIsSigningIn(true);
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      console.log(user)
      
      // Extract the user information
      const { displayName, email, photoURL, uid } = user;
      // Check if the user already exists in Firestore
      

      console.log(user.displayName)

      // Send the user data to the backend for any additional processing
      const response = await axios.post('http://localhost:5000/auth/google-login', {
        uid,
        displayName,
        email,
        photoURL,
        signInMethod: 'google',
      });

      if (response.status === 200) {
        // Navigate to the home page after a successful login
        
        localStorage.setItem('ID', uid)
        navigate('/');
        window.location.reload()
      } else {
        setErrorMessage('Failed to log in with Google');
      }

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSigningIn(false);
    }
  }
};


    return (
        <div className='wrapper'>
            <form onSubmit={login}>
                <h1 style={{ paddingBottom: 30 }}>Login</h1>
                <div className='input-box'>
                    <input
                        type='text'
                        placeholder='Email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input
                        type='password'
                        placeholder='Password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className='icon' />
                </div>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                <button id='Sign-up-btn' type='submit' disabled={isSigningIn}>
                    Login
                </button>
                <GoogleButton onClick={onGoogleSignIn} disabled={isSigningIn} style={{ marginBottom: 15 }} />

                <div className='register-link'>
                    <p>
                        Don't have an account? <Link to='/signUp'>Sign Up</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;



