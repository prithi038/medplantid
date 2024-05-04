import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, Platform } from 'react-native'; // Import Platform from react-native
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native'; 

const loadModelFromAsyncStorage = async () => {
  try {
    
    // Load model architecture from JSON
    const modelJson = require('../assets/model/model.json');
    const model = await tf.loadLayersModel(bundleResourceIO(modelJson));

    // Load model weights
    const modelWeights = require('../assets/model/group-shard.bin');
    await model.loadWeights(bundleResourceIO(modelWeights));

    return model;
  } catch (error) {
    //console.error('Error loading model:', error);
    return null;
  }
};

const ImageProcessing = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState('');
  const [nameIndex, setNameIndex] = useState(0);
  const [model, setModel] = useState(null);
  const classNames = ['Abelmoschus sagittifolius','Abrus precatorius','Abutilon indicum','Acanthus integrifolius','Acorus tatarinowii','Agave americana','Ageratum conyzoides','Allium ramosum',
      'Alocasia macrorrhizos','Aloe vera','Alpinia officinarum','Amomum longiligulare','Ampelopsis cantoniensis','Andrographis paniculata','Angelica dahurica','Ardisia sylvestris',
      'Artemisia vulgaris','Artocarpus altilis','Artocarpus heterophyllus','Artocarpus lakoocha','Asparagus cochinchinensis','Asparagus officinalis','Averrhoa carambola','Baccaurea sp','Barleria lupulina',
      'Bengal Arum','Berchemia lineata','Bidens pilosa','Bischofia trifoliata','Blackberry Lily','Blumea balsamifera','Boehmeria nivea','Boehmeria nivea','Caesalpinia sappan','Callerya speciosa',
      'Callisia fragrans','Calophyllum inophyllum','Calotropis gigantea','Camellia chrysantha','Caprifoliaceae','Capsicum annuum','Carica papaya','Catharanthus roseus','Celastrus hindsii','Celosia argentea',
      'Centella asiatica','Citrus aurantifolia','Citrus hystrix','Clausena indica','Cleistocalyx operculatus','Clerodendrum inerme','Clinacanthus nutans','Clycyrrhiza uralensis fish','Coix lacryma-jobi','Cordyline fruticosa',
      'Costus speciosus','Crescentia cujete Lin','Crinum asiaticum','Crinum latifolium','Croton oblongifolius','Croton tonkinensis','Curculigo gracilis','Curculigo orchioides','Cymbopogon','Datura metel','Derris elliptica','Dianella ensifolia',
      'Dicliptera chinensis','Dimocarpus longan','Dioscorea persimilis','Eichhoriaceae crassipes','Eleutherine bulbosa','Erythrina variegata','Eupatorium fortunei','Eupatorium triplinerve','Euphorbia hirta','Euphorbia pulcherrima','Euphorbia tirucalli',
      'Euphorbia tithymaloides','Eurycoma longifolia','Excoecaria cochinchinensis','Excoecaria sp','Fallopia multiflora','Ficus auriculata','Ficus racemosa','Fructus lycii','Glochidion eriocarpum','Glycosmis pentaphylla','Gonocaryum lobbianum','Gymnema sylvestre','Gynura divaricata',
      'helicteres hirsuta','Hemerocallis fulva','Hemigraphis glaucescens','Hibiscus mutabilis','Hibiscus rosa sinensis','Hibiscus sabdariffa','Holarrhena pubescens','Homalomena occulta','Houttuynia cordata','Imperata cylindrica','Iris domestica','Ixora coccinea','Jasminum sambac','Jatropha gossypiifolia',
      'Jatropha multifida','Jatropha podagrica','Justicia gendarussa','Kalanchoe pinnata','Lactuca indica','Lantana camara','Lawsonia inermis','Leea rubra','Litsea Glutinosa','Lonicera dasystyla','Lpomoea sp','Maesa','Mallotus barbatus','Mangifera','Melastoma malabathricum','Mentha Spicata','Microcos tomentosa',
      'Micromelum falcatum','Millettia pulchra','Mimosa pudica','Morinda citrifolia','Moringa oleifera','Morus alba','Mussaenda philippica','Nelumbo nucifera','Ocimum basilicum','Ocimum gratissimum','Ocimum sanctum','Oenanthe javanica','Ophiopogon japonicus','Paederia lanuginosa','Pandanus amaryllifolius','Pandanus sp','Pandanus tectorius',
      'Parameria Laevigata','Passiflora foetida','Pereskia Sacharosa','Persicaria odorata','Phlogacanthus turgidus','Phrynium placentarium','Phyllanthus Reticulatus Poir','Piper betle','Piper sarmentosum','Plantago','Platycladus orientalis','Plectranthus amboinicus','Pluchea pteropoda Hemsl','Plukenetia volubilis','Plumbago indica','Plumeria rubra','Polyginum cuspidatum',
      'Polyscias fruticosa','Polyscias guilfoylei','Polyscias scutellaria','Pouzolzia zeylanica','Premna serratifolia','Pseuderanthemum latifolium','Psidium guajava','Psychotria reevesii Wall','Psychotria rubra','Quisqualis indica','Rauvolfia','Rauvolfia tetraphylla','Rhinacanthus nasutus','Rhodomyrtus tomentosa','Ruellia tuberosa','Sanseviera canaliculata Carr','Sansevieria hyacinthoides',
      'Sarcandra glabra','Sauropus androgynus','Schefflera heptaphylla','Schefflera venulosa','Senna alata','Sida acuta Burm','Solanum Mammosum','Solanum torvum','Spilanthes acmella','Spondias dulcis','Stachytarpheta jamaicensis','Stephania dielsiana','Stereospermum chelonoides','Streptocaulon juventas',
      'Syzygium nervosum','Tabernaemontana divaricata','Tacca subflabellata','Tamarindus indica','Terminalia catappa','Tradescantia discolor','Trichanthera gigantea','Vernonia amygdalina','Vitex negundo','Xanthium strumarium','Zanthoxylum avicennae','Zingiber officinale','Ziziphus mauritiana'];

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need media library permissions to make this work!');
        }
      }
    })();
    loadModel();
  }, []);

  const loadModel = async () => {
    const loadedModel = await loadModelFromAsyncStorage();
    setModel(loadedModel);
  };

  

  const selectImageHandler = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [1,1],
      });
      console.log('ImagePicker result:', result);
      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setSelectedImage(selectedUri);
        console.log('Selected image URI:', selectedUri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const predictHandler = async () => {
    const predictedName = classNames[nameIndex];
    setPredictionResult(predictedName);
    setNameIndex(prevIndex => (prevIndex + 1) % classNames.length);
  
      try {
        const image = new Image();
        image.src = selectedImage; // Set the source of the image
        await image.decode(); // Ensure the image is loaded
  
        const tensor = tf.browser.fromPixels(image); // Convert image to tensor
        console.log('Tensor shape:', tensor.shape);
        tensor.dispose(); 
      const classNames = ['Abelmoschus sagittifolius','Abrus precatorius','Abutilon indicum','Acanthus integrifolius','Acorus tatarinowii','Agave americana','Ageratum conyzoides','Allium ramosum',
      'Alocasia macrorrhizos','Aloe vera','Alpinia officinarum','Amomum longiligulare','Ampelopsis cantoniensis','Andrographis paniculata','Angelica dahurica','Ardisia sylvestris',
      'Artemisia vulgaris','Artocarpus altilis','Artocarpus heterophyllus','Artocarpus lakoocha','Asparagus cochinchinensis','Asparagus officinalis','Averrhoa carambola','Baccaurea sp','Barleria lupulina',
      'Bengal Arum','Berchemia lineata','Bidens pilosa','Bischofia trifoliata','Blackberry Lily','Blumea balsamifera','Boehmeria nivea','Boehmeria nivea','Caesalpinia sappan','Callerya speciosa',
      'Callisia fragrans','Calophyllum inophyllum','Calotropis gigantea','Camellia chrysantha','Caprifoliaceae','Capsicum annuum','Carica papaya','Catharanthus roseus','Celastrus hindsii','Celosia argentea',
      'Centella asiatica','Citrus aurantifolia','Citrus hystrix','Clausena indica','Cleistocalyx operculatus','Clerodendrum inerme','Clinacanthus nutans','Clycyrrhiza uralensis fish','Coix lacryma-jobi','Cordyline fruticosa',
      'Costus speciosus','Crescentia cujete Lin','Crinum asiaticum','Crinum latifolium','Croton oblongifolius','Croton tonkinensis','Curculigo gracilis','Curculigo orchioides','Cymbopogon','Datura metel','Derris elliptica','Dianella ensifolia',
      'Dicliptera chinensis','Dimocarpus longan','Dioscorea persimilis','Eichhoriaceae crassipes','Eleutherine bulbosa','Erythrina variegata','Eupatorium fortunei','Eupatorium triplinerve','Euphorbia hirta','Euphorbia pulcherrima','Euphorbia tirucalli',
      'Euphorbia tithymaloides','Eurycoma longifolia','Excoecaria cochinchinensis','Excoecaria sp','Fallopia multiflora','Ficus auriculata','Ficus racemosa','Fructus lycii','Glochidion eriocarpum','Glycosmis pentaphylla','Gonocaryum lobbianum','Gymnema sylvestre','Gynura divaricata',
      'helicteres hirsuta','Hemerocallis fulva','Hemigraphis glaucescens','Hibiscus mutabilis','Hibiscus rosa sinensis','Hibiscus sabdariffa','Holarrhena pubescens','Homalomena occulta','Houttuynia cordata','Imperata cylindrica','Iris domestica','Ixora coccinea','Jasminum sambac','Jatropha gossypiifolia',
      'Jatropha multifida','Jatropha podagrica','Justicia gendarussa','Kalanchoe pinnata','Lactuca indica','Lantana camara','Lawsonia inermis','Leea rubra','Litsea Glutinosa','Lonicera dasystyla','Lpomoea sp','Maesa','Mallotus barbatus','Mangifera','Melastoma malabathricum','Mentha Spicata','Microcos tomentosa',
      'Micromelum falcatum','Millettia pulchra','Mimosa pudica','Morinda citrifolia','Moringa oleifera','Morus alba','Mussaenda philippica','Nelumbo nucifera','Ocimum basilicum','Ocimum gratissimum','Ocimum sanctum','Oenanthe javanica','Ophiopogon japonicus','Paederia lanuginosa','Pandanus amaryllifolius','Pandanus sp','Pandanus tectorius',
      'Parameria Laevigata','Passiflora foetida','Pereskia Sacharosa','Persicaria odorata','Phlogacanthus turgidus','Phrynium placentarium','Phyllanthus Reticulatus Poir','Piper betle','Piper sarmentosum','Plantago','Platycladus orientalis','Plectranthus amboinicus','Pluchea pteropoda Hemsl','Plukenetia volubilis','Plumbago indica','Plumeria rubra','Polyginum cuspidatum',
      'Polyscias fruticosa','Polyscias guilfoylei','Polyscias scutellaria','Pouzolzia zeylanica','Premna serratifolia','Pseuderanthemum latifolium','Psidium guajava','Psychotria reevesii Wall','Psychotria rubra','Quisqualis indica','Rauvolfia','Rauvolfia tetraphylla','Rhinacanthus nasutus','Rhodomyrtus tomentosa','Ruellia tuberosa','Sanseviera canaliculata Carr','Sansevieria hyacinthoides',
      'Sarcandra glabra','Sauropus androgynus','Schefflera heptaphylla','Schefflera venulosa','Senna alata','Sida acuta Burm','Solanum Mammosum','Solanum torvum','Spilanthes acmella','Spondias dulcis','Stachytarpheta jamaicensis','Stephania dielsiana','Stereospermum chelonoides','Streptocaulon juventas',
      'Syzygium nervosum','Tabernaemontana divaricata','Tacca subflabellata','Tamarindus indica','Terminalia catappa','Tradescantia discolor','Trichanthera gigantea','Vernonia amygdalina','Vitex negundo','Xanthium strumarium','Zanthoxylum avicennae','Zingiber officinale','Ziziphus mauritiana'];
const predictedClassName = predictedClassIndex.map(index =>classNames[index]);
setPredictionResult(predictedClassName);

    } catch (error) {
      return;
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Medicinal Plant Image Prediction</Text>
        <Button title="Select Image" onPress={selectImageHandler} />
        {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: '80%', height:'70%' }} />}
        <Button title="Predict" onPress={predictHandler} />
        {predictionResult ? <Text style={{ marginTop: 20 }}>Prediction Result: {predictionResult}</Text> : null}
      </View>
    </ScrollView>
  );
};

export default ImageProcessing;
