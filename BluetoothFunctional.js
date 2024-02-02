/* eslint-disable no-bitwise */
import {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {atob, btoa} from 'react-native-quick-base64';
import {useQRCodeContext} from './src/ReactContexts/QRcodeContext';

const IOT__UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__TX__CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__RX__CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const bleManager = new BleManager();

function BluetoothFunctional() {
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState('Device data');
  const [update, setUpdate] = useState(false);
  const {addScannedQRCode} = useQRCodeContext();

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

  const clearDevices = () => {
    setAllDevices([]);
    // console.log(allDevices);
  };

  const startScan = () => {
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
  //STOP SCAN
  const stopScan = () => {
    bleManager.stopDeviceScan();
    // setScanning(false);
    console.log('Stopped BLE scan.');
  };
  const stopDevice = () => {
    console.log('STOP SCANNING');
    bleManager.stopDeviceScan();
  };

  const connectToDevice = async device => {
    try {
      console.log('CONNECTING TO DEVICE:', device.id);
      await bleManager.connectToDevice(device.id);

      // Assuming you have a function to check if the device is connected
      const isConnected = await device.isConnected();

      if (isConnected) {
        setConnectedDevice(device);
        console.log('Connected to device:', device.id);

        // Stop device scan (assuming startScan and stopScan are functions in your component)
        stopScan();

        // Discover services and characteristics
        await device.discoverAllServicesAndCharacteristics();

        console.log('CONNECT SUCCESSFULLY');
        setTimeout(() => {
          startStreamingData(device);
          readDevice('read');
        }, 500);
      } else {
        console.warn('Connection to device failed.');
      }
    } catch (error) {
      console.error('Failed to connect to BLE device:', error);
      // Handle the error
    }
  };

  const readDevice = async data => {
    console.log('SENDING');
    // connectedDevice ? console.log('true') : console.log('false');
    if (connectedDevice && connectedDevice.isConnected()) {
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

  //CHECK BLUETOOTH STATE
  useEffect(() => {
    // Start scanning when the component mounts
    startScan();

    // Stop scanning when the component unmounts
    return () => {
      stopScan();
      // Clear up resources when the component unmounts
      bleManager.destroy();
    };
  }, [bleManager]);

  //CHECK BLUETOOTH STATE
  useEffect(() => {
    const handleBleStateChange = newState => {
      console.log('BLE state changed:', newState);

      if (newState === 'PoweredOn') {
        // Start scanning when Bluetooth is in the PoweredOn state
        startScan();
      } else {
        // Handle other states or show an error message
        console.warn('Bluetooth is not in a powered-on state.');
      }
    };

    const subscription = bleManager.onStateChange(handleBleStateChange, true);

    // Cleanup function
    return () => {
      subscription.remove();
    };
  }, [bleManager]);

  const disconnectFromDevice = () => {
    console.log('DISCONNECTED');
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setData('');
      console.log(data);
    }
  };

  // const onDataUpdate = (error, characteristic) => {
  //   console.log('UPDATING');
  //   if (error) {
  //     console.log(error);
  //     return;
  //   } else if (!characteristic?.value) {
  //     console.error('No Data was recieved');
  //     return;
  //   }

  //   const rawData = atob(characteristic.value);

  //   setData(rawData);
  // };

  // const startStreamingData = async device => {
  //   console.log('STREAMING');
  //   if (device) {
  //     device.monitorCharacteristicForService(
  //       IOT__UUID,
  //       IOT__TX__CHARACTERISTIC,
  //       onDataUpdate,
  //     );
  //   } else {
  //     console.log('No Device Connected');
  //   }
  // };

  const onDataUpdate = (error, characteristic) => {
    if (error) {
      console.error('Error updating data:', error);
      return;
    }

    if (!characteristic?.value) {
      console.warn('No data received from characteristic.');
      return;
    }

    const rawData = atob(characteristic.value);
    setData(rawData);

    // Assuming rawData is a string like '3544|5000|20|M|M|0.03|0|0.03|0.01|0.05|3.04|0.03|0.05|2.62|GSC-B7:8A:6A:08:77|78|M|M|M|M|M|'
    const dataValues = rawData.split('|');
    id = parseInt([dataValues[0]]);
    interval = parseInt([dataValues[1]]);
    time = parseInt(Math.round((id * (interval / 1000)) / 60)).toFixed(2);
    steps = parseInt([dataValues[2]]).toFixed(2);
    flex = parseFloat([dataValues[5]]).toFixed(2);
    speed_average = parseFloat([dataValues[9]] * 3.6).toFixed(2);
    speed_max = parseFloat(([dataValues[10]] * 3.6).toFixed(2));
    calories = parseFloat(Math.round(steps * 0.03)).toFixed(2);
    distance = parseFloat(Math.floor(steps * 0.2)).toFixed(2);
    jump = parseInt([dataValues[6]]).toFixed(2);
    qrvalue = dataValues[14].substring(4);

    // Assuming you have access to addScannedQRCode function from your context
    addScannedQRCode(
      qrvalue,
      steps,
      time,
      calories,
      flex,
      distance,
      jump,
      speed_average,
      speed_max,
    ); // Assuming QR code is at index 14
  };

  // Assuming this is part of the BluetoothFunctional module
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

  const totalDevices = allDevices.length;
  return {
    startScan,
    stopDevice,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
    readDevice,
    clearDevices,
    totalDevices,
  };
}

export default BluetoothFunctional;
