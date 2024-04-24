import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const AddressScreen = () => {
  const [address, setAddress] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleSaveAddress = () => {
    // Save the entered address to the state or send it to the server
    // Here, we're just logging it for demonstration purposes
    console.log('Address saved:', address);
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address</Text>
      {editMode ? (
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
      ) : (
        <Text style={styles.addressText}>{address}</Text>
      )}

      <View style={styles.buttonContainer}>
        {editMode ? (
          <TouchableOpacity style={styles.button} onPress={handleSaveAddress}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
            <Text style={styles.buttonText}>Edit Address</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddressScreen;
