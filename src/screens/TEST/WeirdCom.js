import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {BleManager} from 'react-native-ble-plx';
import useBLE from '../../../useBLE';
import Icon from 'react-native-vector-icons/MaterialIcons';

const res = Dimensions.get('window').height;
const bleManager = new BleManager();

export default function WeirdCom() {
  const {
    startScan,
    stopDevice,
    stopScan,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
    sendDataToRXCharacteristic,
    clearDevices,
    totalDevices,
  } = useBLE();

  startScan();

  const deviceId = data.substring(0, 6);
  // const deviceTemp = parseInt(data.substring(7, 9));
  const deviceTemp = 37;
  const deviceHearRate = 97;
  const deviceSPO = 91;
  // const deviceBattery = data.substring(17, 21);
  const deviceBattery = 10;

  return (
    <View style={styles.container}>
      {connectedDevice ? (
        <>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.header__id}>
                <Text style={styles.header__id_text}>{deviceId}</Text>
              </View>
              <View style={styles.header__bat}>
                {/* <Text style={styles.header__bat_text}>{deviceBattery}%</Text> */}
                {deviceBattery > 50 ? (
                  <>
                    <Icon
                      name="battery-full"
                      style={[styles.header__bat_text, styles.full]}
                    />
                    <Text style={[styles.header__bat_text, styles.full]}>
                      {deviceBattery}%
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name="battery-1-bar"
                      style={[styles.header__bat_text, styles.low]}
                    />
                    <Text style={[styles.header__bat_text, styles.low]}>
                      {deviceBattery}%
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.unable__container}>
              {deviceHearRate === 0 ? (
                <Text style={styles.unable}>
                  Unable to connect to the device
                </Text>
              ) : (
                <></>
              )}
            </View>
            <View style={[styles.stat__container, styles.width]}>
              {deviceHearRate > 99 ? (
                <View style={[styles.stat__heart_box, styles.warning]}>
                  <View style={styles.stat__heart_healine}>
                    <Icon
                      name="monitor-heart"
                      style={styles.stat__heart_icon}
                    />
                    <Text style={styles.stat__heart_text}>Heart Rate</Text>
                  </View>
                  <View style={styles.stat__heart_info}>
                    <Text style={styles.stat__heart_num}>{deviceHearRate}</Text>
                    <Text style={styles.stat__heart_unit}>bpm</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.stat__heart_box}>
                  <View style={styles.stat__heart_healine}>
                    <Icon
                      name="monitor-heart"
                      style={styles.stat__heart_icon}
                    />
                    <Text style={styles.stat__heart_text}>Heart Rate</Text>
                  </View>
                  <View style={styles.stat__heart_info}>
                    <Text style={styles.stat__heart_num}>{deviceHearRate}</Text>
                    <Text style={styles.stat__heart_unit}>bpm</Text>
                  </View>
                </View>
              )}
            </View>
            <View style={[styles.stat__container, styles.divide]}>
              <View style={styles.stat__divide_box}>
                <View style={styles.stat__divide_headline}>
                  <Icon
                    style={[styles.stat__divide_icon, styles.blood]}
                    name="bloodtype"
                  />
                  <Text style={styles.stat__divide_name}>Sp02</Text>
                </View>
                <View style={styles.stat__divide_info}>
                  <Text style={styles.stat__divide_num}>{deviceSPO}</Text>
                  <Text style={styles.stat__divide_unit}>%</Text>
                </View>
              </View>
              {deviceTemp > 38 ? (
                <View style={[styles.stat__divide_box, styles.warning]}>
                  <View style={styles.stat__divide_headline}>
                    <Icon
                      style={[styles.stat__divide_icon, styles.temp]}
                      name="device-thermostat"
                    />
                    <Text style={[styles.stat__divide_name]}>Body Temp</Text>
                  </View>
                  <View style={styles.stat__divide_info}>
                    <Text style={styles.stat__divide_num}>{deviceTemp}</Text>
                    <Text style={styles.stat__divide_unit}>Celcius</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.stat__divide_box]}>
                  <View style={styles.stat__divide_headline}>
                    <Icon
                      style={[styles.stat__divide_icon, styles.temp]}
                      name="device-thermostat"
                    />
                    <Text style={[styles.stat__divide_name]}>Body Temp</Text>
                  </View>
                  <View style={styles.stat__divide_info}>
                    <Text style={styles.stat__divide_num}>{deviceTemp}</Text>
                    <Text style={styles.stat__divide_unit}>Celcius</Text>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.measure}>
              <Text style={styles.measure__text}>measuring 5s ago</Text>
            </View>
            <TouchableOpacity
              onPress={() => disconnectFromDevice()}
              style={styles.disconnect__container}>
              <Text style={styles.disconnect__text}>disconnect</Text>
              <View style={styles.disconnect__btn_icon}>
                <Icon style={styles.disconnect__icon} name="chevron-right" />
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.list__item}>
          {allDevices.map(item => (
            <TouchableOpacity
              style={styles.item}
              key={item.id}
              onPress={() => connectToDevice(item)}>
              <Text style={styles.item__text}>{item.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  unable__container: {
    paddingVertical: res * 0.02,
    marginTop: res * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  unable: {
    fontSize: res * 0.025,
    fontWeight: '600',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: res * 0.05,
    paddingHorizontal: res * 0.04,
    marginTop: res * 0.02,
    borderBottomLeftRadius: res * 0.03,
    borderBottomRightRadius: res * 0.03,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  header__id: {},
  header__id_text: {
    color: '#374259',
    fontWeight: '900',
    fontSize: res * 0.03,
  },
  header__bat: {
    flexDirection: 'row',
  },
  header__bat_text: {
    fontWeight: '900',
    fontSize: res * 0.03,
  },
  full: {
    color: '#337357',
  },
  low: {
    color: '#FF9800',
  },
  stat__container: {
    paddingHorizontal: res * 0.07,
    marginTop: res * 0.04,
  },
  width: {
    width: '100%',
  },
  divide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat__heart_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374259',
    padding: res * 0.02,
    borderRadius: res * 0.02,
  },
  warning: {
    backgroundColor: '#EE4266',
  },
  stat__heart_healine: {
    gap: res * 0.01,
  },
  stat__heart_icon: {
    fontSize: res * 0.1,
    color: '#41B06E',
  },
  stat__heart_text: {
    fontSize: res * 0.025,
    fontWeight: '900',
    color: '#FFF',
  },
  stat__heart_info: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: res * 0.01,
  },
  stat__heart_num: {
    fontSize: res * 0.05,
    color: '#FFF',
    fontWeight: '900',
  },
  stat__heart_unit: {
    fontSize: res * 0.02,
    color: '#FFF',
  },
  stat__divide_box: {
    width: '45%',
    backgroundColor: '#374259',
    paddingVertical: res * 0.02,
    paddingHorizontal: res * 0.01,
    borderRadius: res * 0.02,
    gap: res * 0.02,
  },
  stat__divide_headline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: res * 0.08,
  },
  stat__divide_icon: {
    fontSize: res * 0.05,
    width: '40%',
  },
  blood: {
    color: '#5DEBD7',
  },
  temp: {
    color: '#FA7070',
  },
  stat__divide_name: {
    fontSize: res * 0.03,
    width: '50%',
    fontWeight: '900',
    color: '#FFF',
  },
  stat__divide_info: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: res * 0.01,
  },
  stat__divide_num: {
    fontSize: res * 0.05,
    color: '#FFF',
    fontWeight: '900',
  },
  stat__divide_unit: {
    fontSize: res * 0.03,
    color: '#FFF',
  },
  measure: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: res * 0.05,
  },
  measure__text: {
    fontSize: res * 0.02,
    fontWeight: '900',
    color: '#5C8984',
    fontStyle: 'italic',
  },
  disconnect__container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: res * 0.02,
    width: '100%',
    position: 'absolute',
    bottom: res * 0.02,
    right: res * 0.04,
  },
  disconnect__text: {
    textTransform: 'uppercase',
    fontSize: res * 0.02,
    fontWeight: '900',
    color: '#D37676',
  },
  disconnect__btn_icon: {
    width: res * 0.07,
    height: res * 0.07,
    borderRadius: (res * 0.07) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D37676',
  },
  disconnect__icon: {
    fontSize: res * 0.04,
    fontWeight: '900',
    color: '#FFF',
  },
});
