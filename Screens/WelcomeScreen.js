import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const handleLoginPress = () => {
    navigation.navigate('Login'); // Navigate to Login screen
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup'); // Navigate to Signup screen
  };

  return (
    <ImageBackground
      source={require('../assets/backgroundImage.jpg')} // Adjust the path to your background image
      style={styles.background}
      resizeMode="cover" // Ensure the background image covers the entire screen
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={[styles.logoText, styles.bold]}>Medplantid</Text>
        </View>
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={handleLoginPress}
        >
          <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.signupButton]} 
          onPress={handleSignupPress} // Call handleSignupPress function when Signup button is pressed
        >
          <Text style={[styles.buttonText, styles.signupText]}>Signup</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 60, // Adjust top position as needed
    left: 1, // Adjust left position as needed
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 29,
    marginBottom: 5,
    color: '#ffffff', // White color for the welcome text
  },
  logoText: {
    fontSize: 36,
    color: '#ffffff', // White color for the logo text
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'transparent', // Transparent background for the buttons
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ffffff', // White color for the button border
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#ffffff', // White color for the login button background
  },
  loginText: {
    color: '#008000', // Green color for the login button text
  },
  signupButton: {
    backgroundColor: '#ffffff', // White color for the signup button background
  },
  signupText: {
    color: '#008000', // Green color for the signup button text
  },
});

export default WelcomeScreen;
