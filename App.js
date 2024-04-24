import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './Screens/WelcomeScreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import WishlistScreen from './Screens/WishlistScreen'; 
import UserProfileScreen from './Screens/UserProfileScreen'; // Import your UserProfileScreen component
import HomepageScreen from './Screens/HomepageScreen';
import ImageProcessingScreen from './Screens/ImageProcessingScreen';
import ProductDetails from './Screens/ProductDetails';
import CartScreen from './Screens/CartScreen';
import AddressScreen from './Screens/AddressScreen';
import NotificationScreen from './Screens/NotificationScreen';
import SecurityScreen from './Screens/SecurityScreen';
import SettingsScreen from './Screens/SettingsScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomepageScreen} /> 
        <Stack.Screen name="Wishlist" component={WishlistScreen} /> 
        <Stack.Screen name="ProductDetails" component={ProductDetails}/>
        <Stack.Screen name='ImageProcessing' component={ImageProcessingScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Address" component={AddressScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'User Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
