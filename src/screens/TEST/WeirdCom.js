import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import useBLE from '../../../useBLE';

const BLEComponent = () => {
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

  useEffect(() => {
    // Request location permissions on Android
    requestPermissions(granted => {
      if (granted) {
        console.log('Location permission granted. Scanning enabled.');
      } else {
        console.log('Location permission denied. Scanning may not work.');
      }
    });

    // Start scanning for devices when the component mounts
    startScan();

    // Stop scanning when the component unmounts
    return () => {
      stopDevice();
    };
  }, []);

  const handleConnectDevice = async device => {
    try {
      await connectToDevice(device);
      console.log('Connected to device:', device.name || device.id);
    } catch (error) {
      console.error('Failed to connect to device:', error);
    }
  };

  const handleDisconnectDevice = () => {
    disconnectFromDevice();
    console.log('Disconnected from the device.');
  };

  const getLatest = () => {
    sendDataToRXCharacteristic('read');
  };
  const clearData = () => {
    sendDataToRXCharacteristic('delete');
  };

  return (
    <View style={styles.container}>
      <Text>Devices Total: {totalDevices}</Text>
      <FlatList
        style={styles.list}
        data={allDevices}
        keyExtractor={item => `device_${item.id}`}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleConnectDevice(item)}>
            <Text style={styles.text}>
              {`Name: ${item.name || 'N/A'}, ID: ${item.id}`}
            </Text>
          </TouchableOpacity>
        )}
      />
      {connectedDevice ? (
        <View>
          <Text>
            Connected to: {connectedDevice.name || connectedDevice.id}
          </Text>
          <Text>{data}</Text>
          <View style={styles.buttons}>
            <Button title="Disconnect" onPress={handleDisconnectDevice} />
            <Button title="Latest" onPress={getLatest} />
            <Button title="Clear" onPress={clearData} />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  list: {
    marginTop: 20,
  },
  item: {
    backgroundColor: 'maroon',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    color: '#FFF',
  },
  buttons: {
    flexDirection: 'row',
  },
});

export default BLEComponent;
