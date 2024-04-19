import {
  Alert,
  Image,
  groupStyleheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
//USE CONTEXT
import {useQRCodeContext} from '../../ReactContexts/QRcodeContext.js';
import {useQRListContext} from '../../ReactContexts/QRlistContext.js';
import {useStudentInfo} from '../../ReactContexts/StudentInfoContext.js';

//BLE FUNCTIONAL
import BluetoothFunctional from '../../../BluetoothFunctional.js';

//MODAL GET CLASS ID
import GetClassesModel from '../components/GetClassesModel';

//STYLE
import groupStyle from '../../styles/GroupStyle.js';

//IMAGE
import BackGround from '../../../assets/images/background.png';
import NonAva from '../../../assets/images/emptyAvatar.png';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';

//SWIPE ANIMATION
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {G} from 'react-native-svg';

const res = Dimensions.get('window').height;

export default function Group({navigation}) {
  //BLOCK THE SWIPE BACK
  navigation.setOptions({
    gestureEnabled: false,
  });
  const {
    startScan,
    stopDevice,
    allDevices,
    requestPermissions,
    connectToDevice,
    connectedDevice,
    data,
    readDevice,
    disconnectFromDevice,
  } = BluetoothFunctional();
  const {scannedQRCodes} = useQRCodeContext();
  const {qrList} = useQRListContext();
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const [isGetClassVisibal, setGetClassVisible] = useState(false);
  const [classIdChose, setClassIdChose] = useState('');
  const {studentInfoArray} = useStudentInfo();
  const [startGetting, setStartGetting] = useState(false);
  const [startCleaning, setStartCleaning] = useState(false);
  const [classNameChose, setClassNameChose] = useState(
    'Choose your class/club',
  );

  //LOADING BLE DEVICES
  useEffect(() => {
    // Request location permission before starting BLE scan
    requestPermissions(granted => {
      if (granted) {
        // Start BLE scan when permission is granted
        startScan();
      } else {
        console.log('Location permission denied.');
      }
    });

    // Cleanup function to stop BLE scan when the component unmounts
    return () => {
      stopDevice();
    };
  }, [startScan, stopDevice, requestPermissions]);

  if (connectedDevice) {
    console.log('CONNECTED HAHA');
    if (startGetting) {
      setTimeout(() => {
        readDevice('read');
      }, 1000);
    }
    if (startCleaning) {
      setTimeout(() => {
        readDevice('delete');
      }, 1000);
      setStartCleaning(false);
    }
  }

  //HIDE CLASS MODAL
  const hideGetClass = () => {
    setGetClassVisible(false);
  };
  //OPEN GetClassModel
  const openGetClassModel = () => {
    setGetClassVisible(true);
  };
  //HOLD CLASS ID SENT BACK FROM CLASS MODAL
  const handleClassId = classId => {
    setClassIdChose(classId);
  };
  //HOLD CLASS NAME SENT BACK FROM CLASS MODAL
  const handleClassName = className => {
    setClassNameChose(className);
  };

  //HANDLE OPEN CAMERA
  const handleOpenCamera = () => {
    if (classNameChose != 'Choose your class/club') {
      navigation.navigate('TakeQRCode', {classIdChose});
    } else {
      openGetClassModel();
    }
  };

  //FUNCTION GET DEVICE'S VALUE
  const handleGetValue = async qrcode => {
    try {
      console.log('START HANDLE');
      setStartGetting(true);
      disconnectFromDevice();
      allDevices.find(item => {
        const itemNameCut = item.name.substring(4);
        if (qrcode == itemNameCut) {
          connectToDevice(item);
        }
      });
      // await readDevice('read');
      disconnectFromDevice();
      //   setStartGetting(false);
      console.log('END HANDLE');
    } catch (error) {
      console.error('Error in handleGetValue:', error);
    }
  };

  //HANDLE LOOP GET DEVICE'S VALUE
  const handleGet = async () => {
    const promises = qrList.map(async item => {
      try {
        setRunning(true);
        await handleGetValue(item.qrcode);
        // Wait for 2 seconds before calling readDevice
        await new Promise(resolve => setTimeout(resolve, 2000));
        await readDevice('read');
      } catch (error) {
        console.error(`Error processing QR code ${item.qrcode}:`, error);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // This code will execute when all promises are resolved
    setDone(true);
  };

  //HANDLE DISCONNECT
  const handleDisconnect = () => {
    disconnectFromDevice();
    setDone(false);
    setRunning(false);
    setStartGetting(false);
  };

  //HANDLE SAVE
  const handleSave = () => {
    Alert.alert('Warning', "Do you want to save students's information ?", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel saving group'),
      },
      {
        text: 'OK',
        onPress: () => navigation.navigate('Submitting', {classIdChose}),
      },
    ]);
  };

  //DELETE SWIPED STUDENT
  const rightSwipeActions = qrcode => {
    return (
      <TouchableOpacity
        onPress={() => handleClearDevice(qrcode)}
        style={groupStyle.group__btn_clear}>
        <Icon name="cleaning-services" style={groupStyle.btn__clear_icon} />
      </TouchableOpacity>
    );
  };

  const handleClearDevice = qrcode => {
    if (!running) {
      setStartCleaning(true);
      disconnectFromDevice();
      allDevices.find(item => {
        const itemNameCut = item.name.substring(4);
        if (qrcode == itemNameCut) {
          connectToDevice(item);
        }
      });
      disconnectFromDevice();
    } else {
      Alert.alert(
        'Notification',
        'This action cannot be done while connecting to devices',
      );
    }
  };

  return (
    <View style={groupStyle.group__container}>
      {/* <Image source={BackGround} style={groupStyle.group__img_background} /> */}
      {/* HEADER */}
      <View style={groupStyle.group__content}>
        <Text style={groupStyle.group__title}>group devices</Text>
        <View style={groupStyle.group__header}>
          <View style={groupStyle.header__total}>
            <Text style={groupStyle.total__count}>Total devices:</Text>
            <Text style={groupStyle.total__number}>
              {scannedQRCodes.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={openGetClassModel}
            style={groupStyle.header__classes}>
            <Text style={groupStyle.classes__name}>{classNameChose}</Text>
          </TouchableOpacity>
          -
        </View>
        {/* LIST */}
        <ScrollView
          style={groupStyle.group__boxes}
          showsVerticalScrollIndicator={false}>
          <View style={groupStyle.group__item_list}>
            <View style={groupStyle.group__item_imagelist}>
              {studentInfoArray.map((student, index) => (
                <View style={groupStyle.group__item_imagelist_item}>
                  {student.stuAva ? (
                    <View
                      style={[
                        groupStyle.group__item_image_layer,
                        groupStyle.shadow,
                      ]}>
                      <Image
                        key={index}
                        source={{uri: student.stuAva}}
                        style={groupStyle.group__item_image}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        groupStyle.group__item_image_layer,
                        groupStyle.shadow,
                      ]}>
                      <Image
                        key={index}
                        source={NonAva}
                        style={groupStyle.group__item_image}
                      />
                    </View>
                  )}
                  <View style={groupStyle.group__item_name}>
                    <Text style={groupStyle.student__name}>
                      {student.stuName}
                    </Text>
                  </View>
                  <View style={groupStyle.group__item_qrcode}>
                    <Text style={groupStyle.qrocde_value}>
                      {student.qrcode.substring(9, 15)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={groupStyle.group__item_information}>
              {scannedQRCodes.map((device, index) => (
                <GestureHandlerRootView
                  style={[groupStyle.group__item, groupStyle.shadow]}>
                  <Swipeable
                    style={groupStyle.group__item_content}
                    renderRightActions={() => rightSwipeActions(device.qrcode)}
                    key={index}>
                    {/* STATS */}
                    <View style={groupStyle.group__item_stat}>
                      {/* WHEN THE RESULT NOT IN NUMBER TYPE */}
                      {device.steps == 'NaN' ? (
                        <View style={groupStyle.group__item_notasnumber}>
                          <Icon
                            name="sensors-off"
                            style={groupStyle.out__of_range}
                          />
                          <Text style={groupStyle.out__of_range_text}>
                            Try again later
                          </Text>
                        </View>
                      ) : (
                        <></>
                      )}
                      {/* TIME */}
                      {device.time == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={groupStyle.stat__info}>
                          <View style={groupStyle.stat__header}>
                            <Icon
                              name="schedule"
                              style={[groupStyle.stat__icon, groupStyle.time]}
                            />
                            <Text style={groupStyle.stat__unit}>mins</Text>
                          </View>
                          <Text style={groupStyle.stat__number}>
                            {parseInt(device.time).toFixed(0)}
                          </Text>
                        </View>
                      )}
                      {/* STEPS */}
                      {device.steps == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={groupStyle.stat__info}>
                          <View style={groupStyle.stat__header}>
                            <Icon
                              name="directions-walk"
                              style={[groupStyle.stat__icon, groupStyle.step]}
                            />
                            <Text style={groupStyle.stat__unit}>steps</Text>
                          </View>
                          <Text style={groupStyle.stat__number}>
                            {parseInt(device.steps).toFixed(0)}
                          </Text>
                        </View>
                      )}
                      {/* CALORIES */}
                      {device.calories == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={groupStyle.stat__info}>
                          <View style={groupStyle.stat__header}>
                            <Icon
                              name="local-fire-department"
                              style={[
                                groupStyle.stat__icon,
                                groupStyle.calories,
                              ]}
                            />
                            <Text style={groupStyle.stat__unit}>cal</Text>
                          </View>
                          <Text style={groupStyle.stat__number}>
                            {parseInt(device.calories).toFixed(0)}
                          </Text>
                        </View>
                      )}
                      {/* DISTANCE */}
                      {device.distance == 'NaN' ? (
                        <></>
                      ) : (
                        <View style={groupStyle.stat__info}>
                          <View style={groupStyle.stat__header}>
                            <Icon
                              name="run-circle"
                              style={[
                                groupStyle.stat__icon,
                                groupStyle.distance,
                              ]}
                            />
                            <Text style={groupStyle.stat__unit}>m</Text>
                          </View>
                          <Text style={groupStyle.stat__number}>
                            {parseInt(device.distance).toFixed(0)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Swipeable>
                </GestureHandlerRootView>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      {/* CONTROLLER */}
      {/* CREATE BUTTON */}
      <TouchableOpacity
        onPress={handleOpenCamera}
        style={groupStyle.group__btn_create}>
        <Icon name="add" style={groupStyle.btn__create_icon} />
      </TouchableOpacity>
      {/* GET LATEST, DISCONNECT, UPLOAD */}
      {done ? (
        <TouchableOpacity
          onPress={handleDisconnect}
          style={groupStyle.group__btn_disconnect}>
          <Icon name="cancel" style={groupStyle.btn__disconnect_icon} />
        </TouchableOpacity>
      ) : (
        <>
          {scannedQRCodes.length > 0 ? (
            <View style={groupStyle.group__btn_control}>
              <TouchableOpacity
                onPress={handleGet}
                style={groupStyle.group__btn_get}>
                <Icon name="refresh" style={groupStyle.btn__get_icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={groupStyle.group__btn_upload}>
                <Icon name="upload" style={groupStyle.btn__upload_icon} />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </>
      )}
      {/* MODEL */}
      <GetClassesModel
        closeModal={hideGetClass}
        visible={isGetClassVisibal}
        sendClassId={handleClassId}
        sendClassName={handleClassName}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
