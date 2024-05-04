import React, { useState, useFocusEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Image } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database, auth } from '../firebaseConfig'; 
import { ref as dbRef, push, set } from 'firebase/database';


const ProductDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { product } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [paymentOption, setPaymentOption] = useState('Cash on Delivery');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleOrderNow = () => {
        setModalVisible(true);
       // modalVisible(true);
    };

    const handlePlaceOrder = async () => {
        if (!address || !paymentOption || quantity < 1 || !phoneNumber) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }
        try {
            const currentUser = auth.currentUser;
            const userId = currentUser ? currentUser.uid : 'anonymous';
            const orderData = {
                productId: product.id,
                productName: product.name,
                productImage: product.uri,
                quantity,
                deliveryAddress: address,
                paymentOption,
                phoneNumber,
                timestamp: new Date().toISOString(),
                userId,
                status: 'Ordered',
            };
            const ordersRef = dbRef(database, `orders/${userId}`);
            const newOrderRef = push(ordersRef);
            await set(newOrderRef, orderData);
            Alert.alert('Success', 'Order placed. Thank you!', [{ text: 'Home', onPress: () => navigation.navigate('Home') }]);
            setModalVisible(false);
        } 
        catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        }
    };
    const OrderModal = ({ modalVisible, setModalVisible, quantity, setQuantity, paymentOption, setPaymentOption, address, setAddress, phoneNumber, setPhoneNumber, handlePlaceOrder }) => (
        <Modal isVisible={modalVisible} >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Order Details</Text>
                <Text style={styles.inputLabel}>Quantity (kg):</Text>
                <View style={styles.quantityInput}>
                    <TouchableOpacity onPress={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
                        <Text style={styles.arrowButton}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.quantityValue}
                        value={String(quantity)}
                        onChangeText={(value) => setQuantity(Number(value))}
                        keyboardType="numeric"/>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                        <Text style={styles.arrowButton}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.inputLabel}>Payment Option:</Text>
                {['Cash on Delivery'].map((option) => (
                    <TouchableOpacity key={option} style={styles.radioButton} onPress={() => setPaymentOption(option)}>
                        <Text style={styles.radioCircle}>{paymentOption === option ? '◉' : '○'}</Text>
                        <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>))}
                <Text style={styles.inputLabel}>Address:</Text>
                <TextInput
                    style={styles.addressInput}
                    placeholder="Enter your address"
                    value={address}
                    onChangeText={setAddress}/>
                <Text style={styles.inputLabel}>Phone Number:</Text>
                <TextInput
                    style={styles.phoneNumberInput}
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"/>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.placeOrderButton}
                        onPress={handlePlaceOrder}
                        disabled={!address || !paymentOption || quantity < 1 || !phoneNumber}>
                        <Text style={styles.buttonText}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
    

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.uri }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productUsage}>Medicinal Usage: {product.medicinalUsage}</Text>
            <Text style={styles.productRate}>Rate: {product.rate} per kg</Text>
            <TouchableOpacity style={styles.orderButton} onPress={handleOrderNow}>
                <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
            <OrderModal 
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                quantity={quantity}
                setQuantity={setQuantity}
                paymentOption={paymentOption}
                setPaymentOption={setPaymentOption}
                address={address}
                setAddress={setAddress}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handlePlaceOrder={handlePlaceOrder}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    productImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    productDescription: {
        fontSize: 16,
        marginVertical: 5,
    },
    productUsage: {
        fontSize: 16,
        marginVertical: 5,
    },
    productRate: {
        fontSize: 16,
        marginVertical: 5,
    },
    orderButton: {
        backgroundColor: '#32CD32',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    orderButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputLabel: {
        marginBottom: 5,
    },
    quantityInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    quantityValue: {
        width: 40,
        textAlign: 'center',
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 5,
    },
    arrowButton: {
        fontSize: 20,
        paddingHorizontal: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioLabel: {
        marginRight: 10,
    },
    radioCircle: {
        fontSize: 20,
        color: 'gray',
    },
    addressInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    phoneNumberInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    placeOrderButton: {
        backgroundColor: '#32CD32',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ProductDetails;
