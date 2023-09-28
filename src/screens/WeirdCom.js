import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDeviceInfo} from './GROUPING/DeviceInfoContext';

export default function WeirdCom() {
  const {deviceInfoArray} = useDeviceInfo();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {deviceInfoArray.map((item, index) => (
        <View key={index}>
          <Text style={{color: '#FFF'}}>{item.qrcode}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
