import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackArrow from '../components/BackArrow';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDeviceInfo} from './DeviceInfoContext';

const res = Dimensions.get('window').height;

export default function GroupDevice({navigation}) {
  const {deviceInfoArray} = useDeviceInfo();
  const navigateToQRCode = () => {
    navigation.navigate('TakeQRCode');
  };
  console.log(deviceInfoArray.length);
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
      <View></View>
      <ScrollView style={styles.group__boxes}>
        <View style={styles.group__content}>
          {deviceInfoArray.map((item, index) => (
            <View style={[styles.group__item, styles.shadow]} key={index}>
              {/* INFORMATION */}
              <View style={styles.group__item__info}>
                <Image
                  source={{uri: item.capturedImage}}
                  style={styles.group__item_image}
                />
                {/* CONTROLLER */}
                <View style={styles.group__item_control}>
                  <Text style={styles.group__item_qrcode}>
                    {item.qrcode.substring(12)}
                  </Text>
                </View>
              </View>
              {/* STATS */}
              <View style={styles.group__item_stat}>
                <View style={styles.stat__info}>
                  <Icon
                    name="run-circle"
                    style={[styles.stat__icon, styles.step]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>239</Text>
                    <Text style={styles.stat__unit}>steps</Text>
                  </View>
                </View>
                <View style={styles.stat__info}>
                  <Icon
                    name="schedule"
                    style={[styles.stat__icon, styles.time]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>15</Text>
                    <Text style={styles.stat__unit}>time</Text>
                  </View>
                </View>
                <View style={styles.stat__info}>
                  <Icon
                    name="local-fire-department"
                    style={[styles.stat__icon, styles.calories]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>139</Text>
                    <Text style={styles.stat__unit}>kcal</Text>
                  </View>
                </View>
                <View style={styles.stat__info}>
                  <Icon
                    name="directions-walk"
                    style={[styles.stat__icon, styles.distance]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>4.12</Text>
                    <Text style={styles.stat__unit}>km</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.group__add_container}>
        <TouchableOpacity
          onPress={navigateToQRCode}
          style={styles.group__add_content}>
          <Icon name="add" style={styles.groupp__add_icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group__container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  group__headline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: res * 0.05,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: res * 0.04,
  },
  group__text: {
    fontSize: res * 0.03,
    textTransform: 'uppercase',
    color: '#000',
    fontWeight: '900',
  },
  group__boxes: {
    width: '100%',
    height: '100%',
    marginTop: res * 0.05,
  },
  group__content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: res * 0.04,
    marginBottom: res * 0.1,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: -3,
      height: 7,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5.68,
    elevation: 12,
  },
  group__item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FFF',
    marginBottom: res * 0.02,
    padding: res * 0.02,
    borderRadius: 10,
  },
  group__item__info: {
    width: '30%',
    alignItems: 'center',
  },
  group__item_image: {
    width: res * 0.12,
    height: res * 0.12,
    resizeMode: 'cover',
    borderRadius: (res * 0.12) / 2,
  },
  group__item_control: {
    backgroundColor: '#000',
    marginTop: res * 0.01,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: res * 0.005,
  },
  group__item_qrcode: {
    fontSize: res * 0.02,
    fontWeight: '600',
    color: '#FFF',
  },
  group__item_stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    flexWrap: 'wrap',
    width: '65%',
  },
  stat__info: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat__icon: {
    fontSize: res * 0.03,
    marginRight: res * 0.01,
  },
  step: {
    color: '#EE6866',
  },
  time: {
    color: '#E1B52B',
  },
  calories: {
    color: '#FC6D06',
  },
  distance: {
    color: '#F85C23',
  },
  stat__number_container: {
    alignItems: 'center',
  },
  stat__number: {
    fontSize: res * 0.025,
    fontWeight: '900',
    color: '#000',
  },
  stat__unit: {
    color: '#000',
  },

  group__add_container: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingHorizontal: res * 0.04,
  },
  group__add_content: {
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
