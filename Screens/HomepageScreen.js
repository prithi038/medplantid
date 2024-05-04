import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { ref, set,push, onValue } from 'firebase/database';

const HomepageScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [userName, setUserName] = useState('Welcome !!');
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      currentUser.reload().then(() => {
        const displayName = currentUser.displayName || 'Welcome !!';
        setUserName(displayName);
      });
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const wishlistRef = ref(database, `wishlist/${userId}`);
      const unsubscribe = onValue(wishlistRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.values(data);
          setFavoriteItems(items);
        } else {
          setFavoriteItems([]);
        }
      });
      return () => unsubscribe();
    }
  }, [userId]);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const handleUserProfileNavigation = () => {
    navigation.navigate('UserProfile');
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
  const handleFavoriteToggle = async (product) => {
    const wishlistRef = ref(database, `wishlist/${userId}`); 
    const isFavorite = favoriteItems.some(item => item.id === product.id);
    if (isFavorite) {
        const updatedFavoriteItems = favoriteItems.filter(item => item.id !== product.id);
        setFavoriteItems(updatedFavoriteItems);
    } 
    else {
      setFavoriteItems([...favoriteItems, product]);
    }
    const newWishlistItemRef = push(wishlistRef);
    set(newWishlistItemRef, product);
  };
  const handleHomeNavigation = () => {
    navigation.navigate('Home'); 
  };

  const handleItemPress = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };

  const handleCartClick = () => {
    navigation.navigate('Cart');
};
const handleWishlistNavigation = () => {
  navigation.navigate('Wishlist', {favoriteItems}); 
};
const handleImageProcessing = () => {
  navigation.navigate('ImageProcessing');
};
  const handleSearch = () => {
    console.log('Searching for:', searchText);
  };
  const renderProductItems = () => {
    const itemsPerRow = 2;
    const rows = Math.ceil(productData.length / itemsPerRow);
    let items = [];
    for (let i = 0; i < rows; i++) {
      let rowItems = [];
      for (let j = 0; j < itemsPerRow; j++) {
        const index = i * itemsPerRow + j;
        if (index < productData.length) {
          rowItems.push(
            <TouchableOpacity
              key={index}
              style={styles.productItem}
              onPress={() => handleItemPress(productData[index])}
            >
              <View style={styles.productImageContainer}>
                <Image source={{ uri: productData[index].uri }} style={styles.productImage} />
                <TouchableOpacity
                  style={[styles.favoriteIcon, { backgroundColor: favoriteItems.includes(productData[index]) ? '#ff0000' : '#fff' }]}
                  onPress={() => handleFavoriteToggle(productData[index])}
>
                <Image source={require('../assets/favourite_icon.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.productName}>{productData[index].name}</Text>
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
     
      <View style={styles.header}>
      
        <Text style={styles.userName}>{userName}</Text>
       
        <TouchableOpacity style={styles.navigationIcon} onPress={toggleMenu}>
          <Image source={require('../assets/menu_icon.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        
  <FontAwesome5 name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Search Medicinal Plants"
          style={styles.searchInput}
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>
      <View style={styles.plantSection}>
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>Enhance Your Health with Medicinal Plants</Text>
        </View>
        <View style={styles.imageSection}>
          <Image source={require('../assets/plant_image.png')} style={styles.plantImage} />
        </View>
      </View>

      <ScrollView style={styles.productList}>{renderProductItems()}</ScrollView>
    
      <View style={styles.bottomNav}>
     
        <TouchableOpacity style={styles.navIcon} onPress={handleImageProcessing}>
          <Image source={require('../assets/image_processing_icon.png')} style={styles.icon} />
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.navIcon} onPress={handleHomeNavigation}>
          <Image source={require('../assets/home_icon.png')} style={styles.icon} />
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.navIcon} onPress={handleWishlistNavigation}>
          <Image source={require('../assets/wishlist_icon.png')} style={styles.icon} />
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.navIcon} onPress={handleCartClick}>
          <Image source={require('../assets/cart_icon.png')} style={styles.icon} />
        </TouchableOpacity>
      
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
          <TouchableOpacity style={styles.menuItem} onPress={handleUserProfileNavigation}>
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
      medicinalUsage: 'Used for skin treatments, healing wounds, and as an anti-inflammatory.',
      description: 'Aloe vera is known for its soothing properties and is widely used in skincare products.',
      rate: 'Rs.290',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Aloe%20vera.png?alt=media&token=9133e759-8db6-4a73-9311-c78f44bdba57',
  },
  {
      id: 2,
      name: 'Blackberry Lily',
      image: require('../assets/Blackberry Lily.png'),
      medicinalUsage: 'Used for treating respiratory conditions and inflammatory diseases.',
      description: 'Blackberry Lily has been used in traditional medicine for its various health benefits.',
      rate: 'Rs.900',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Blackberry%20Lily.png?alt=media&token=541fff02-6623-40e3-9115-ab104cb018ff',
  },
  {
      id: 3,
      name: 'Citrus hystrix',
      image: require('../assets/Citrus hystrix.png'),
      medicinalUsage: 'Used for treating digestive issues, as an anti-inflammatory, and for respiratory health.',
      description: 'Citrus hystrix, also known as kaffir lime, is commonly used in Southeast Asian cuisine and traditional medicine.',
      rate: 'Rs.550',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Citrus%20hystrix.png?alt=media&token=db2d2e77-069b-4e5a-86d8-ae6a4142cdab',
  },
  {
      id: 4,
      name: 'Datura metel',
      image: require('../assets/Datura metel.png'),
      medicinalUsage: 'Used for treating asthma and other respiratory conditions, but can be toxic if misused.',
      description: 'Datura metel, also known as devil\'s trumpet, should be used with caution due to its potential toxicity.',
      rate: 'Rs.450',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Datura%20metel.png?alt=media&token=c65560cc-79ce-43d7-a52c-f8c48aca08bc',

  },
  {
      id: 5,
      name: 'Erythrina variegata',
      image: require('../assets/Erythrina variegata.png'),
      medicinalUsage: 'Used as a sedative and muscle relaxant, and for treating cough and asthma.',
      description: 'Erythrina variegata, known as coral tree, has traditional uses for its calming and healing effects.',
      rate: 'Rs.2000',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Erythrina%20variegata.png?alt=media&token=3cf6b32f-b31c-4310-aa93-bc4e4ecd6440',
  },
  {
      id: 6,
      name: 'Fructus lycii',
      image: require('../assets/Fructus lycii.png'),
      medicinalUsage: 'Used for improving liver and kidney function, as well as vision and overall health.',
      description: 'Fructus lycii, also known as goji berries, are a popular superfood with multiple health benefits.',
      rate: 'Rs.650',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Fructus%20lycii.png?alt=media&token=22809971-80a8-4b0f-bdf3-b172010e6c21',
  },
  {
      id: 7,
      name: 'Hibiscus rosa sinensis',
      image: require('../assets/Hibiscus rosa sinensis.png'),
      medicinalUsage: 'Used for managing high blood pressure, respiratory health, and as an antioxidant.',
      description: 'Hibiscus rosa sinensis, known as hibiscus, has many health benefits and is commonly used in teas.',
      rate: 'Rs.380',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Hibiscus%20rosa%20sinensis.png?alt=media&token=10c694db-8493-4c0c-aa70-03ad8b2804db',
  },
  {
      id: 8,
      name: 'Iris domestica',
      image: require('../assets/Iris domestica.png'),
      medicinalUsage: 'Used for treating cough, sore throat, and respiratory infections.',
      description: 'Iris domestica, also known as blackberry lily, has a long history of use in traditional medicine.',
      rate: 'Rs.490',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Iris%20domestica.png?alt=media&token=3d723688-3e16-4de7-a735-10201e90ff0d',
  },
  {
      id: 9,
      name: 'Lactuca indica',
      image: require('../assets/Lactuca indica.png'),
      medicinalUsage: 'Used for improving digestion, treating respiratory issues, and relieving pain.',
      description: 'Lactuca indica, also known as Indian lettuce, is a medicinal herb with various applications.',
      rate: 'Rs.320',
      uri:'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Lactuca%20indica.png?alt=media&token=39ffb071-b0cf-4605-a2ba-f589469c40bc',
  },
  {
      id: 10,
      name: 'Maesa',
      image: require('../assets/Maesa.png'),
      medicinalUsage: 'Used for treating skin conditions and as an antimicrobial agent.',
      description: 'Maesa plants are known for their beneficial effects on the skin and for their antimicrobial properties.',
      rate: 'Rs.30',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Maesa.png?alt=media&token=2efd25ca-bab1-47db-93de-1d3f4015f3b2',
  },
  {
      id: 11,
      name: 'Mangifera',
      image: require('../assets/Mangifera.png'),
      medicinalUsage: 'Used for promoting digestive health and as an antioxidant.',
      description: 'Mangifera, also known as mango, is not only delicious but also has various health benefits.',
      rate: 'Rs.90',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Mangifera.png?alt=media&token=3e0d486d-2e3a-4ef9-9362-5216855e8b8e',
  },
  {
      id: 12,
      name: 'Piper betle',
      image: require('../assets/Piper betle.png'),
      medicinalUsage: 'Used for oral health, digestion, and respiratory conditions.',
      description: 'Piper betle, known as betel leaf, has many traditional uses and is a popular ingredient in traditional medicine.',
      rate: 'Rs.350',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Piper%20betle.png?alt=media&token=81ea37dc-65d7-4e74-ac73-80699992c8a3',
  },
  {
      id: 13,
      name: 'Plantago',
      image: require('../assets/Plantago.png'),
      medicinalUsage: 'Used for treating cough, diarrhea, and skin conditions.',
      description: 'Plantago, also known as plantain, is a versatile herb with various medicinal properties.',
      rate: 'Rs.500',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Plantago.png?alt=media&token=8d0d7345-9bb1-4d12-9abe-e8d0376f6659',
  },
  {
      id: 14,
      name: 'Rauvolfia',
      image: require('../assets/Rauvolfia.png'),
      medicinalUsage: 'Used for managing high blood pressure and mental health conditions.',
      description: 'Rauvolfia, also known as snakeroot, is known for its alkaloids and their impact on mental health.',
      rate: 'Rs.290',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Rauvolfia.png?alt=media&token=c9edf67c-9bc8-47a9-8210-89ce174c39ff',
  },
  {
      id: 15,
      name: 'Senna alata',
      image: require('../assets/Senna alata.png'),
      medicinalUsage: 'Used for treating skin conditions and digestive issues.',
      description: 'Senna alata, also known as the candle bush, is a plant with powerful medicinal properties.',
      rate: 'Rs.200',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Senna%20alata.png?alt=media&token=f5c4d9b9-0164-4028-b403-30ab4fb883ce',
  },
  {
      id: 16,
      name: 'Tamarindus indica',
      image: require('../assets/Tamarindus indica.png'),
      medicinalUsage: 'Used for digestive health, as an anti-inflammatory, and for managing blood sugar levels.',
      description: 'Tamarindus indica, known as tamarind, is a sour fruit with multiple culinary and medicinal uses.',
      rate: 'Rs.520',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Tamarindus%20indica.png?alt=media&token=6b55a793-e640-4971-9fac-54b0042617d6',
  },
  {
      id: 17,
      name: 'Vitex negundo',
      image: require('../assets/Vitex negundo.png'),
      medicinalUsage: 'Used for respiratory health and as an anti-inflammatory.',
      description: 'Vitex negundo, also known as the chaste tree, is used in traditional medicine for its healing properties.',
      rate: 'Rs.40',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Vitex%20negundo.png?alt=media&token=a792bcdb-99fa-4c93-8f6e-835873246b6c',
  },
  {
      id: 18,
      name: 'Xanthium strumarium',
      image: require('../assets/Xanthium strumarium.png'),
      medicinalUsage: 'Used for treating respiratory conditions and as an anti-inflammatory.',
      description: 'Xanthium strumarium, also known as cocklebur, is commonly used in traditional medicine.',
      rate: 'Rs.1500',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Xanthium%20strumarium.png?alt=media&token=115d963f-6497-4011-9c30-e3902eca141f',
  },
  {
      id: 19,
      name: 'Zingiber officinale',
      image: require('../assets/Zingiber officinale.png'),
      medicinalUsage: 'Used for treating nausea, digestive issues, and as an anti-inflammatory.',
      description: 'Zingiber officinale, also known as ginger, is a popular spice with many medicinal uses.',
      rate: 'Rs.200',
      uri: 'https://firebasestorage.googleapis.com/v0/b/medplantid.appspot.com/o/Zingiber%20officinale.png?alt=media&token=25d5b760-d554-46eb-b1d5-559d8bbf4ed0',
  },
];


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
  plantImage: {
    width: 120,
    height: 100,
    borderRadius: 5,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationIcon: {
    padding: 5,
  },
  searchIcon: {
    position: 'absolute',
    marginLeft: 10,
  }, 
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 30,
    fontSize: 16,
    fontWeight: '600'
  },
  searchBar: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plantSection: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 30,
    backgroundColor: '#f0f8ea',
  },
  imageSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 20,
  },
  productList: {
    marginTop: 20,
    flex: 1,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    marginBottom: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5, 
    textAlign: 'center', 
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
  navIcon: {
    padding: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  menuModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
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
