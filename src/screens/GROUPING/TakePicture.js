import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useDeviceInfo} from './DeviceInfoContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const res = Dimensions.get('window').height;

function CameraScreen({navigation, route}) {
  const {qrcode} = route.params;
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [deviceInfor, setDeviceInfor] = useState({
    qrcode: route.params.qrcode,
    capturedImage: null,
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
  const retakePicture = () => {
    setCapturedImage(null);
  };
  console.log(deviceInfor);
  const navigateToGroup = () => {
    addDeviceInfo(deviceInfor);
    navigation.navigate('GroupDevice');
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {capturedImage ? (
        <View style={{flex: 1, width: '100%', position: 'relative'}}>
          <Image
            source={{uri: capturedImage}}
            style={{flex: 1, width: '100%'}}
          />
          <View style={styles.controller}>
            <TouchableOpacity
              onPress={retakePicture}
              style={[
                styles.controller__btn,
                styles.controller__btn_retake,
                styles.shadow,
              ]}>
              <Icon
                name="autorenew"
                style={[styles.controll__icon, styles.controll__icon_retake]}
              />
            </TouchableOpacity>
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
          </View>
        </View>
      ) : (
        <RNCamera
          ref={cameraRef}
          style={{flex: 1, width: '100%'}}
          type={RNCamera.Constants.Type.back}
        />
      )}
      {!capturedImage && (
        <TouchableOpacity onPress={takePicture} style={styles.take__btn}>
          <View style={styles.take__btn_inside}></View>
        </TouchableOpacity>
      )}
    </View>
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
