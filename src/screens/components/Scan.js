import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import ScanArea from './ScanArea';
import BackArrow from './BackArrow';

export default function Scan({navigation}) {
  const [qrcode, setQRCode] = useState('');
  const record_data_idx = 0;

  // const handleScanning = () => {
  //   if (qrcode === '') {
  //     Alert.alert('Missing some thing!', "You haven't scan the QR code!");
  //   } else {
  //     const get_record_info_cmd =
  //       'rec get -d ' + qrcode + ' ' + record_data_idx;
  //     // console.log(get_record_info_cmd);
  //     const dataResponse =
  //       '$PNCSG,RCDD-G0001-15|4509|10.80043,106.74493|3|50,255|5,7,10|255,255,255*cs';
  //     navigation.navigate('Stats', {dataResponse});
  //   }
  // };

  const deviceArray = ['G0002', 'G0004', 'G0003', 'G0007', 'G0001'];
  const sameValue = deviceArray.includes(qrcode);
  if (sameValue) {
    const dataResponse =
      '$PNCSG,RCDD-G0001-15|4509|10.80043,106.74493|3|50,255|5,7,10|255,255,255*cs';
    navigation.navigate('Stats', {dataResponse});
  }

  return (
    <QRCodeScanner
      onRead={({data}) => setQRCode(data)}
      reactivate={true}
      reactivateTimeout={2000}
      fadeIn={true}
      showMarker={true}
      customMarker={
        <View style={styles.camera__scan}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrow />
          </TouchableOpacity>
          <ScanArea />
        </View>
      }
      cameraStyle={{
        position: 'relative',
        height: '100%',
      }}
    />
  );
}

const styles = StyleSheet.create({
  camera__scan: {
    gap: 50,
  },
  desc: {
    paddingTop: 10,
    height: '100%',
    width: '100%',
    gap: 30,
    alignItems: 'center',
    backgroundColor: '#15212D',
  },
  desc__text: {
    color: '#FFF',
  },
  highlight: {
    fontSize: 20,
    fontWeight: 600,
  },
  connect__status: {
    alignItems: 'center',
    marginTop: 5,
  },
  succes__container: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  success: {
    color: '#388E3C',
  },
  fail: {
    color: '#E53935',
  },
  fail__wait: {
    color: '#E53935',
    fontWeight: 600,
  },
  desc__btn_success: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  desc__btn_text: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 20,
  },
});
