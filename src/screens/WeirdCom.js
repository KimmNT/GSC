import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import axios from 'axios';

export default function WeirdCom() {
  const handleSave = async () => {
    const url =
      'http://api-gibbon-genio.dev.ncs.int/api/postStudentHealthForIoT';
    const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';
    const data = {
      gibbonStudentID: 45,
      gibbonClassID: 141,
      time: 15,
      step: 3,
      calories: 5,
      flexibitity: 3,
      distance: 3,
      jump: 23,
      speed_average: 3.2,
      speed_max: 7.8,
      date: '2023-20-10',
    };
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    const res = await axios.post(url, data, {headers});
    console.log(res.data);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="SAVE" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({});
