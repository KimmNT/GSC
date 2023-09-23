import React, {useCallback, useState, useEffect} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ScanArea from './ScanArea';
const res = Dimensions.get('window').height;

const DeviceModal = props => {
  const {
    devices,
    visible,
    connectToPeripheral,
    closeModal,
    scanning,
    clearDevice,
  } = props;
  const [qrcode, setQRCode] = useState('');
  const [showMismatchAlert, setShowMismatchAlert] = useState(false);
  const [scanned, setScanned] = useState(false); // Add a state variable to track if QR code is scanned

  // console.log('REPEAT MODAL');
  //Change QR to empty string -> Open camera
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQRCode('');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [qrcode]);

  console.log(qrcode);

  //Convert QR code
  const cutQR = qrcode.substring(3);

  const renderDeviceModalListItem = useCallback(
    item => {
      const nameSplit = item.item.name.split('-');
      const idName = [nameSplit[1]].toString();
      // console.log(item.item.name);
      // console.log(`id: ${idName}`);
      //Scan for Android
      if (Platform.OS === 'android') {
        if (scanned && item.item.id === qrcode) {
          // Check if QR code is scanned and ID matches
          connectToPeripheral(item.item);
          closeModal();
        } else if (scanned) {
          // If QR code is scanned but ID doesn't match, show alert
          setShowMismatchAlert(true);
        }
        //Scan for iOS
      } else if (Platform.OS === 'ios') {
        if (scanned && idName === cutQR) {
          // Check if QR code is scanned and ID matches
          connectToPeripheral(item.item);
          closeModal();
        } else if (scanned) {
          // If QR code is scanned but ID doesn't match, show alert
          setShowMismatchAlert(true);
        }
      }
    },
    [closeModal, connectToPeripheral, qrcode, scanned],
  );

  const handleQRCodeScanned = useCallback(({data}) => {
    setQRCode(data);
    setScanned(true); // Set the flag to indicate QR code is scanned
  }, []);

  const handleAlertDismiss = useCallback(() => {
    setShowMismatchAlert(false);
    setScanned(false); // Reset the scanned flag
    setQRCode(''); // Reset the QR code value
    clearDevice();
    scanning();
  }, []);
  return (
    <Modal
      style={styles.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}>
      <SafeAreaView style={styles.modalTitle}>
        <QRCodeScanner
          onRead={handleQRCodeScanned}
          // onRead={setQRCode}
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
          contentContainerStyle={styles.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
      </SafeAreaView>
      {/* Alert */}
      {showMismatchAlert && scanned && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>Device Is Not Available!</Text>
          <TouchableOpacity
            style={styles.dismiss__container}
            onPress={handleAlertDismiss}>
            <Text style={styles.dismissText}>scan again</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#15212D',
  },

  // Alert styles
  alertContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: '#FFF',
    fontSize: res * 0.03,
    marginBottom: res * 0.05,
  },
  dismiss__container: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: res * 0.04,
    paddingVertical: res * 0.02,
    borderRadius: 5,
  },
  dismissText: {
    color: '#FFF',
    fontSize: res * 0.02,
    textTransform: 'uppercase',
  },
});

export default DeviceModal;
