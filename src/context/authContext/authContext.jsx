import React, { useState, useEffect, useContext, createContext } from 'react'
import {auth} from '../../firebase/firebase'
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';


const AuthContext = createContext() 

export function UserAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() =>{
        const unsubscribe = onAuthStateChanged(auth, intializeUser);
        return unsubscribe;
    }, [])

     const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
     }



     return (
        <AuthContext.Provider value={googleSignIn}>
            {!loading && children}
        </AuthContext.Provider>
     )
}