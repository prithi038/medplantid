import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database, auth } from '../firebaseConfig';
import { ref, set, onValue} from 'firebase/database';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigation = useNavigation();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  
  useEffect(() => {
    const fetchWishlist = async () => {
    try {
      if (userId) {
          const wishlistRef = ref(database, `wishlist/${userId}`);
          onValue(wishlistRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const wishlistItems = Object.values(data);
              setWishlist(wishlistItems);
            } else {
              setWishlist([]);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishlist();
    return () => {
      if (userId) {
        const wishlistRef = ref(database, `wishlist/${userId}`);
        onValue(wishlistRef, null);
      }
    };
  }, [userId]);

  const handleRemoveItem = async (itemId) => {
    try {
      if (userId) {
        const index = wishlist.findIndex((item) => item.id === itemId);
        if (index !== -1) {
          const updatedWishlist = [...wishlist];
          updatedWishlist.splice(index, 1); 
          setWishlist(updatedWishlist);
          await set(ref(database, `wishlist/${userId}`), updatedWishlist);
        }
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
      <Image source={{ uri: item.uri }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      {wishlist.length > 0 ? (
        <FlatList
        data={wishlist}
        renderItem={renderProductItem} 
        keyExtractor={(item,index) => item.id} 
      />
    ) : (
      <Text style={styles.emptyText}>Your wishlist is empty.</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    flex: 1,
  },
  removeButtonContainer: {
    padding: 5, 
  },
  removeButton: {
    color: 'red',
    marginLeft: 10,
  },
});

export default WishlistScreen;
