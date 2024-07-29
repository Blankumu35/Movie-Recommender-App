import './Login.css'
import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import {auth, db, signInWithGoogle} from "../../firebase/firebase"
import { doSignInWithEmailandPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import GoogleButton from 'react-google-button';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: '/' } };
    const provider = new GoogleAuthProvider();


    const login = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await signInWithEmailAndPassword(auth,email, password);
                // Redirect or handle successful login
                setIsSigningIn(false);
                navigate('/');
            } catch (error) {
                setErrorMessage(error.message);
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
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          const profilePicColor = generateRandomColor();
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            profilePicColor,
            signInMethod: 'google'
          });
        }
        navigate(from, { replace: true });
      } catch (error) {
        setErrorMessage(error.message);
      }
      setIsSigningIn(false);
    }
  };

   const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  

    return (
        <>
            <div className='wrapper'>
                <form onSubmit={login}>
                    <h1 style={{paddingBottom:30}}>Login</h1>
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
                    <GoogleButton onClick={onGoogleSignIn} disabled={isSigningIn} style={{marginBottom:15}}/>

                    <div className='register-link'>
                        <p>
                            Don't have an account? <Link to='/signUp'>Sign Up</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
