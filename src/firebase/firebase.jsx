import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFMO_TBwz9dkQgPhnmAphpGtnijKuZgmI",
  authDomain: "movie-recommender-a4dae.firebaseapp.com",
  projectId: "movie-recommender-a4dae",
  storageBucket: "movie-recommender-a4dae.appspot.com",
  messagingSenderId: "1006592812847",
  appId: "1:1006592812847:web:993533320d5b8f02bae3da",
  measurementId: "G-QED3E8R2ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

export { auth, db };

const provider = new GoogleAuthProvider();

export const signInWithGoogle= () => {
  signInWithPopup(auth, provider).then((result) => {
    console.log(result)
    const name = result.user.displayName
    const email = result.user.email
    const profilePic = result.user.photoURL

    localStorage.item("name", name)
    localStorage.item("email", email)
    localStorage.item("profile Picture", profilePic)
 

  }).catch((error) => {
    console.log(error)
  })
}