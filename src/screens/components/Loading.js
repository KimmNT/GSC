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
    // height: res * 0.02,
    alignItems: 'center',
  },
  loading__text: {
    textAlign: 'center',
  },
  loading__box: {
    width: '50%',
    height: 10,
    backgroundColor: 'tomato',
    position: 'relative',
    overflow: 'hidden',
  },
  box: {
    height: '100%',
    width: 0,
    backgroundColor: '#FFF',
  },
});
