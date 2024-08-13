import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup , createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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



export { auth, db, createUserWithEmailAndPassword };

const provider = new GoogleAuthProvider();

export const signInWithGoogle= async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result)
    return result;  // Return the result so it can be accessed by the calling code
  }catch(error) {
    console.log(error)
  }
}