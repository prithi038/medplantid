import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const ImageProcessingScreen = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      const modelFile = 'D:\\medplantid\\model\\dn_model.tflite';
      const loadedModel = await tf.loadGraphModel(`file://${modelFile}`);
      console.writeln("1");
      setModel(loadedModel);
      console.writeln("2");
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      predictImage(result.uri);
    }
  };

  const predictImage = async (uri) => {
    try {
      const imageTensor = await loadImageTensor(uri);

      // Make predictions using the loaded model
      const prediction = await model.predict(imageTensor);
      setPrediction(prediction);
    } catch (error) {
      console.error('Error predicting image:', error);
      setPrediction(null);
    }
  };

  const loadImageTensor = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const image = await tf.browser.fromPixels(blob);
    const resizedImage = tf.image.resizeBilinear(image, [inputSize, inputSize]); 
    const imageTensor = resizedImage.expandDims(0);
    return imageTensor;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
        <Text style={styles.selectButtonText}>Select Plant Photo</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>Predicted Result: {prediction}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  predictionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  predictionText: {
    fontSize: 16,
  },
});

export default ImageProcessingScreen;
