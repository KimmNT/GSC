/* eslint-disable no-bitwise */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import {atob, btoa} from 'react-native-quick-base64';
import {useDeviceInfo} from './src/ReactContexts/DeviceInfoContext';

const IOT__UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__TX__CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__RX__CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState('Device data');
  const {deviceInfoArray} = useDeviceInfo();

  const requestPermissions = async cb => {
    if (Platform.OS === 'android') {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Smart Coach Needs Location Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
          buttonNeutral: 'Maybe later',
        },
      );
      cb(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      cb(true);
    }
  };

  const isDuplicateDevice = (devices, nextDevice) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForDevices = () => {
    console.log('SCANNING');
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Yo, error: ', error);
      }
      if (device && device.name?.includes('GSC-')) {
        setAllDevices(prevState => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };
  const clearDevices = () => {
    setAllDevices([]);
    console.log(allDevices);
  };
  const stopDevice = () => {
    console.log('STOP SCANNING');
    bleManager.stopDeviceScan();
  };
  const connectToDevice = async device => {
    console.log('CONNECTING');
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      bleManager.stopDeviceScan();
      await deviceConnection.discoverAllServicesAndCharacteristics();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    console.log('DISCONNECTED');
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setData('');
      console.log(data);
    }
  };

  const onDataUpdate = (error, characteristic) => {
    console.log('UPDATING');
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.error('No Data was recieved');
      return;
    }

    const rawData = atob(characteristic.value);

    setData(rawData);
  };

  const startStreamingData = async device => {
    console.log('STREAMING');
    if (device) {
      device.monitorCharacteristicForService(
        IOT__UUID,
        IOT__TX__CHARACTERISTIC,
        onDataUpdate,
      );
    } else {
      console.log('No Device Connected');
    }
  };
  const sendDataToRXCharacteristic = async data => {
    console.log('SENDING');
    if (connectedDevice) {
      try {
        const serviceUUID = IOT__UUID;
        const characteristicUUID = IOT__RX__CHARACTERISTIC;
        const valueBase64 = btoa(data); // Encode the data as Base64

        await connectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          characteristicUUID,
          valueBase64,
          null, // TransactionId (optional)
        );

        console.log('Data sent to RX characteristic:', data);
      } catch (error) {
        console.log('Failed to send data to RX characteristic:', error);
      }
    } else {
      console.log('No device connected. Cannot send data.');
    }
  };

  return {
    scanForDevices,
    // scanForPeripherals,
    stopDevice,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
    sendDataToRXCharacteristic,
    clearDevices,
  };
}

export default useBLE;
