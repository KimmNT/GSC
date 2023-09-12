import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import BackArrow from '../components/BackArrow';
import Icon from 'react-native-vector-icons/MaterialIcons';

const res = Dimensions.get('window').height;

export default function GroupDevice({navigation, route}) {
  // const {deviceInfo} = route.params;
  // console.log(deviceInfo);
  const [boxes, setBoxes] = useState([]);
  const navigateToQRCode = () => {
    navigation.navigate('TakeQRCode');
  };
  return (
    <View style={styles.group__container}>
      <View style={styles.group__headline}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.group__quit}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.group__text}>group devices</Text>
      </View>
      <View style={styles.group__boxes}></View>
      <TouchableOpacity
        onPress={navigateToQRCode}
        style={styles.group__add_container}>
        <Icon name="add" style={styles.groupp__add_icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  group__container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: res * 0.04,
    alignItems: 'center',
  },
  group__headline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: res * 0.05,
    alignItems: 'center',
    width: '100%',
  },
  group__quit: {},
  group__text: {
    fontSize: res * 0.03,
    textTransform: 'uppercase',
    color: '#000',
    fontWeight: '900',
  },
  group__boxes: {},
  group__add_container: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#15212D',
    width: '100%',
    alignItems: 'center',
    paddingVertical: res * 0.01,
    borderRadius: 10,
  },
  groupp__add_icon: {
    color: '#FFF',
    fontSize: res * 0.04,
  },
});
