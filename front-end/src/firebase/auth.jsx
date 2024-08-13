import {auth} from "./firebase"

import {createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'

export const doCreateUserWithEmailandPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

export const doSignInWithEmailandPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
    const provider = GoogleAuthProvider();
    return await signInWithPopup(auth, provider)

}

export const doSignOut = () => {
    return auth.signOut();
};

