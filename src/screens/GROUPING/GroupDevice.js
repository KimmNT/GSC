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
    connectedDevice,
  } = useBLE();

  const {deviceInfoArray, clearDeviceInfoArray, addDeviceInfo} =
    useDeviceInfo();
  const [getQR, setGetQR] = useState('');
  const [update, setUpdate] = useState(false);
  const [qrArray, setQRArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(true);

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
    const qrInterval = setInterval(() => {
      const pushQRCode = deviceInfoArray.map(item => item.qrcode);
      setQRArray(pushQRCode);
    }, 1000);
    return () => clearInterval(qrInterval);
  }, [qrArray]);

  //COUNT ITEMS IN qrArray
  const qrArrayTotalTimeRun = 10000 * qrArray.length + 5000;

  //HANDLE SEND TO RX
  useEffect(() => {
    const sendInterval = setInterval(() => {
      sendDataToRXCharacteristic('read');
      handleSubmit();
      setUpdate(!update);
    }, 5000);
    return () => clearInterval(sendInterval);
  }, [update]);

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
        if (idName === getQR) {
          connectToDevice(item.item);
        } else {
          return true;
        }
      }
    },
    [getQR],
  );
  //CONNECT DEVICES FUNCTION
  const handleRefreshGroup = () => {
    qrArray.forEach((item, index) => {
      setTimeout(() => {
        disconnectFromDevice();
        setGetQR('');
        setGetQR(item);
        setIsRunning(true);
      }, index * 10000);
    });
  };
  //NAVIGATE TO QRCODE
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
          clearDeviceInfoArray(),
            setQRArray([]),
            setGetQR(''),
            disconnectFromDevice();
        },
      },
    ]);
  };
  //SUBMIT FUNCTION
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
  // const handleGetString = device => {
  //   disconnectFromDevice();
  //   setGetQR('');
  //   setGetQR(device.qrcode);
  //   console.log('NEW DEVICE ADDED');
  // };
  //DISCONNECT TO SCAN DEVICES
  const handleDisconnect = () => {
    console.log('DISCONNECT PRESSED');
    disconnectFromDevice();
    setGetQR('');
    setIsRunning(false);
    setUpdate(!update);
    setIsDone(true);
  };
  //CHANGE STATE AFTER AMOUNT OF TIME
  useEffect(() => {
    if (isRunning) {
      setTimeout(() => {
        // console.log('DISCONNECT PRESSED');
        // disconnectFromDevice();
        // setGetQR('');
        // setUpdate(!update);
        // setIsRunning(false);
        setIsRunning(false);
        setIsDone(false);
      }, qrArrayTotalTimeRun);
    }
  }, [isRunning]);

  // console.log(`isRunning value: ${isRunning}`);
  // console.log(`isDone value: ${isDone}`);
  // console.log(`getQR value :${getQR}`);

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
          {isRunning ? (
            <View style={styles.group__control_running}>
              <Text style={styles.group__control_running_text}>
                Smart Coach is currently updating the latest data.
              </Text>
              <Text style={styles.group__control_running_text}>
                Please wait a moment!
              </Text>
            </View>
          ) : (
            <View style={{width: '100%'}}>
              {isDone ? (
                <View style={styles.group__control_btn_box}>
                  <Text style={styles.device__count}>
                    {deviceInfoArray.length}/10
                  </Text>
                  <View style={styles.group__controller_notruning}>
                    <TouchableOpacity
                      onPress={handleClearGroup}
                      style={[
                        styles.group__control_btn,
                        styles.group__clear,
                        styles.shadow,
                      ]}>
                      <Icon
                        name="cleaning-services"
                        style={[
                          styles.group__control_icon,
                          styles.group__clear_icon,
                        ]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleRefreshGroup}
                      style={[
                        styles.group__control_btn,
                        styles.group__refresh,
                        styles.shadow,
                      ]}>
                      <Icon
                        name="refresh"
                        style={[
                          styles.group__control_icon,
                          styles.group__refresh_icon,
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.group__control_btn_box}>
                  <Text style={styles.device__count}>
                    {deviceInfoArray.length}/10
                  </Text>
                  <TouchableOpacity
                    onPress={handleDisconnect}
                    style={[
                      styles.group__control_btn,
                      styles.group__clear,
                      styles.shadow,
                    ]}>
                    <Icon
                      name="clear"
                      style={[
                        styles.group__control_icon,
                        styles.group__clear_icon,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        <></>
      )}
      {/* STUDENT INFORMATION */}
      <ScrollView style={styles.group__boxes}>
        <View style={styles.group__content}>
          {deviceInfoArray.map((device, index) => (
            <TouchableOpacity
              // onPress={() => handleGetString(device)}
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
    marginVertical: res * 0.03,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: res * 0.04,
  },
  group__control_running: {
    width: '100%',
    marginVertical: res * 0.01,
  },
  group__control_running_text: {
    fontSize: res * 0.02,
    width: '100%',
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#757575',
  },
  group__controller_notruning: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: res * 0.04,
  },
  group__control_btn_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  device__count: {
    fontWeight: '900',
    color: '#000',
  },
  group__control_btn: {
    paddingHorizontal: res * 0.035,
    paddingVertical: res * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  group__clear: {
    backgroundColor: '#F44336',
  },
  group__refresh: {
    backgroundColor: '#4CAF50',
  },

  group__control_icon: {
    fontSize: res * 0.025,
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
    bottom: res * 0.04,
    width: '100%',
    paddingHorizontal: res * 0.04,
    alignItems: 'flex-end',
  },
  group__add_content: {
    backgroundColor: '#15212D',
    width: res * 0.11,
    height: res * 0.11,
    borderRadius: (res * 0.11) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: res * 0.01,
  },
  groupp__add_icon: {
    color: '#FFF',
    fontSize: res * 0.04,
  },
});
