import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';

const res = Dimensions.get('window').height;

//IMAGE
import welcomeBG from '../../assets/images/welcome_bg.png';
import Logo from '../../assets/images/logo.png';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen({navigation}) {
  const time = new Date();
  const h = time.getHours();
  const m = time.getMinutes();
  let dayPeriod = '';
  if (h > 24 || h < 12) {
    dayPeriod = 'AM';
  } else dayPeriod = 'PM';
  let minute = '';
  if (m < 10) {
    minute = '0' + m;
  } else minute = m;

  const currentTime = h + ':' + minute;

  return (
    <View style={styles.container}>
      <Image source={welcomeBG} style={styles.welcome__bg} />
      <View style={styles.content}>
        <View style={styles.welcome__container}>
          <Animated.View style={[styles.welcome__time]}>
            <Text style={[styles.time, styles.highlight]}>{currentTime}</Text>
            <Text style={styles.time}>{dayPeriod}</Text>
          </Animated.View>
          <View style={styles.welcome__logo}>
            <Image source={Logo} style={styles.logo__image} />
            <Text style={styles.logo__name}>smart coach</Text>
          </View>
          <View style={styles.welcome__scan}>
            <Text style={styles.scan__text}>Scan your device</Text>
            <TouchableOpacity
              style={styles.scan__box}
              onPress={() => navigation.navigate('Scan')}>
              <Icon name="chevron-right" style={styles.scan__icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  content: {
    padding: height * 0.02,
  },
  welcome__bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    // resizeMode: 'cover',
  },
  welcome__container: {
    position: 'relative',
    padding: 20,
    // backgroundColor: 'red',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome__time: {
    position: 'absolute',
    top: 30,
    left: 0,
    backgroundColor: '#E79C25',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  time: {
    fontSize: 15,
    color: '#FFF',
  },
  highlight: {
    fontWeight: 700,
    fontSize: 20,
  },
  welcome__logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo__image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  logo__name: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 30,
    color: '#FFF',
  },
  welcome__scan: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scan__text: {
    fontSize: 20,
    color: '#FFF',
  },
  scan__box: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#E79C25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scan__icon: {
    fontSize: 30,
  },
});
