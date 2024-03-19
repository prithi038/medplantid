import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { signUpWithEmailAndPassword } from '../firebaseConfig'; // Import the signup function
import { useNavigation } from '@react-navigation/native';
import auth from "@react-native-firebase/auth"

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  const handleSignup = async () => { // Renamed function to handleSignup
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const user = await auth().signUpWithEmailAndPassword(email, password);
      // Navigate to the next screen or perform other actions after successful signup
    } catch (error) {
      // Handle signup errors
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/backgroundImage.jpg')} // Adjust the path to your background image
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.form}>
            <Text style={styles.heading}>Sign Up</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background for the remaining screen
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay to darken the background image
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff', // White background for the form
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  signupButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff', // Blue color for the signup button
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#ffffff', // White color for the signup button text
    fontWeight: 'bold',
  },
});

export default SignupScreen;
