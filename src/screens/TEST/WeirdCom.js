import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useDeviceInfo} from '../../ReactContexts/DeviceInfoContext';
import {useStudentInfo} from '../../ReactContexts/StudentInfoContext';
import axios from 'axios';

export default function WeirdCom({navigation}) {
  const {deviceInfoArray, clearDeviceInfoArray, addDeviceInfo} =
    useDeviceInfo();
  const {studentInfoArray, clearStudentInfoArray, addStudentInfo} =
    useStudentInfo();
  const qrcodeMap = {};
  for (const item of deviceInfoArray) {
    qrcodeMap[item.qrcode] = item;
  }
  const merchArray = studentInfoArray.map(item1 => ({
    ...item1,
    ...qrcodeMap[item1.qrcode],
  }));

  const url = 'http://api-gibbon-genio.dev.ncs.int/api/postStudentHealthForIoT';
  const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';

  const handlePushToServer = () => {
    merchArray.forEach((item, index) => {
      setTimeout(async () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const data = {
          gibbonStudentID: item.stuId,
          gibbonClassID: item.classId,
          time: item.time,
          step: item.steps,
          calories: item.calories,
          flexibitity: item.flex,
          distance: item.distance,
          jump: item.jump,
          speed_average: item.speed__avg,
          speed_max: item.speed__max,
          date: formattedDate,
        };
        console.log(data);
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        };
        const res = await axios.post(url, data, {headers});
        console.log(res.data);
      }, index * 4000);
    });
  };

  return (
    <View>
      <ScrollView></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
