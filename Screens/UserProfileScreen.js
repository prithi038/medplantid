import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig'; 

const UserProfileScreen = () => {
  const navigation = useNavigation();

  
  const user = {
    name: 'Prithika',
    profileImage: require('../assets/profile_image.jpg'), 
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };


  const goToAddressScreen = () => {
    navigation.navigate('Address');
  };

  
  const goToNotificationScreen = () => {
    navigation.navigate('Notification');
  };

  
  const goToSecurityScreen = () => {
    navigation.navigate('Security');
  };

  
  const goToSettingsScreen = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={user.profileImage} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.optionItem} onPress={goToAddressScreen}>
          <Text>Address</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={goToNotificationScreen}>
          <Text>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={goToSecurityScreen}>
          <Text>Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={goToSettingsScreen}>
          <Text>Settings</Text>
        </TouchableOpacity>
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
