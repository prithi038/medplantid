import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { loginWithEmailAndPassword } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  const handleLogin = async () => {
    try {
      // Verify login credentials with Firebase
      const user = await loginWithEmailAndPassword(email, password);
      // Navigate to the Welcome Back screen after successful login
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      // Handle login errors
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
            <Text style={styles.heading}>Login</Text>
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
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
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff', // Blue color for the login button
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff', // White color for the login button text
    fontWeight: 'bold',
  },
});

export default LoginScreen;
