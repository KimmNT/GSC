import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import {useDeviceInfo} from './DeviceInfoContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const res = Dimensions.get('window').height;

function CameraScreen({navigation, route}) {
  const {qrcode, classIdChose} = route.params;
  const cameraRef = useRef(null);
  // const [capturedImage, setCapturedImage] = useState(null);
  const [studentId, setStudentId] = useState(0);
  const [deviceInfor, setDeviceInfor] = useState({
    qrcode: route.params.qrcode,
    classId: route.params.classIdChose,
    studentId: 0,
    avatar: '',
    steps: 0,
    time: 0,
    distance: 0,
    calories: 0,
    speed_avg: 0,
    speed_max: 0,
    flex: 0,
    rank: 0,
  });

  const {addDeviceInfo} = useDeviceInfo();

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);

      // Set the captured image URI to display it
      setCapturedImage(data.uri);

      //Update the deviceInfo state
      setDeviceInfor(prevData => ({
        ...prevData,
        capturedImage: data.uri,
      }));
    }
  };
  const navigateToGroup = () => {
    addDeviceInfo(deviceInfor);
    navigation.navigate('GroupDevice', {capturedImage});
  };

  return (
    <TouchableOpacity
      onPress={navigateToGroup}
      style={[
        styles.controller__btn,
        styles.controller__btn_navigate,
        styles.shadow,
      ]}>
      <Icon
        name="done"
        style={[styles.controll__icon, styles.controll__icon_navigate]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  take__circle_container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.3,
  },
  take__circle: {
    position: 'absolute',
    width: res * 0.4,
    height: res * 0.4,
    borderRadius: (res * 0.4) / 2,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#4CEF50',
  },
  take__btn: {
    position: 'absolute',
    bottom: res * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    width: res * 0.1,
    height: res * 0.1,
    borderRadius: (res * 0.1) / 2,
    backgroundColor: '#FFF',
  },
  take__btn_inside: {
    width: res * 0.08,
    height: res * 0.08,
    borderRadius: (res * 0.08) / 2,
    backgroundColor: '#FFF',
    borderWidth: 5,
    borderColor: '#4CAF50',
  },
  controller: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: res * 0.08,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: res * 0.1,
  },
  controller__btn: {
    width: res * 0.1,
    height: res * 0.1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: (res * 0.1) / 2,
  },
  controller__btn_retake: {
    backgroundColor: '#FFF',
  },
  controller__btn_navigate: {
    backgroundColor: '#4CAF50',
  },
  controll__icon: {
    fontSize: res * 0.05,
  },
  controll__icon_retake: {
    color: '#4CAF50',
  },
  controll__icon_navigate: {
    color: '#FFF',
  },
});

export default CameraScreen;
