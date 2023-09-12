import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';

//IMAGE
import LoadImg from '../../../assets/images/loading.png';

const res = Dimensions.get('window').height;

export default function Loading() {
  //ROTATE ANIMATION
  const loadRotate = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(loadRotate, {
      toValue: res * 0.16,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [loadRotate]);
  return (
    <View style={styles.loading__container}>
      <Text style={styles.loading__text}>Loading...</Text>
      <View style={styles.loading__box}>
        <Animated.View
          style={[styles.box, {width: loadRotate}]}></Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading__container: {
    width: '100%',
    // height: '100%',
    // backgroundColor: '#000',
    overflow: 'hidden',
    alignItems: 'center',
    gap: 10,
  },
  loading__text: {
    textAlign: 'center',
    color: '#FFF',
  },
  loading__box: {
    width: '80%',
    height: res * 0.005,
    backgroundColor: '#0E3411',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10,
  },
  box: {
    height: '100%',
    width: 0,
    backgroundColor: '#81C784',
    borderRadius: 10,
  },
});
