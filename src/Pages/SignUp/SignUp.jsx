import './SignUp.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { CiUser } from 'react-icons/ci';
import {auth, db} from "../../firebase/firebase"
import {createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth"
import { Link } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState({})

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })

    const register = async () => {
       try{
       const user = await createUserWithEmailAndPassword(auth, email, password)

        await setDoc(doc(db, "users", user.user), {
                name: name,
                email: email
            });
            
       } catch (error){
        console.log(error.message)
       }
    }
    
    return (
        <>
            <div className='wrapper'>
                <form action=''>
                    <h1>Sign Up</h1>
                    <div className='input-box'>
                        <input type='text' placeholder='Name' required value={name} onChange={(e) => setName(e.target.value)} />
                        <CiUser className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type='text' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <FaUser className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type='password' placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <FaLock className='icon' />
                    </div>

                    <button id='Sign-up-btn' type='submit' onSubmit={register}>
                        <Link to='/'>Sign Up</Link>
                    </button>

                    <div className='register-link'>
                        <p>
                            Already have an account? <Link to='/login'>Login</Link>
                        </p>
                    </div>
                    
                </form>
            </div>
        </>
    );
};
export default SignUpPage;
