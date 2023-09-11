import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

const res = Dimensions.get('window').height;

//LOGO
import player from '../../assets/images/player.png';
// import field from '../../assets/images/field.png';
import ball from '../../assets/images/flying_ball.png';

const SplashScreen = ({navigation}) => {
  const playerMove = new Animated.Value(0);
  const ballMove = new Animated.Value(0);
  const fieldMove = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);

  useEffect(() => {
    //PLAYER
    Animated.timing(playerMove, {
      toValue: res * -0.09,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //BALL
    Animated.timing(ballMove, {
      toValue: res * 0.05,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //FIELD
    Animated.timing(fieldMove, {
      toValue: res * -0.05,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [logoOpacity, playerMove, ballMove, fieldMove]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Image
          source={player}
          style={[styles.player, {transform: [{translateX: playerMove}]}]}
        />

        <Animated.Image
          source={ball}
          style={[styles.ball, {transform: [{translateX: ballMove}]}]}
        />
        {/* <Animated.Image
          source={field}
          style={[styles.field, {transform: [{translateY: fieldMove}]}]}
        /> */}
        <Text style={styles.app__version}>version 1.0.6</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },

  content: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  app__version: {
    position: 'absolute',
    bottom: res * 0.01,
    right: res * 0.01,
    zIndex: 1,
    color: '#FFF',
  },
  logo: {
    width: 100,
    height: 50,
  },
  player: {
    position: 'absolute',
    // top: 70,
    right: -60,
    width: res * 0.27,
    height: res * 0.32,
    zIndex: 2,
  },
  ball: {
    position: 'absolute',
    // top: 240,
    left: -40,
    width: res * 0.16,
    height: res * 0.05,
    resizeMode: 'cover',
  },
  field: {
    position: 'absolute',
    bottom: 150,
    width: 200,
    height: 100,
    resizeMode: 'cover',
  },
});

export default SplashScreen;
