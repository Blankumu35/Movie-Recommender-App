import './SignUp.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { CiUser } from 'react-icons/ci';
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';

const SignUpPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const register = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const profilePicColor = generateRandomColor();
        
        await axios.post('http://localhost:5000/auth/signup', {
            userId: user.uid,
            firstName,
            lastName,
            email,
            password: password,  
            photoURL: user.photoURL || '',
            profilePicColor,
            signInMethod: 'email'
        });
        const userId = response.data.userId; 
        console.log(userId)
        localStorage.setItem('ID', userId); 
        navigate('/');
    } catch (error) {
        console.log(error.message);
    }
};

    return (
        <div className='wrapper'>
            <form onSubmit={register}>
                <h1 style={{paddingBottom:30}}>Sign Up</h1>
                <div className='input-box'>
                    <input type='text' placeholder='First Name' required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <CiUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='text' placeholder='Last Name' required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <CiUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='text' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='password' placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FaLock className='icon' />
                </div>
                <button id='Sign-up-btn' type='submit'>
                    Sign Up
                </button>
                <div className='register-link'>
                    <p>
                        Already have an account? <Link to='/login'>Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignUpPage;