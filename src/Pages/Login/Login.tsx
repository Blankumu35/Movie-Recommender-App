import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import {auth, signInWithGoogle} from "../../firebase/firebase"
import { doSignInWithEmailandPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import GoogleButton from 'react-google-button';
import { Link } from 'react-router-dom';

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
                // e.g., <Navigate to="/" />
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
        await signInWithPopup(auth, provider);
        navigate(from);
      } catch (error) {
        setErrorMessage(error.message);
      }
      setIsSigningIn(false);
    }
  };

    return (
        <>
            <div className='wrapper'>
                <form onSubmit={login}>
                    <h1>Login</h1>
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
                    <GoogleButton onClick={onGoogleSignIn} disabled={isSigningIn}/>

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
