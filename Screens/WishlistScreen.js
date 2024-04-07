import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);

  // Dummy data for demonstration, replace with actual data from Firebase or other source
  const dummyWishlistData = [
    { id: '1', name: 'Plantago', image: require('../assets/Plantago.png') },
    { id: '2', name: 'Fructus lycii', image: require('../assets/Fructus lycii.png') },
    { id: '3', name: 'Mangifera', image: require('../assets/Mangifera.png') },
  ];

  useEffect(() => {
    // Set the dummy data as the wishlist items
    setWishlist(dummyWishlistData);
  }, []);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      {wishlist.length === 0 ? (
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
  },
});

export default WishlistScreen;
