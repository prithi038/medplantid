import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore, storage} from '../firebaseConfig'; // Import the auth object from firebaseConfig
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import Modal from 'react-native-modal';


const HomepageScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [userName, setUserName] = useState(''); // State to hold the user's name
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false); // State to control menu visibility
  const [favoriteItems, setFavoriteItems] = useState([]); // State to hold favorite items

  useEffect(() => {
    // Get the current user from Firebase
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Check if the user is fully authenticated
      currentUser.reload().then(() => {
        // Fetch the updated user data after reload
        const updatedUser = auth.currentUser;
        if (updatedUser) {
          // If the user is fully authenticated, update the display name
          const displayName = updatedUser.displayName || 'Welcome !!';
          setUserName(displayName);
        }
      });
    }
  }, []);
  
  // Function to toggle menu visibility
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Function to handle profile navigation
  const handleProfileNavigation = () => {
    navigation.navigate('UserProfile');
    toggleMenu(); // Close the menu after navigation
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

  // Function to update the user's display name
  const updateDisplayName = (newDisplayName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      currentUser.updateProfile({
        displayName: newDisplayName,
      })
      .then(() => {
        console.log('Display name updated successfully');
        setUserName(newDisplayName); // Update the state with the new display name
      })
      .catch((error) => {
        console.error('Error updating display name:', error);
      });
    }
  };

 // Storing the image URL along with other information in Firestore
const handleFavoriteToggle = (item) => {
  if (favoriteItems.includes(item)) {
    // If item is already in favorites, remove it
    setFavoriteItems(favoriteItems.filter((favItem) => favItem.id !== item.id));
  } else {
    // If item is not in favorites, add it
    setFavoriteItems([...favoriteItems, item]);
  }
};


  const handleItemPress = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };


  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchText);
  };

  const handleImageProcessing = () => {
    navigation.navigate('ImageProcessing');
  };

  const handleWishlistNavigation = () => {
    navigation.navigate('Wishlist', {favoriteItems}); // Navigate to the WishlistScreen
  };

  const handleHomeNavigation = () => {
    navigation.navigate('Home'); // Navigate to the HomeScreen
  };

  const handleUserProfileNavigation = () => {
    navigation.navigate('UserProfile'); // Navigate to UserProfile screen
  };

  const renderProductItems = () => {
    const itemsPerRow = 2; // Number of items per row
    const rows = Math.ceil(productData.length / itemsPerRow); // Calculate number of rows
  
    let items = [];
    for (let i = 0; i < rows; i++) {
      let rowItems = [];
      for (let j = 0; j < itemsPerRow; j++) {
        const index = i * itemsPerRow + j;
        if (index < productData.length) {
          rowItems.push(
            <TouchableOpacity key={index} style={styles.productItem} onPress={() => handleItemPress(productData[index])}>
              <Image source={productData[index].image} style={styles.productImage} />
              {/* Add to Favorites Icon */}
              <TouchableOpacity
                style={[styles.favoriteIcon, { backgroundColor: favoriteItems.includes(productData[index]) ? 'red' : '#fff' }]}
                onPress={() => handleFavoriteToggle(productData[index])}
              >
                <Image source={require('../assets/favorite_icon.png')} style={styles.icon} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }
      }
      items.push(
        <View key={i} style={styles.productRow}>
          {rowItems}
        </View>
      );
    }
    return items;
  };
  
  
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {/* User Name */}
        <Text style={styles.userName}>{userName}</Text>
        {/* Navigation Icon */}
        <TouchableOpacity style={styles.navigationIcon} onPress={toggleMenu}>
          <Image source={require('../assets/menu_icon.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        {/* Search Icon */}
  <FontAwesome5 name="search" size={20} color="#666" style={styles.searchIcon} />
  {/* Search Input */}
        <TextInput
          placeholder="Search Medicinal Plants"
          style={styles.searchInput}
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Plant Image and Text Section */}
      <View style={styles.plantSection}>
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>Enhance Your Health with Medicinal Plants</Text>
        </View>
        <View style={styles.imageSection}>
          <Image source={require('../assets/plant_image.png')} style={styles.plantImage} />
        </View>
      </View>

      {/* Medicinal Plant Products */}
      <ScrollView style={styles.productList}>{renderProductItems()}
        {/* Render product item using the renderProductItems function*/}
        
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Image Processing Panel */}
        <TouchableOpacity style={styles.navIcon} onPress={handleImageProcessing}>
          <Image source={require('../assets/image_processing_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        {/* Home */}
        <TouchableOpacity style={styles.navIcon} onPress={handleHomeNavigation}>
          <Image source={require('../assets/home_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        {/* Wishlist */}
        <TouchableOpacity style={styles.navIcon} onPress={handleWishlistNavigation}>
          <Image source={require('../assets/wishlist_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        {/* Cart */}
        <TouchableOpacity style={styles.navIcon}>
          <Image source={require('../assets/cart_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        {/* User Profile */}
        <TouchableOpacity style={styles.navIcon} onPress={handleUserProfileNavigation}>
          <Image source={require('../assets/user_icon.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleProfileNavigation}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const productData = [
  {
    id: 1,
    name: 'Aloe vera',
    image: require('../assets/Aloe vera.png'), 
  },
  {
    id: 2,
    name: 'Blackberry Lily',
    image: require('../assets/Blackberry Lily.png'),
  },
  {
    id: 3,
    name: 'Citrus hystrix',
    image: require('../assets/Citrus hystrix.png'), 
  },
  {
    id: 4,
    name: 'Datura metel',
    image: require('../assets/Datura metel.png'), 
  },
  {
    id: 5,
    name: 'Erythrina variegata',
    image: require('../assets/Erythrina variegata.png'), 
  },
  {
    id: 6,
    name: 'Fructus lycii',
    image: require('../assets/Fructus lycii.png'), 
  },
  {
    id: 7,
    name: 'Hibiscus rosa sinensis',
    image: require('../assets/Hibiscus rosa sinensis.png'), 
  },
  {
    id: 8,
    name: 'Iris domestica',
    image: require('../assets/Iris domestica.png'), 
  },
  {
    id: 9,
    name: 'Lactuca indica',
    image: require('../assets/Lactuca indica.png'), 
  },
  {
    id: 10,
    name: 'Maesa',
    image: require('../assets/Maesa.png'), 
  },
  {
    id: 11,
    name: 'Mangifera',
    image: require('../assets/Mangifera.png'), 
  },
  {
    id: 12,
    name: 'Piper betle',
    image: require('../assets/Piper betle.png'), 
  },
  {
    id: 13,
    name: 'Plantago',
    image: require('../assets/Plantago.png'), 
  },
  {
    id: 14,
    name: 'Rauvolfia',
    image: require('../assets/Rauvolfia.png'), 
  },
  {
    id: 15,
    name: 'Senna alata',
    image: require('../assets/Senna alata.png'), 
  },
  {
    id: 16,
    name: 'Tamarindus indica',
    image: require('../assets/Tamarindus indica.png'), 
  },
  {
    id: 17,
    name: 'Vitex negundo',
    image: require('../assets/Vitex negundo.png'), 
  },
  {
    id: 18,
    name: 'Xanthium strumarium',
    image: require('../assets/Xanthium strumarium.png'), 
  },
  {
    id: 19,
    name: 'Zingiber officinale',
    image: require('../assets/Zingiber officinale.png'), 
  },

];
/*
const productData = [
  {
    id: 1,
    name: 'Bohera',
    image: require('../assets/Bohera.png'), 
  },
];
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationIcon: {
    padding: 5,
  },
  searchBar: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    flexDirection: 'row', // Make the search bar items align horizontally
    alignItems: 'center', // Align items vertically
  },
  searchInput: {
    flex: 1,
    marginLeft: 30,
    fontSize: 16,
    fontWeight: '600'
  },
  searchIcon: {
    position: 'absolute',
    marginLeft: 10,
  },  
  plantSection: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 30,
    backgroundColor: '#f0f8ea', // light pale green color
  },
  textSection: {
    flex: 1,
    justifyContent: 'center', // Center text vertically
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  plantImage: {
    width: 120,
    height: 100,
    borderRadius: 5,
  },
  productList: {
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },  
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 50,
  },
  icon: {
    width: 25,
    height: 25,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  navIcon: {
    padding: 10,
  },
  icon: {
    width: 25,
    height: 25,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 18,
  },
});

export default HomepageScreen;