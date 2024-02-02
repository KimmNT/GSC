import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function WeirdCom() {
  let originalString = 'tuan cui di choi vao cuoi tuan';
  let words = originalString.split(' ');
  let newString = words.slice(-2).join(' ');
  console.log(newString);

  return (
    <View>
      <Text>WeirdCom</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
