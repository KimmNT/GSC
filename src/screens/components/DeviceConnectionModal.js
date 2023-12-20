import React, {useCallback, useState, useEffect} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ScanArea from './ScanArea';
// import {BleManager} from 'react-native-ble-plx' --- FOR CONNECT MANUALLY;
import Icon from 'react-native-vector-icons/MaterialIcons';

const res = Dimensions.get('window').height;

const DeviceModal = props => {
  const {
    devices,
    visible,
    connectToPeripheral,
    closeModal,
    scanning,
    clearDevice,
    stopScan,
  } = props;

  const [qrcode, setQRCode] = useState('');
  const [showMismatchAlert, setShowMismatchAlert] = useState(false);
  const [scanned, setScanned] = useState(false);
  // const [manager, setManager] = useState(new BleManager());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQRCode('');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [qrcode]);

  const handleQRCodeScanned = useCallback(
    async ({data}) => {
      setQRCode(data);
      setScanned(true);
      await connectToBLEDevice(
        data,
        devices,
        connectToPeripheral,
        closeModal,
        setShowMismatchAlert,
      );
      // console.log(data);
    },
    [devices, connectToPeripheral, closeModal, setShowMismatchAlert],
  );

  const handleAlertDismiss = useCallback(() => {
    setShowMismatchAlert(false);
    setScanned(false);
    setQRCode('');
    clearDevice();
    scanning();
  }, [clearDevice]);

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <SafeAreaView>
        <QRCodeScanner
          onRead={handleQRCodeScanned}
          reactivate={true}
          reactivateTimeout={2000}
          fadeIn={true}
          showMarker={true}
          customMarker={
            <View style={styles.camera__scan}>
              <ScanArea />
            </View>
          }
          cameraStyle={{
            height: 800,
          }}
        />
        <FlatList
          data={devices}
          keyExtractor={item => `device_${item.id}`}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => connectToPeripheral(item)}>
              {/* <Text>{`Name: ${item.name || 'N/A'}`}</Text> */}
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
      {showMismatchAlert && scanned && (
        <View style={styles.modal__alert}>
          <Text style={styles.modal__alert_text}>Device Is Not Available!</Text>
          <TouchableOpacity
            style={styles.modal__alert_btn}
            onPress={handleAlertDismiss}>
            <Icon name="sync" style={styles.modal__alert_btn_icon} />
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

const connectToBLEDevice = async (
  qrCode,
  devices,
  connectToPeripheral,
  closeModal,
  setShowMismatchAlert,
) => {
  const cutQR = qrCode.substring(3);
  console.log(cutQR);

  const matchingDevice = devices.find(item => {
    const nameSplit = item.name.split('-');
    const idName = [nameSplit[1]].toString();

    if (Platform.OS === 'android' && item.id === qrCode) {
      console.log('MATCH IN ANDROID!');
      return true;
    } else if (Platform.OS === 'ios' && idName === cutQR) {
      console.log('MATCH IN IOS');
      return true;
    }

    return false;
  });

  if (matchingDevice) {
    try {
      // Replace this with the appropriate method based on your BLE library
      // For example: await manager.connectToDevice(matchingDevice.id);
      // console.log('Connected to device:' item.item.name);
      await connectToPeripheral(matchingDevice);
      closeModal();
    } catch (error) {
      console.error('Error connecting to BLE device:', error);
      setShowMismatchAlert(true);
    }
  } else {
    setShowMismatchAlert(true);
  }
};
const styles = StyleSheet.create({
  modal__alert: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(33,33,33,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: res * 0.05,
  },
  modal__alert_text: {
    fontSize: res * 0.035,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modal__alert_btn: {
    backgroundColor: '#4CAF50',
    width: res * 0.09,
    height: res * 0.09,
    borderRadius: (res * 0.09) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal__alert_btn_icon: {
    color: '#FFF',
    fontSize: res * 0.04,
  },
});

export default DeviceModal;
