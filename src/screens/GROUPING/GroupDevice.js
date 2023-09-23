import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Modal,
} from 'react-native';
import useBLE from '../../../useBLE';
import React, {useCallback, useEffect, useState} from 'react';
import BackArrow from '../components/BackArrow';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDeviceInfo} from './DeviceInfoContext';
import GroupDeviceModal from './GroupDeviceConnectionModal';

const res = Dimensions.get('window').height;

export default function GroupDevice({navigation, route}) {
  const {
    scanForDevices,
    allDevices,
    connectToDevice,
    data,
    disconnectFromDevice,
    sendDataToRXCharacteristic,
  } = useBLE();

  const {deviceInfoArray, clearDeviceInfoArray, addDeviceInfo} =
    useDeviceInfo();
  const [getQR, setGetQR] = useState('');
  const [update, setUpdate] = useState(false);
  const [qrArray, setQRArray] = useState([]);

  //HANDLE SPLIT DATA
  const dataSplited = data.split('|');
  id = parseInt([dataSplited[0]]);
  interval = parseInt([dataSplited[1]]);
  dataTime = Math.round((id * (interval / 1000)) / 60);
  dataSteps = parseInt([dataSplited[2]]);
  dataFlex = parseFloat([dataSplited[5]]);
  dataRun = parseFloat(([dataSplited[8]] * 3.6).toFixed(1));
  dataCalories = Math.round(dataSteps * 0.03);
  dataDistance = parseFloat((Math.floor(dataSteps * 0.2) / 1000).toFixed(2));

  //HANDLE PUSH QRCODE VALUE INTO NEW ARRAY
  useEffect(() => {
    const pushQRCode = deviceInfoArray.map(item => item.qrcode);
    setQRArray(pushQRCode);
  }, []);
  console.log(qrArray);

  //RENDER ITEMS AND CONNECTION IF MATCH QRCODE
  const renderDeviceModalListItem = useCallback(
    item => {
      const nameSplit = item.item.name.split('-');
      const idName = [nameSplit[1]].toString();
      //Scan for Android
      if (Platform.OS === 'android') {
        if (item.item.id === getQR) {
          connectToDevice(item.item);
        } else {
          return true;
        }
        //Scan for iOS
      } else if (Platform.OS === 'ios') {
        console.log(`QR before connect: ${getQR}`);
        if (idName === getQR) {
          connectToDevice(item.item);
        } else {
          return true;
        }
      }
    },
    [getQR],
  );

  //PUSH TO A NEW ARRAY
  const getValueWithQRArray = qr => {
    for (i = 0; i < qr.length; i++) {
      disconnectFromDevice();
      setGetQR('');
      setGetQR(qr[i]);
      sendDataToRXCharacteristic('read');
      handleSubmit();
    }
  };
  const handle = () => {
    getValueWithQRArray(qrArray);
  };
  //NAVIGATE
  const navigateToQRCode = () => {
    scanForDevices();
    navigation.navigate('TakeQRCode');
  };
  //CLEAR DEVICES LIST
  const handleClearGroup = () => {
    Alert.alert('Warning!', 'Do you want to clear all the devices ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('cancel clear'),
      },
      {
        text: 'OK',
        onPress: () => {
          clearDeviceInfoArray(), disconnectFromDevice();
        },
      },
    ]);
  };
  //REFRESH LIST
  const handleRefreshGroup = () => {
    sendDataToRXCharacteristic('read');
  };
  //SUBMIT
  const handleSubmit = () => {
    // Find the index of the existing object with the same "qrcode" in deviceInfoArray
    const existingIndex = deviceInfoArray.findIndex(
      item => item.qrcode === getQR,
    );
    // Create a new device info object with the entered values
    const newDeviceInfo = {
      qrcode: getQR,
      steps: dataSteps,
      time: dataTime,
      distance: dataDistance,
      calories: dataCalories,
      speed: dataRun,
      flex: dataFlex,
      rank: (dataDistance + dataCalories + dataRun + dataFlex) / dataTime,
    };
    if (existingIndex !== -1) {
      // If an object with the same "qrcode" exists, update it
      deviceInfoArray[existingIndex] = newDeviceInfo;
    }
  };
  //GET DEVICE QR CODE
  const handleGetString = device => {
    disconnectFromDevice();
    setGetQR('');
    setGetQR(device.qrcode);
    console.log('NEW DEVICE ADDED');
  };

  //AUTO SUBMIT DATA WITH MATCHING QRCODE
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('SUBMIT START');
      // Find the index of the existing object with the same "qrcode" in deviceInfoArray
      const existingIndex = deviceInfoArray.findIndex(
        item => item.qrcode === getQR,
      );
      // Create a new device info object with the entered values
      const newDeviceInfo = {
        qrcode: getQR,
        steps: dataSteps,
        time: dataTime,
        distance: dataDistance,
        calories: dataCalories,
        speed: dataRun,
        flex: dataFlex,
        rank: (dataDistance + dataCalories + dataRun + dataFlex) / dataTime,
      };
      if (existingIndex !== -1) {
        // If an object with the same "qrcode" exists, update it
        deviceInfoArray[existingIndex] = newDeviceInfo;
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [getQR]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setUpdate(true);
  //   }, 7000);
  //   return () => clearInterval(interval);
  // }, [update]);

  return (
    <View style={styles.group__container}>
      <View style={styles.group__headline}>
        {/* HEADER */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.group__quit}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.group__text}>group devices</Text>
      </View>
      {/* CONTROLLER */}
      {deviceInfoArray.length > 0 ? (
        <View style={styles.group__controller}>
          {/* BUTTON */}
          <TouchableOpacity
            onPress={handle}
            style={[
              styles.group__control_btn,
              styles.group__clear,
              styles.shadow,
            ]}>
            <Icon
              name="favorite"
              style={[styles.group__control_icon, styles.group__clear_icon]}
            />
          </TouchableOpacity>
          {/* CLEAR DEVICES */}
          <TouchableOpacity
            onPress={handleClearGroup}
            style={[
              styles.group__control_btn,
              styles.group__clear,
              styles.shadow,
            ]}>
            <Icon
              name="cleaning-services"
              style={[styles.group__control_icon, styles.group__clear_icon]}
            />
          </TouchableOpacity>
          {/* REFRESH */}
          <TouchableOpacity
            onPress={handleRefreshGroup}
            style={[
              styles.group__control_btn,
              styles.group__refresh,
              styles.shadow,
            ]}>
            <Icon
              name="refresh"
              style={[styles.group__control_icon, styles.group__refresh_icon]}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      {/* STUDENT INFORMATION */}
      <ScrollView style={styles.group__boxes}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: res * 0.05,
          }}>
          <Text>{data}</Text>
          <Button title="Submit" onPress={handleSubmit} />
        </View>

        <View style={styles.group__content}>
          {deviceInfoArray.map((device, index) => (
            <TouchableOpacity
              // onPress={openModal}
              onPress={() => handleGetString(device)}
              style={[styles.group__item, styles.shadow]}
              key={index}>
              {/* INFORMATION */}
              <View style={styles.group__item__info}>
                <Image
                  source={{uri: device.capturedImage}}
                  style={styles.group__item_image}
                />
                {/* QR */}
                <View style={styles.group__item_qrcode_container}>
                  <Text style={styles.group__item_qrcode}>
                    {device.qrcode.substring(9)}
                    {/* {item.qrcode} */}
                  </Text>
                </View>
              </View>
              {/* STATS */}
              <View style={styles.group__item_stat}>
                {/* STEPS */}
                <View style={styles.stat__info}>
                  <Icon
                    name="run-circle"
                    style={[styles.stat__icon, styles.step]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>{device.steps}</Text>
                    <Text style={styles.stat__unit}>steps</Text>
                  </View>
                </View>
                {/* TIME */}
                <View style={styles.stat__info}>
                  <Icon
                    name="schedule"
                    style={[styles.stat__icon, styles.time]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>{device.time}</Text>
                    <Text style={styles.stat__unit}>time</Text>
                  </View>
                </View>
                {/* CALORIES */}
                <View style={styles.stat__info}>
                  <Icon
                    name="local-fire-department"
                    style={[styles.stat__icon, styles.calories]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>{device.calories}</Text>
                    <Text style={styles.stat__unit}>kcal</Text>
                  </View>
                </View>
                {/* DISTANCE */}
                <View style={styles.stat__info}>
                  <Icon
                    name="directions-walk"
                    style={[styles.stat__icon, styles.distance]}
                  />
                  <View style={styles.stat__number_container}>
                    <Text style={styles.stat__number}>{device.distance}</Text>
                    <Text style={styles.stat__unit}>km</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* ADD DEVICE */}
      {deviceInfoArray.length < 10 ? (
        <View style={styles.group__add_container}>
          <TouchableOpacity
            onPress={navigateToQRCode}
            // onPress={openModal}
            style={styles.group__add_content}>
            <Icon name="add" style={styles.groupp__add_icon} />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      <FlatList
        contentContainerStyle={styles.modalFlatlistContiner}
        data={allDevices}
        renderItem={renderDeviceModalListItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group__container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#E0E0E0',
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
  group__controller: {
    marginVertical: res * 0.02,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: res * 0.04,
    gap: 20,
  },
  group__control_btn: {
    width: res * 0.05,
    height: res * 0.05,
    borderRadius: (res * 0.05) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group__clear: {
    backgroundColor: '#F44336',
  },
  group__refresh: {
    backgroundColor: '#4CAF50',
  },

  group__control_icon: {
    fontSize: res * 0.02,
    fontWeight: '600',
    color: '#FFF',
  },
  group__boxes: {
    width: '100%',
    height: '100%',
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
    width: res * 0.1,
    height: res * 0.1,
    resizeMode: 'cover',
    borderRadius: (res * 0.1) / 2,
  },
  group__item_qrcode_container: {
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
    fontSize: res * 0.02,
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
