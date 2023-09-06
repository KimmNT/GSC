import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function BackArrow() {
  return (
    <View style={styles.back__container}>
      <Icon name="chevron-left" style={styles.back__icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  back__container: {
    backgroundColor: '#E79C25',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  back__icon: {
    fontSize: 30,
    color: '#FFF',
  },
});
