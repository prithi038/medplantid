import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { Image } from 'react-native';

const CartScreen = () => {
    const [orders, setOrders] = useState([]);
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const navigation = useNavigation();

    useEffect(() => {
        if (userId) {
            const database = getDatabase();
            const ordersRef = ref(database, `orders/${userId}`);

            // Listen for changes to the user's orders
            const unsubscribe = onValue(ordersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Convert the data object into an array
                    const orderList = Object.values(data);
                    setOrders(orderList);
                } else {
                    setOrders([]);
                }
            });

            // Cleanup subscription on unmount
            return () => {
                unsubscribe();
            };
        }
    }, [userId]);


    // Render each order in a list
    const renderOrderItem = ({ item }) => (
        <TouchableOpacity style={styles.orderItem}>
            {item.productImage && (<Image source={{ uri: item.productImage}} style={styles.productImage}/> )}
            <Text>Product: {item.productName}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Payment Option: {item.paymentOption}</Text>
            <Text>Address: {item.deliveryAddress}</Text>
            <Text>Tracking Status: {item.status}</Text>
            
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Orders</Text>
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    productImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginTop: 10,
    },
});

export default CartScreen;
