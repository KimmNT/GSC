import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
import SubmitImg from '../../../assets/images/success.png';

const res = Dimensions.get('window').height;

export default function SubmitDone({navigation}) {
  const handleBackToScan = () => {
    navigation.navigate('BLE');
  };

  return (
    <View style={styles.success__container}>
      <Image source={SubmitImg} style={styles.success__img} />
      <Text style={styles.success__text}>
        The information has been saved successfully.
      </Text>
      <View style={styles.success__scan_container}>
        <TouchableOpacity
          onPress={handleBackToScan}
          style={styles.success__scan_again}>
          <Text style={styles.success__scan_again_text}>save again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  success__container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  success__img: {
    width: res * 0.25,
    height: res * 0.24,
    resizeMode: 'cover',
  },
  success__text: {
    fontSize: res * 0.03,
    fontWeight: '600',
    textAlign: 'center',
  },
  success__scan_container: {},
  success__scan_again: {
    backgroundColor: '#4CAF50',
    paddingVertical: res * 0.02,
    paddingHorizontal: res * 0.04,
    borderRadius: res * 0.005,
  },
  success__scan_again_text: {
    fontSize: res * 0.025,
    color: '#FFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
