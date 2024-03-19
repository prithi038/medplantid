import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5yoTaoA5L-ImLm0-U0kU4WWh6iIaffC0",
  authDomain: "medplantid.firebaseapp.com",
  projectId: "medplantid",
  storageBucket: "medplantid.appspot.com",
  messagingSenderId: "980039664242",
  appId: "1:980039664242:web:c244a0ec5db172f8ef78eb",
  measurementId: "G-41VMQ94CWS"
};


// Function to handle user logout
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth object
const auth = getAuth(app);

// Function to handle user signup
const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Function to handle user login
const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Export the authentication functions and auth object
export { auth, signUpWithEmailAndPassword, loginWithEmailAndPassword };
