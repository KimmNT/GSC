import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';

const res = Dimensions.get('window').height;

export default function ScanArea() {
  return (
    <View style={styles.area__container}>
      <View style={[styles.corner, styles.top__left]}></View>
      <View style={[styles.corner, styles.top__right]}></View>
      <View style={[styles.corner, styles.bottom__right]}></View>
      <View style={[styles.corner, styles.bottom__left]}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  area__container: {
    position: 'relative',
    width: res * 0.35,
    height: res * 0.35,
  },
  corner: {
    position: 'absolute',
    width: res * 0.04,
    height: res * 0.04,
  },
  top__left: {
    top: 0,
    left: 0,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#E79C25',
  },
  top__right: {
    top: 0,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: '#E79C25',
  },
  bottom__right: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: '#E79C25',
  },
  bottom__left: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#E79C25',
  },
});
