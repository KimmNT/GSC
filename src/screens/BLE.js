import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  Easing,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import DeviceModal from './components/DeviceConnectionModal';
import Loading from './components/Loading';
import useBLE from '../../useBLE';
import Svg, {G, Circle} from 'react-native-svg';
import MapView, {Heatmap, Marker} from 'react-native-maps';

const res = Dimensions.get('window').height;

//IMAGE
import welcomeBG from '../../assets/images/welcome_bg.png';
import Logo from '../../assets/images/logo.png';
import BackGround from '../../assets/images/background.png';
import Jump1 from '../../assets/images/jump.png';
import Medal from '../../assets/images/medal.png';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BLE = ({
  navigation,
  radius = 60,
  strokeWidth = 20,
  color = '#E79C25',
  max = 500,
}) => {
  const {
    requestPermissions,
    scanForDevices,
    allDevices,
    connectToDevice,
    connectedDevice,
    data,
    disconnectFromDevice,
    sendDataToRXCharacteristic,
    stopDevice,
    clearDevices,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState(false);

  //split the data
  const dataSplited = data.split('|');
  id = [dataSplited[0]].map(item => parseInt(item));
  interval = [dataSplited[1]].map(item => parseInt(item));
  time = Math.round((id * (interval / 1000)) / 60);
  steps = [dataSplited[2]];
  log = [dataSplited[3]];
  lat = [dataSplited[4]];
  acceleration = [dataSplited[5]];
  jumps = [dataSplited[6]];
  jumpspeed = [dataSplited[7]];
  run = ([dataSplited[8]] * 3.6).toFixed(2);
  run_avg = ([dataSplited[9]] * 3.6).toFixed(2);
  run_max = ([dataSplited[10]] * 3.6).toFixed(2);
  run_acc = [dataSplited[11]];
  run_acc_avg = [dataSplited[12]];
  run_acc_max = [dataSplited[13]];
  deviceName = [dataSplited[14]].toString().substring(13);
  batteryRaw = [dataSplited[15]].toString();
  battery = parseInt(batteryRaw);
  // calories = Math.round(steps * 0.03);
  calories = 501;
  caloriesTarget = 500;
  distance = (Math.floor(steps * 0.2) / 1000).toFixed(2);

  //CLOCK
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date());
      sendDataToRXCharacteristic('read');
    }, 5000);
    // Clean up the interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, [clock]);

  const hours = clock.getHours().toString().padStart(2, '0');
  const minutes = clock.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const timeString = `${formattedHours}:${minutes}`;
  console.log(`${clock.getMinutes()}m : ${clock.getSeconds()}s`);

  //Hide Modal
  const hideModal = () => {
    setIsModalVisible(false);
  };

  //Open Modal, pass connection function
  const openModal = async () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        setIsModalVisible(true);
        scanForDevices();
      }
    });
  };
  //Calories - Donut chart
  const halfCircle = radius + strokeWidth;
  const circleCirumference = 2 * Math.PI * radius;
  const circleRef = useRef();

  const maxPerc = (100 * calories) / max;
  const strokeDashoffset =
    circleCirumference - (circleCirumference * maxPerc) / 100;

  //HEATMAP
  const stringArray = [
    '10.80059,106.74493',
    '10.800520,106.74490',
    '10.800556,106.74493',
    '10.800463,106.74483',
    '10.800530,106.74483',
    '10.800430,106.74483',
  ];
  const heatmapCoordinates = stringArray.map(coordinate => {
    const [latitude, longitude] = coordinate
      .split(',')
      .map(c => parseFloat(c.trim()));
    return {latitude, longitude};
  });

  const handleDisconnect = () => {
    Alert.alert('Disconnect warining!', 'Do you want to disconnect ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel disconnect'),
      },
      {
        text: 'OK',
        onPress: () => disconnectFromDevice(),
      },
    ]);
  };

  const handle = () => {
    sendDataToRXCharacteristic('delete');
  };
  const handleGrouping = () => {
    navigation.navigate('GroupDevice');
  };
  console.log(data);
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {connectedDevice ? (
          <View style={styles.container}>
            <Image source={BackGround} style={styles.background} />
            {/* HEADER */}
            <View style={styles.header}>
              <View>
                <Text style={styles.header__text}>Dashboard</Text>
                <Text style={styles.device__id}>Device code: {deviceName}</Text>
              </View>
              {/* BATTERY UI */}
              <View style={styles.battery__container}>
                <Text style={styles.battery__number}>{battery}%</Text>
                <View style={styles.battery__charge}>
                  {battery > 20 ? (
                    <View
                      style={[
                        styles.box__notcharge,
                        {width: `${battery}%`, height: '100%', borderRadius: 2},
                      ]}></View>
                  ) : (
                    <View
                      style={[
                        styles.box__incharge,
                        {width: `${battery}%`, height: '100%', borderRadius: 2},
                      ]}></View>
                  )}
                </View>
              </View>
            </View>
            <ScrollView>
              <View style={styles.content}>
                {/* CONTENT */}
                <View style={styles.stat__container}>
                  <View style={styles.stat__list}>
                    {/* VERTICAL LIST ONLY SHOW ONE */}
                    <View style={[styles.vertical__list]}>
                      <View style={styles.stat__box}>
                        {/* ITEM - TIME */}
                        <View style={[styles.stat__item, styles.break]}>
                          <View style={[styles.stat__item_content]}>
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.time__blur]}>
                                <Icon
                                  name="schedule"
                                  style={[styles.icon, styles.time]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Time</Text>
                            </View>
                            {data.length > 15 ? (
                              <View style={styles.item__number}>
                                <Text style={styles.number}>{time}</Text>
                                <Text style={styles.unit}>mins</Text>
                              </View>
                            ) : (
                              <View style={styles.item__number}>
                                <Loading />
                              </View>
                            )}
                          </View>
                        </View>
                        {/* ITEM - STEPS */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View
                            style={[
                              styles.stat__item_content,
                              styles.spotlight,
                            ]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.step__blur]}>
                                <Icon
                                  name="run-circle"
                                  style={[styles.icon, styles.step]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.stat__name,
                                  styles.spotlight__text,
                                ]}>
                                Step
                              </Text>
                            </View>
                            {/* STAT NUMBER */}
                            {data.length > 15 ? (
                              <View style={styles.item__number}>
                                <Text
                                  style={[
                                    styles.number,
                                    styles.spotlight__number,
                                  ]}>
                                  {steps}
                                </Text>
                                <Text
                                  style={[styles.unit, styles.spotlight__text]}>
                                  steps
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.item__number}>
                                <Loading />
                              </View>
                            )}
                          </View>
                        </View>
                        {/* ITEM - FLEXIBILITY */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.sprint__blur,
                                ]}>
                                <Icon
                                  name="directions-run"
                                  style={[styles.icon, styles.sprint]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Flexibility</Text>
                            </View>
                            {/* STAT NUMBER */}
                            {data.length > 15 ? (
                              <View style={styles.item__number}>
                                <Text style={styles.number}>
                                  {acceleration}
                                </Text>
                                <View style={styles.unit__square}>
                                  <Text style={styles.unit}></Text>
                                </View>
                              </View>
                            ) : (
                              <View style={styles.item__number}>
                                <Loading />
                              </View>
                            )}
                          </View>
                        </View>
                        {/* ITEM - JUMP */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.jump__blur]}>
                                <Icon
                                  name="arrow-upward"
                                  style={[styles.icon, styles.jump]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Jump</Text>
                            </View>
                            {/* STAT NUMBER */}
                            {data.length > 15 ? (
                              <View style={styles.item__number}>
                                <Text style={styles.number}>{jumps}</Text>
                                <Text style={styles.unit}>jumps</Text>
                              </View>
                            ) : (
                              <View style={styles.item__number}>
                                <Loading />
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      <View style={styles.stat__box}>
                        {/* ITEM - CALORIES */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View
                            style={[
                              styles.stat__item_content,
                              styles.spotlight,
                            ]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.calories__blur,
                                ]}>
                                <Icon
                                  name="local-fire-department"
                                  style={[styles.icon, styles.calories]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.stat__name,
                                  styles.spotlight__text,
                                ]}>
                                Calories
                              </Text>
                            </View>
                            {/* STAT NUMBER */}
                            {calories > 500 ? (
                              <View style={styles.item__number}>
                                <View style={styles.medal__container}>
                                  <Image source={Medal} style={styles.medal} />
                                </View>
                                <View style={styles.quote__contaier}>
                                  <Text style={styles.quote__text}>
                                    GOOD JOB!
                                  </Text>
                                  <Text style={styles.quote__text}>
                                    You have achieved your goal
                                  </Text>
                                </View>
                              </View>
                            ) : (
                              <View style={styles.item__number}>
                                <View>
                                  <Svg
                                    width={radius * 2}
                                    height={radius * 2}
                                    viewBox={`0 0 ${halfCircle * 2} ${
                                      halfCircle * 2
                                    }`}>
                                    <G
                                      rotation="-90"
                                      origin={`${halfCircle},${halfCircle}`}>
                                      <Circle
                                        cx="50%"
                                        cy="50%"
                                        stroke={color}
                                        strokeWidth={strokeWidth}
                                        r={radius}
                                        strokeOpacity={0.2}
                                        fill="transparent"
                                      />
                                      <AnimatedCircle
                                        ref={circleRef}
                                        cx="50%"
                                        cy="50%"
                                        stroke={color}
                                        strokeWidth={strokeWidth}
                                        r={radius}
                                        fill="transparent"
                                        strokeDasharray={circleCirumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                      />
                                    </G>
                                  </Svg>
                                </View>
                                <Text
                                  style={[styles.unit, styles.spotlight__text]}>
                                  {calories}/{caloriesTarget} kcal
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        {/* ITEM - DISTANCE */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View
                            style={[
                              styles.stat__item_content,
                              styles.spotlight,
                            ]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.distance__blur,
                                ]}>
                                <Icon
                                  name="directions-walk"
                                  style={[styles.icon, styles.distance]}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.stat__name,
                                  styles.spotlight__text,
                                ]}>
                                Distance
                              </Text>
                            </View>
                            {/* STAT NUMBER */}
                            {data.length > 15 ? (
                              <View style={styles.item__number}>
                                <Text
                                  style={[
                                    styles.number,
                                    styles.spotlight__number,
                                  ]}>
                                  {distance}
                                </Text>
                                <Text
                                  style={[styles.unit, styles.spotlight__text]}>
                                  km
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.item__number}>
                                <Loading />
                              </View>
                            )}
                          </View>
                        </View>
                        {/* ITEM - JUMP ACCELERATION */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            <View style={styles.stat__jump}>
                              <Text style={styles.bottom__name}>
                                Jump Force
                              </Text>
                              <Image
                                source={Jump1}
                                style={styles.jump__image}
                              />
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{jumpspeed}</Text>
                              <View style={styles.unit__square}></View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* ITEM - HEATMAP */}
                    <View style={[styles.stat__item]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View
                            style={[styles.stat__icon, styles.heatmap__blur]}>
                            <Icon
                              name="location-on"
                              style={[styles.icon, styles.heatmap]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Heat map</Text>
                        </View>
                        {/* MAP */}
                        <View style={styles.map__container}>
                          <View style={styles.map__disable}></View>
                          <MapView
                            style={styles.map}
                            provider={'google'}
                            initialRegion={{
                              // latitude: latitude, // Set the initial latitude of the map
                              // longitude: longitude, // Set the initial longitude of the map
                              latitude: 10.80043, // Set the initial latitude of the map ,
                              longitude: 106.74503, // Set the initial longitude of the map
                              latitudeDelta: 0.0005, // Adjust the delta values as needed to zoom in/out
                              longitudeDelta: 0.0005,
                            }}
                            mapType="satellite" // Change the map style to satellite
                          >
                            {heatmapCoordinates.map((coordinate, index) => (
                              <Marker
                                key={index}
                                coordinate={{
                                  latitude: coordinate.latitude,
                                  longitude: coordinate.longitude,
                                }}>
                                <View style={styles.heatmap__dots}>
                                  <View style={styles.heatmap__dots_nd}>
                                    <View
                                      style={styles.heatmap__dots_rd}></View>
                                  </View>
                                </View>
                              </Marker>
                            ))}
                          </MapView>
                        </View>
                      </View>
                    </View>
                    {/* ITEM-RUN */}
                    <View style={styles.stat__item}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View style={[styles.stat__icon, styles.speed__blur]}>
                            <Icon
                              name="directions-run"
                              style={[styles.icon, styles.speed]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Speed</Text>
                        </View>
                        {/* STAT NUMBER */}
                        {data.length > 15 ? (
                          <View style={[styles.item__number, styles.multi]}>
                            <View style={styles.item}>
                              <Text style={styles.number}>{run}</Text>
                              <Text style={styles.unit}>km/h</Text>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.item}>
                              <Text style={styles.number}>{run_avg}</Text>
                              <Text style={styles.unit}>AVG km/h</Text>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.item}>
                              <Text style={styles.number}>{run_max}</Text>
                              <Text style={styles.unit}>MAX km/h</Text>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.item__number}>
                            <Loading />
                          </View>
                        )}
                      </View>
                    </View>
                    {/* ITEM-RUN ACCELERATION*/}
                    <View style={styles.stat__item}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View
                            style={[
                              styles.stat__icon,
                              styles.speed_accecleration__blur,
                            ]}>
                            <Icon
                              name="call-made"
                              style={[styles.icon, styles.speed_accecleration]}
                            />
                          </View>
                          <Text style={styles.stat__name}>
                            Speed Flexibility
                          </Text>
                        </View>
                        {/* STAT NUMBER */}
                        {data.length > 15 ? (
                          <View style={[styles.item__number, styles.multi]}>
                            <View style={styles.item}>
                              <Text style={styles.number}>{run_acc}</Text>
                              <View style={styles.unit__square}></View>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.item}>
                              <Text style={styles.number}>{run_acc_avg}</Text>
                              <View style={styles.unit__square}></View>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.item}>
                              <Text style={styles.number}>{run_acc_max}</Text>
                              <View style={styles.unit__square}></View>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.item__number}>
                            <Loading />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  {/* BUTTON SAVE OR RESET */}
                  <View style={styles.button__group}>
                    <TouchableOpacity
                      style={[styles.button__container, styles.clear]}
                      onPress={handle}>
                      <Text style={[styles.button__title, styles.clear__title]}>
                        clear data
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button__container, styles.disconnect]}
                      onPress={handleDisconnect}>
                      <Text
                        style={[
                          styles.button__title,
                          styles.disconnect__title,
                        ]}>
                        disconnect
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.container}>
            <Image source={welcomeBG} style={styles.welcome__bg} />
            <View style={styles.content}>
              <View style={styles.welcome__container}>
                <View style={[styles.welcome__time]}>
                  <Text style={[styles.time__welcome, styles.highlight]}>
                    {timeString}
                  </Text>
                  <Text style={styles.time__welcome}>{period}</Text>
                </View>
                <View style={styles.welcome__logo}>
                  <Image source={Logo} style={styles.logo__image} />
                  <Text style={styles.logo__name}>smart coach</Text>
                </View>
                <View style={styles.welcome__btn_group}>
                  <View style={styles.welcome__scan}>
                    <Text style={styles.scan__text}>Scan your device</Text>
                    <TouchableOpacity
                      style={styles.scan__box}
                      onPress={openModal}>
                      <Icon name="chevron-right" style={styles.scan__icon} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.welcome__group}>
                    <Text style={styles.group__text}>Group your devices</Text>
                    <TouchableOpacity
                      style={styles.group__box}
                      onPress={handleGrouping}>
                      <Icon name="group-add" style={styles.group__icon} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        scanning={scanForDevices}
        devices={allDevices}
        stopScan={stopDevice}
        clearDevice={clearDevices}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  welcome__bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    // resizeMode: 'cover',
  },
  welcome__container: {
    position: 'relative',
    padding: res * 0.025,
    // backgroundColor: 'red',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome__time: {
    position: 'absolute',
    top: res * 0.035,
    left: 0,
    backgroundColor: '#4CAF50',
    padding: res * 0.02,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  time__welcome: {
    fontSize: res * 0.02,
    color: '#FFF',
  },
  highlight: {
    fontWeight: '700',
    fontSize: res * 0.03,
  },
  welcome__logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo__image: {
    width: res * 0.25,
    height: res * 0.25,
    resizeMode: 'cover',
  },
  logo__name: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: res * 0.04,
    color: '#FFF',
  },
  welcome__btn_group: {
    position: 'absolute',
    bottom: res * 0.035,
    right: 0,
    gap: res * 0.05,
  },
  welcome__scan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scan__text: {
    fontSize: res * 0.025,
    color: '#FFF',
    fontWeight: '600',
  },
  scan__box: {
    width: res * 0.07,
    height: res * 0.07,
    borderRadius: (res * 0.07) / 2,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scan__icon: {
    fontSize: res * 0.05,
    color: '#FFF',
  },
  welcome__group: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
  },
  group__text: {
    fontSize: res * 0.02,
    color: '#FFF',
    fontWeight: '600',
  },
  group__box: {
    width: res * 0.05,
    height: res * 0.05,
    borderRadius: (res * 0.05) / 2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  group__icon: {
    fontSize: res * 0.025,
    color: '#4CAF50',
  },

  //STATS STYLE --------------------------------------------------------------------------------
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  content: {
    padding: Platform.OS === 'android' ? res * 0.02 : res * 0.025,
    // backgroundColor: 'teal',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: res * 0.025,
    padding: res * 0.03,
    paddingTop: Platform.OS === 'ios' ? res * 0.05 : 0,
  },
  header__text: {
    fontSize: Platform.OS == 'android' ? res * 0.03 : res * 0.04,
    fontWeight: '900',
    // color: '#4CAF50',
    color: '#4CAF50',
  },
  device__id: {
    fontSize: 15,
    marginTop: 10,
    color: '#FFF',
  },
  battery__container: {
    position: 'relative',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  battery__number: {
    color: '#FFF',
    fontSize: res * 0.015,
    fontWeight: '900',
  },
  battery__charge: {
    width: res * 0.04,
    height: res * 0.015,
    backgroundColor: '#BDBDBD',
    borderRadius: 2,
  },
  box__notcharge: {
    backgroundColor: '#388E3C',
  },
  box__incharge: {
    backgroundColor: '#FB8C00',
  },
  stat__container: {
    width: '100%',
    height: '100%',
    marginTop: res * 0.005,
    paddingHorizontal: res * 0.009,
    paddingBottom: res * 0.06, //clear after done
  },
  stat__list: {
    gap: 20,
  },
  vertical__list: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat__box: {
    width: '48%',
    justifyContent: 'space-between',
  },
  stat__item: {
    width: '100%',
    marginTop: res * 0.02,
  },
  stat__item_content: {
    width: '100%',
    backgroundColor: '#15212D',
    padding: res * 0.015,
    borderRadius: 15,
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5.68,
    elevation: 12,
  },
  spotlight: {
    // backgroundColor: '#B7B7B7',
    // shadowColor: '#EADBC8',
  },
  item__head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat__icon: {
    width: res * 0.045,
    height: res * 0.045,
    borderRadius: (res * 0.045) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: res * 0.025,
  },
  time__blur: {
    backgroundColor: '#4F4722',
  },
  time: {
    color: '#FFB800',
  },
  distance__blur: {
    backgroundColor: '#243352',
  },
  distance: {
    color: '#627CE6',
  },
  sprint__blur: {
    backgroundColor: '#113C24',
  },
  sprint: {
    color: '#03A900',
  },
  calories__blur: {
    backgroundColor: '#443024',
  },
  calories: {
    color: '#FF6B00',
  },
  step__blur: {
    backgroundColor: '#412F39',
  },
  step: {
    fontSize: 25,
    color: '#F16767',
  },
  jump__blur: {
    backgroundColor: '#443C2C',
  },
  jump: {
    color: '#FFA726',
  },
  heatmap__blur: {
    backgroundColor: '#4D292F',
  },
  heatmap: {
    color: '#F44336',
  },
  stat__name: {
    fontSize: res * 0.02,
    color: '#FFF',
    fontWeight: '900',
    marginLeft: res * 0.015,
  },
  stat__jump: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  jump__image: {
    width: res * 0.07,
    height: res * 0.12,
    resizeMode: 'cover',
  },
  item__number: {
    alignItems: 'center',
    paddingVertical: res * 0.025,
  },
  medal__container: {
    width: res * 0.12,
    height: res * 0.125,
  },
  medal: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  quote__contaier: {
    marginTop: res * 0.02,
    gap: res * 0.01,
    alignItems: 'center',
  },
  quote__text: {
    textAlign: 'center',
    fontWeight: '900',
    color: '#4CAF50',
  },
  number: {
    fontSize: res * 0.04,
    color: '#FFF',
    fontWeight: '700',
  },
  spotlight__number: {
    fontSize: res * 0.05,
    color: '#E79C25',
  },
  bottom__name: {
    textAlign: 'center',
    fontSize: res * 0.02,
    color: '#FFF',
    fontWeight: '900',
  },
  unit__square: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  square: {
    fontSize: res * 0.013,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: res * 0.003,
  },
  unit: {
    marginTop: res * 0.015,
    color: '#FFF',
    fontWeight: '600',
  },
  congrate: {
    fontSize: res * 0.015,
    marginTop: 10,
    color: '#43A047',
    textAlign: 'center',
  },
  map__container: {
    position: 'relative',
    marginTop: res * 0.025,
    paddingBottom: res * 0.015,
  },
  map__disable: {
    position: 'absolute',
    width: '100%',
    height: res * 0.3,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: res * 0.3,
  },
  heatmap__dots: {
    padding: res * 0.005,
    backgroundColor: '#43A047',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmap__dots_nd: {
    padding: res * 0.0048,
    backgroundColor: '#FDD835',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.6,
  },
  heatmap__dots_rd: {
    padding: res * 0.0047,
    backgroundColor: '#F4511E',
    borderRadius: 10,
    // opacity: 0.6,
  },
  speed__blur: {
    backgroundColor: '#4F2E2A',
  },
  speed: {
    color: '#FF5722',
  },
  multi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: res * 0.015,
    paddingVertical: res * 0.025,
  },
  item: {
    alignItems: 'center',
    width: '31%',
  },
  speed_accecleration__blur: {
    backgroundColor: '#103945',
  },
  speed_accecleration: {
    color: '#00ACC1',
  },
  line: {
    height: '50%',
    width: 1,
    backgroundColor: '#616161',
  },
  button__group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: res * 0.05,
  },
  button__container: {
    width: '45%',
    paddingVertical: res * 0.03,
    alignItems: 'center',
    borderRadius: 5,
  },
  clear: {
    backgroundColor: '#FFF',
  },
  disconnect: {
    backgroundColor: '#4CAF50',
  },
  button__title: {
    textTransform: 'uppercase',
    fontSize: res * 0.02,
    fontWeight: '600',
  },
  clear__title: {
    color: '#4CAF50',
  },
  disconnect__title: {
    color: '#FFF',
  },
  loadingAnimation: {
    width: 0,
    height: res * 0.01,
    backgroundColor: '#FFF',
  },
});

export default BLE;
