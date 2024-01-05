import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import useBLE from '../../../useBLE';
import React, {useCallback, useEffect, useState} from 'react';
import BackArrow from '../components/BackArrow';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDeviceInfo} from '../../ReactContexts/DeviceInfoContext';
import {useStudentInfo} from '../../ReactContexts/StudentInfoContext';
import GetClassesModel from '../components/GetClassesModel';
import NonAva from '../../../assets/images/emptyAvatar.png';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const res = Dimensions.get('window').height;

//DELETE SWIPED STUDENT
const rightSwipeActions = (qrcode, studentArray, deviceArray) => {
  return (
    <TouchableOpacity
      onPress={() => handleDeleteStudent(qrcode, studentArray, deviceArray)}
      style={styles.delete__item_btn}>
      <Icon name="delete" style={styles.delete__item} />
    </TouchableOpacity>
  );
};

//REMOVE STUDENT AND DEVICE FROM THE ARRAY
const handleDeleteStudent = (qrcode, studentArray, deviceArray) => {
  const index = studentArray.findIndex(item => item.qrcode === qrcode);
  studentArray.splice(index, 1);
  deviceArray.splice(index, 1);
};

export default function GroupDevice({navigation, route}) {
  navigation.setOptions({
    gestureEnabled: false,
  });
  const {
    startScan,
    stopDevice,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
    sendDataToRXCharacteristic,
    clearDevices,
    totalDevices,
  } = useBLE();

  const {deviceInfoArray, clearDeviceInfoArray, addDeviceInfo} =
    useDeviceInfo();
  const {studentInfoArray, clearStudentInfoArray, addStudentInfo} =
    useStudentInfo();
  const [getQR, setGetQR] = useState('');
  const [update, setUpdate] = useState(false);
  const [qrArray, setQRArray] = useState([]);
  const [imgArray, setImgArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(true);
  const [isClean, setIsClean] = useState(true);
  const [isGetClassVisibal, setGetClassVisible] = useState(false);
  const [classIdChose, setClassIdChose] = useState('');
  const [classNameChose, setClassNameChose] = useState(
    'Choose your class/club',
  );

  //TIMEOUT
  const timeOut = 4500;

  //HANDLE SPLIT DATA
  const dataSplited = data.split('|');
  id = parseInt([dataSplited[0]]);
  interval = parseInt([dataSplited[1]]);
  dataTime = parseInt(Math.round((id * (interval / 1000)) / 60)).toFixed(2);
  dataSteps = parseInt([dataSplited[2]]).toFixed(2);
  dataFlex = parseFloat([dataSplited[5]]).toFixed(2);
  dataRunAVG = parseFloat([dataSplited[9]] * 3.6).toFixed(2);
  dataRunMaX = parseFloat(([dataSplited[10]] * 3.6).toFixed(2));
  dataCalories = parseFloat(Math.round(dataSteps * 0.03)).toFixed(2);
  dataDistance = parseFloat(Math.floor(dataSteps * 0.2)).toFixed(2);
  dataJump = parseInt([dataSplited[6]]).toFixed(2);

  //HANDLE PUSH QRCODE VALUE INTO NEW ARRAY
  useEffect(() => {
    const qrInterval = setInterval(() => {
      const pushQRCode = deviceInfoArray.map(item => item.qrcode);
      setQRArray(pushQRCode);
    }, 1000);
    return () => clearInterval(qrInterval);
  }, [qrArray]);

  //COUNT ITEMS IN qrArray
  const qrArrayTotalTimeRun = timeOut * qrArray.length + 1000;
  //each device take A(s) to run * quantity of devices + add more 5s to make sure can take the latest data

  //HANDLE SEND TO RX
  useEffect(() => {
    const sendInterval = setInterval(() => {
      if (isClean) {
        connectToBLEDevice();
        // sendDataToRXCharacteristic('read');
        sendDataToRXCharacteristic('delete');
        setUpdate(!update);
      } else {
        connectToBLEDevice();
        sendDataToRXCharacteristic('read');
        setUpdate(!update);
      }
    }, 1000);
    return () => clearInterval(sendInterval);
  }, [update]);

  const connectToBLEDevice = async () => {
    // const matchingDevice = allDevices.find(item => {
    //   const nameSplit = item.name.split('-');
    //   const idName = [nameSplit[1]].toString();
    //   if (Platform.OS === 'android' && item.id === getQR) {
    //     return true;
    //   } else if (Platform.OS === 'ios' && idName === getQR) {
    //     return true;
    //   }
    //   return false;
    // });
    // if (matchingDevice) {
    //   try {
    //     await connectToDevice(matchingDevice);
    //     sendDataToRXCharacteristic('read');
    //     handleSubmit();
    //   } catch (error) {
    //     console.error('Error connecting to BLE device:', error);
    //   }
    // } else {
    //   console.log('NOT MATCHING!');
    // }
    allDevices.find(item => {
      const nameSplit = item.name.split('-');
      const idName = [nameSplit[1]].toString();
      if (Platform.OS === 'android' && item.id === getQR) {
        connectToDevice(item);
        handleSubmit();
        console.log(`QR connected ${item.id}`);
      } else if (Platform.OS === 'ios' && idName === getQR) {
        connectToDevice(item);
        handleSubmit();
        console.log(`QR connected ${idName}`);
      }
    });
  };

  //QUIT TO HOME PAGE
  // const handleQuit = () => {
  //   navigation.goBack();
  // };

  //CONNECT DEVICES FUNCTION
  const handleRefreshGroup = () => {
    qrArray.forEach((item, index) => {
      setTimeout(() => {
        disconnectFromDevice();
        setGetQR('');
        setGetQR(item);
        setIsRunning(true);
        console.log(`QR taken: ${item}`);
      }, index * timeOut);
    });
  };
  //NAVIGATE TO  QRCODE
  const navigateToQRCode = () => {
    if (classIdChose === '') {
      Alert.alert(
        'Warning',
        "You haven't selected your class/club. \n Please choose your class/club before start matching devices",
      );
    } else {
      requestPermissions(isGranted => {
        if (isGranted) {
          // startScan();
          navigation.navigate('TakeQRCode', {classIdChose});
        }
      });
    }
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
      classId: classIdChose,
      steps: dataSteps,
      time: dataTime,
      distance: dataDistance,
      calories: dataCalories,
      speed__avg: dataRunAVG,
      speed__max: dataRunMaX,
      jump: dataJump,
      flex: dataFlex,
    };
    if (existingIndex !== -1) {
      // If an object with the same "qrcode" exists, update it
      deviceInfoArray[existingIndex] = newDeviceInfo;
    }
  };

  //HANDLE DISCONNECT
  useEffect(() => {
    if (isDone === false && isRunning === false) {
      Alert.alert('Successfully!', 'The process has been completed.', [
        {
          text: 'OK',
          onPress: () => {
            disconnectFromDevice();
            setGetQR('');
            setIsRunning(false);
            setUpdate(!update);
            setIsDone(true);
          },
        },
      ]);
    }
  }, [isDone, isRunning]);

  //CHANGE STATE AFTER AMOUNT OF TIME
  useEffect(() => {
    if (isRunning) {
      setTimeout(() => {
        setIsRunning(false);
        setIsDone(false);
        setGetQR('');
        setIsClean(false);
      }, qrArrayTotalTimeRun);
    }
  }, [isRunning]);
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
  //HANDLE SAVE DATA
  const handleSave = () => {
    Alert.alert('Warning', "Do you want to save students's information ?", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel saving group'),
      },
      {
        text: 'OK',
        onPress: () => navigation.navigate('Submitting'),
      },
    ]);
  };
  //HANDLE CLEAR DATA
  const handleClearData = () => {
    qrArray.forEach((item, index) => {
      setTimeout(() => {
        setIsClean(true);
        disconnectFromDevice();
        setGetQR('');
        setGetQR(item);
        setIsRunning(true);
        console.log(item);
      }, index * 4000);
    });
  };

  // console.log(deviceInfoArray);
  return (
    <View style={styles.group__container}>
      <View style={styles.group__headline}>
        {/* HEADER */}
        {/* {isRunning ? (
          <Text></Text>
        ) : (
          <TouchableOpacity onPress={handleQuit} style={styles.group__quit}>
            <BackArrow />
          </TouchableOpacity>
        )} */}
        <Text style={styles.group__text}>group devices</Text>
      </View>
      <View style={styles.group__deviceCount}>
        <Text style={styles.device__count}>{deviceInfoArray.length}/10</Text>
        <TouchableOpacity
          onPress={openGetClassModel}
          style={styles.group__classes_container}>
          <Text style={styles.group__classes}>{classNameChose}</Text>
        </TouchableOpacity>
      </View>
      {/* ON READ DATA  */}
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
        <></>
      )}
      {/* CONTROLLER */}
      {deviceInfoArray.length > 0 ? (
        <View style={styles.group__controller_container}>
          <View style={styles.group__controller}>
            {isRunning ? (
              <></>
            ) : (
              <View
                style={{
                  width: '100%',
                }}>
                {isDone ? (
                  <View style={styles.group__control_btn_box}>
                    <View style={styles.group__controller_notruning}>
                      {/* CLEAN */}
                      {/* <TouchableOpacity
                        onPress={handleClearData}
                        style={[
                          styles.group__control_btn,
                          styles.group__clear,
                          styles.shadow,
                        ]}>
                        <Icon
                          name="cleaning-services"
                          style={[
                            styles.group__control_icon,
                            styles.group__refresh_icon,
                          ]}
                        />
                      </TouchableOpacity> */}
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
                          style={[
                            styles.group__control_icon,
                            styles.group__refresh_icon,
                          ]}
                        />
                      </TouchableOpacity>
                      {/* SAVE */}
                      <TouchableOpacity
                        onPress={handleSave}
                        style={[
                          styles.group__control_btn,
                          styles.group__save,
                          styles.shadow,
                        ]}>
                        <Icon
                          name="upload"
                          style={[
                            styles.group__control_icon,
                            styles.group__save_icon,
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
      {/* STUDENT INFORMATION */}
      <ScrollView style={styles.group__boxes}>
        {/* DEBUG THE DATA */}
        {/* <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            color: '#000',
            width: '100%',
          }}>
          <Text>{data}</Text>
        </View> */}
        <View style={styles.group__content}>
          <View style={styles.group__item_imagelist}>
            {studentInfoArray.map((student, index) => (
              <View style={styles.group__item_imagelist_item}>
                {student.stuAva ? (
                  <View style={[styles.group__item_image_layer, styles.shadow]}>
                    <Image
                      key={index}
                      source={{uri: student.stuAva}}
                      style={styles.group__item_image}
                    />
                  </View>
                ) : (
                  <View style={[styles.group__item_image_layer, styles.shadow]}>
                    <Image
                      key={index}
                      source={NonAva}
                      style={styles.group__item_image}
                    />
                  </View>
                )}
                <Text style={styles.group__item_qrcode}>
                  {student.qrcode.substring(9, 15)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.group__item_information}>
            {deviceInfoArray.map((device, index) => (
              <GestureHandlerRootView
                style={[styles.group__item, styles.shadow]}>
                <Swipeable
                  style={styles.group__item_content}
                  renderRightActions={() =>
                    rightSwipeActions(
                      device.qrcode,
                      studentInfoArray,
                      deviceInfoArray,
                    )
                  }
                  key={index}>
                  {/* STATS */}
                  <View style={styles.group__item_stat}>
                    {/* WHEN THE RESULT NOT IN NUMBER TYPE */}
                    {device.steps == 'NaN' ? (
                      <View style={styles.group__item_notasnumber}>
                        <Icon name="sensors-off" style={styles.out__of_range} />
                        <Text style={styles.out__of_range_text}>
                          Try again later
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                    {/* STEPS */}
                    {device.steps == 'NaN' ? (
                      <></>
                    ) : (
                      <View style={styles.stat__info}>
                        <Icon
                          name="run-circle"
                          style={[styles.stat__icon, styles.step]}
                        />
                        <View style={styles.stat__number_container}>
                          <Text style={styles.stat__number}>
                            {parseInt(device.steps).toFixed(0)}
                          </Text>
                          <Text style={styles.stat__unit}>steps</Text>
                        </View>
                      </View>
                    )}
                    {/* TIME */}
                    {device.time == 'NaN' ? (
                      <></>
                    ) : (
                      <View style={styles.stat__info}>
                        <Icon
                          name="schedule"
                          style={[styles.stat__icon, styles.time]}
                        />
                        <View style={styles.stat__number_container}>
                          <Text style={styles.stat__number}>
                            {parseInt(device.time).toFixed(0)}
                          </Text>
                          <Text style={styles.stat__unit}>minutes</Text>
                        </View>
                      </View>
                    )}
                    {/* CALORIES */}
                    {device.calories == 'NaN' ? (
                      <></>
                    ) : (
                      <View style={styles.stat__info}>
                        <Icon
                          name="local-fire-department"
                          style={[styles.stat__icon, styles.calories]}
                        />
                        <View style={styles.stat__number_container}>
                          <Text style={styles.stat__number}>
                            {parseFloat(device.calories).toFixed(0)}
                          </Text>
                          <Text style={styles.stat__unit}>kcal</Text>
                        </View>
                      </View>
                    )}
                    {/* DISTANCE */}
                    {device.distance == 'NaN' ? (
                      <></>
                    ) : (
                      <View style={styles.stat__info}>
                        <Icon
                          name="directions-walk"
                          style={[styles.stat__icon, styles.distance]}
                        />
                        <View style={styles.stat__number_container}>
                          <Text style={styles.stat__number}>
                            {parseInt(device.distance).toFixed(0)}
                          </Text>
                          <Text style={styles.stat__unit}>meters</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </Swipeable>
              </GestureHandlerRootView>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* ADD DEVICE */}
      {deviceInfoArray.length < 10 ? (
        <View style={styles.group__add_container}>
          {isRunning ? (
            <></>
          ) : (
            <View>
              {/* ADD DEVICE */}
              {isDone ? (
                <TouchableOpacity
                  onPress={navigateToQRCode}
                  style={styles.group__add_content}>
                  <Icon name="add" style={styles.groupp__add_icon} />
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          )}
        </View>
      ) : (
        <></>
      )}
      <FlatList
        data={allDevices}
        keyExtractor={item => `device_${item.id}`}
        // renderItem={renderDeviceModalListItem}
      />
      <GetClassesModel
        closeModal={hideGetClass}
        visible={isGetClassVisibal}
        sendClassId={handleClassId}
        sendClassName={handleClassName}
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
  delete__item_btn: {
    backgroundColor: '#F44336',
    borderRadius: res * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: res * 0.015,
    margin: res * 0.01,
  },
  delete__item: {
    color: '#FFF',
    fontSize: res * 0.04,
  },
  group__controller_container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  group__controller: {
    marginVertical: res * 0.03,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: res * 0.04,
  },
  group__control_running: {
    width: '100%',
    marginVertical: res * 0.03,
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
    gap: res * 0.02,
    backgroundColor: 'rgba(158,158,158,0.4)',
    paddingHorizontal: res * 0.02,
    paddingVertical: res * 0.015,
    borderRadius: res * 0.02,
  },
  group__control_btn_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // width: '100%',
  },
  group__finish_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  group__deviceCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: res * 0.05,
    marginVertical: res * 0.02,
  },
  group__classes_container: {
    backgroundColor: '#FFF',
    padding: res * 0.01,
    borderRadius: res * 0.01,
  },
  group__classes: {
    color: '#000',
    fontWeight: '600',
  },
  device__count: {
    fontWeight: '900',
    color: '#000',
  },
  group__control_btn: {
    width: res * 0.06,
    height: res * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: (res * 0.06) / 2,
  },
  group__clear: {
    backgroundColor: '#F44336',
  },
  group__refresh: {
    backgroundColor: '#4CAF50',
  },
  group__save: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  group__save_icon: {
    color: '#4CAF50',
  },
  group__refresh_icon: {
    color: '#FFF',
  },
  group__stop_btn: {
    width: res * 0.09,
    height: res * 0.09,
    borderRadius: (res * 0.09) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: res * 0.01,
  },
  group__stop_icon: {
    fontSize: res * 0.04,
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
  group__item_imagelist: {
    width: '30%',
    gap: 20,
  },
  group__item_imagelist_item: {
    width: '100%',
    height: res * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group__item_image_layer: {
    width: res * 0.12,
    height: res * 0.12,
    borderRadius: (res * 0.12) / 2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  group__item_information: {
    width: '65%',
    gap: 20,
  },
  group__item: {
    backgroundColor: '#FFF',
    borderRadius: res * 0.01,
    width: '100%',
    height: res * 0.2,
  },
  group__item_content: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: '#000',
    paddingHorizontal: res * 0.02,
    paddingVertical: res * 0.005,
    marginTop: res * 0.01,
  },
  group__item_stat: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    flexWrap: 'wrap',
    paddingHorizontal: res * 0.01,
  },
  group__item_notasnumber: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  out__of_range: {
    fontSize: res * 0.06,
    color: '#000',
  },
  out__of_range_text: {
    marginTop: res * 0.02,
    fontSize: res * 0.02,
    color: '#000',
    fontWeight: '600',
  },
  stat__info: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat__icon: {
    fontSize: res * 0.025,
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
    fontSize: res * 0.015,
  },
  group__add_container: {
    position: 'absolute',
    bottom: res * 0.04,
    right: 0,
    paddingHorizontal: res * 0.04,
    alignItems: 'flex-end',
    zIndex: 2,
    // backgroundColor: 'tomato',
  },
  group__add_content: {
    backgroundColor: '#15212D',
    width: res * 0.09,
    height: res * 0.09,
    borderRadius: (res * 0.09) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: res * 0.01,
  },
  groupp__add_icon: {
    color: '#FFF',
    fontSize: res * 0.04,
  },
});
