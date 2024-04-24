import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getDatabase } from 'firebase/database';



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
const database = getDatabase(Medplantid);
const isReactNative = Platform.OS === 'ios' || Platform.OS === 'android';


// Initialize Firebase Auth with AsyncStorage persistence
let auth;
if (isReactNative) {
  auth = initializeAuth(Medplantid, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  auth = getAuth(Medplantid);
}
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
export { auth, database, firebaseConfig, signUpWithEmailAndPassword, loginWithEmailAndPassword };