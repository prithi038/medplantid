import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuthManager } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5yoTaoA5L-ImLm0-U0kU4WWh6iIaffC0",
  authDomain: "medplantid.firebaseapp.com",
  projectId: "medplantid",
  storageBucket: "medplantid.appspot.com",
  messagingSenderId: "980039664242",
  appId: "1:980039664242:web:c244a0ec5db172f8ef78eb",
  measurementId: "G-41VMQ94CWS"
};



// Initialize Firebase
const Medplantid = initializeApp(firebaseConfig);

const isReactNative = Platform.OS === 'ios' || Platform.OS === 'android';


// Initialize Firebase Auth with AsyncStorage persistence
const auth = getAuth(Medplantid);
if (isReactNative) {
  auth.settings.persistence = ReactNativeAsyncStorage;
}
console.log('Firebase initialized with auth object:', auth); // Log the auth object to verify its initialization

// Function to handle user signup
const signUpWithEmailAndPassword = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update user profile with the provided username
    await updateProfile(userCredential.user, {
      displayName: username
    });
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
const firestore = firebase.firestore();

export { firestore };
export { auth, signUpWithEmailAndPassword, loginWithEmailAndPassword };