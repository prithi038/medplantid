import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig'; // Import the auth object from firebaseConfig
import { useNavigation } from '@react-navigation/native';

const UserProfileScreen = () => {
  const navigation = useNavigation();

  // Dummy user data
  const user = {
    name: 'John Doe',
    profileImage: require('../assets/profile_image.jpg'), // Example image path
  };

  // Function to handle logout
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        // Navigate to the Welcome screen after successful logout
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* User Profile */}
      <View style={styles.profileContainer}>
        <Image source={user.profileImage} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionContainer}>
        {/* Option: Edit Profile */}
        <TouchableOpacity style={styles.optionItem}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>

        {/* Option: Address */}
        <TouchableOpacity style={styles.optionItem}>
          <Text>Address</Text>
        </TouchableOpacity>

        {/* Option: Notification */}
        <TouchableOpacity style={styles.optionItem}>
          <Text>Notification</Text>
        </TouchableOpacity>

        {/* Option: Payments */}
        <TouchableOpacity style={styles.optionItem}>
          <Text>Payments</Text>
        </TouchableOpacity>

        {/* Option: Security */}
        <TouchableOpacity style={styles.optionItem}>
          <Text>Security</Text>
        </TouchableOpacity>

        {/* Option: Settings */}
        <TouchableOpacity style={styles.optionItem}>
          <Text>Settings</Text>
        </TouchableOpacity>

        {/* Option: Orders */}
        <TouchableOpacity style={styles.optionItem}>
          <Text>Orders</Text>
        </TouchableOpacity>

        {/* Option: Logout */}
        <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionContainer: {
    marginTop: 20,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default UserProfileScreen;
