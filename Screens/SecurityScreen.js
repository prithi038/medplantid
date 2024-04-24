import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SecurityScreen = () => {
  // State to manage security setting
  const [isSecurityOn, setIsSecurityOn] = React.useState(false);

  // Function to toggle security setting
  const toggleSecurity = () => {
    setIsSecurityOn(!isSecurityOn);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security</Text>
      <Text style={styles.text}>Security Policy:</Text>
      
      <Text style={styles.text}>we take the security and privacy of our users' information very seriously. We are committed to ensuring that all personal and sensitive data collected through our platform is protected and handled in accordance with industry best practices and applicable regulations.</Text>
      <Text style={styles.text}>By using our platform, users agree to abide by our security policies and practices. We are committed to continually improving our security measures to adapt to evolving threats and protect our users' trust and confidence.</Text>
      <TouchableOpacity style={styles.button} onPress={toggleSecurity}>
        <Text style={styles.buttonText}>{isSecurityOn ? 'Turn Off Security' : 'Turn On Security'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SecurityScreen;
