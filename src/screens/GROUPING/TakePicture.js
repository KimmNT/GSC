import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, Image, Button} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useDeviceInfo} from './DeviceInfoContext';

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
        <View style={{flex: 1, width: '100%'}}>
          <Image
            source={{uri: capturedImage}}
            style={{flex: 1, width: '100%'}}
          />
          <Button title="Retake" onPress={retakePicture} />
          {/* <Button title="Merch them!" onPress={merchInfo} /> */}
          <Button title="Move" onPress={navigateToGroup} />
        </View>
      ) : (
        <RNCamera
          ref={cameraRef}
          style={{flex: 1, width: '100%'}}
          type={RNCamera.Constants.Type.back}
        />
      )}
      {!capturedImage && (
        <TouchableOpacity
          onPress={takePicture}
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 50,
          }}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 50,
              borderColor: 'blue',
              padding: 20,
            }}></View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default CameraScreen;
