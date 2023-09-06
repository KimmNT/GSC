import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
//IMAGE
import BackGround from '../../../assets/images/background.png';
import SuccessImage from '../../../assets/images/success.png';

export default function Success({navigation}) {
  return (
    <View style={styles.container}>
      <Image source={BackGround} style={styles.background} />

      <SafeAreaView>
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.header__text}>Successful</Text>
          </View>

          {/* CONTENT */}
          <View style={styles.success__container}>
            <View style={styles.image__container}>
              <Image source={SuccessImage} style={styles.image} />
            </View>
            <Text style={styles.success__text}>
              Data has been saved successfully
            </Text>
            {/* BUTTON */}
            <TouchableOpacity
              style={styles.submit__btn}
              onPress={() => navigation.popToTop()}>
              <Text style={styles.submit__btn_text}>back to home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  background: {
    position: 'absolute',
    zIndex: -1,
  },
  content: {
    padding: 20,
    // backgroundColor: 'teal',
  },
  header: {
    marginTop: 10,
    alignItems: 'center',
  },
  header__text: {
    fontSize: 30,
    fontWeight: 900,
    color: '#FFF',
  },
  success__container: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 50,
    gap: 30,
  },
  image__container: {
    alignItems: 'center',
  },
  success__text: {
    color: '#242526',
    fontWeight: 600,
    textAlign: 'center',
    fontSize: 20,
  },
  submit__btn: {
    alignItems: 'center',
    marginTop: 50,
  },
  submit__btn_text: {
    backgroundColor: '#E79C25',
    textAlign: 'center',
    width: '80%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 17,
    borderRadius: 5,
  },
});
