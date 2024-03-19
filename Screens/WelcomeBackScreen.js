import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { logoutUser } from '../firebaseConfig'; // Import the logoutUser function

const WelcomeBackScreen = () => {
  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Implement navigation to the welcome screen or any other screen after logout
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout errors
    }
  };

  // Function to navigate to the home screen
  const navigateToHomeScreen = () => {
    // Implement navigation to the home screen
  };

  return (
    <ImageBackground
      source={require('../assets/backgroundImage.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Cracker icon or any other desired icon */}
          <Text style={styles.headerText}>Welcome Back!</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={navigateToHomeScreen}>
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonsContainer: {
    marginTop: 50,
  },
  button: {
    width: 200,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  homeButton: {
    backgroundColor: '#007bff',
  },
  logoutButton: {
    backgroundColor: '#ff0000',
  },
});

export default WelcomeBackScreen;
