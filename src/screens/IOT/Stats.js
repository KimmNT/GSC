import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';

import Svg, {G, Circle} from 'react-native-svg';

import BackArrow from '../components/BackArrow';
import MapView, {Heatmap} from 'react-native-maps';

//IMAGE
import BackGround from '../../../assets/images/background.png';
import Jump1 from '../../../assets/images/jump.png';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Stats({
  route,
  navigation,
  radius = 60,
  strokeWidth = 10,
  color = '#FF6B00',
  max = 200,
}) {
  const {dataResponse} = route.params;
  stringSplited = dataResponse.split('|');

  //Record
  record_id = [stringSplited[0]].toString().split('-'); //add value to specific onerecord_id
  deviveID = [record_id[1]]; //add value to specific one
  record_index = parseFloat([record_id[2]]); //add value to specific one
  activeTimeInMinute = ((record_index - 1) * 300) / 60;

  //Step
  steps = [stringSplited[1]].map(item => parseFloat(item)); //add value to specific one
  calories = Math.round(steps * 0.03);
  caloriesTarget = 200;
  distance = (Math.floor(steps * 0.85) / 1000).toFixed(2);

  //Heatmap
  map = [stringSplited[2]]
    .toString()
    .split(',')
    .map(item => parseFloat(item));

  //Acceleration
  acceleration = [stringSplited[3]]; //add value to specific one

  //Jump
  jump_info = [stringSplited[4]]
    .toString()
    .split(',')
    .map(item => parseFloat(item)); //add value to specific one
  jump = [jump_info[0]];
  jump_accl_max = [jump_info[1]];

  //Run
  run_info = [stringSplited[5]]
    .toString()
    .split(',')
    .map(item => parseFloat(item)); //add value to specific one
  run = [run_info[0]];
  run_avg = [run_info[1]];
  run_max = [run_info[2]];

  //Run acceleration
  run_acceleration_info = [stringSplited[6]].toString().split('*'); //add value to specific one
  run_acceleration_info_number = [run_acceleration_info[0]]
    .toString()
    .split(',')
    .map(item => parseFloat(item));

  run_accl = [run_acceleration_info_number[0]];
  run_accl_avg = [run_acceleration_info_number[1]];
  run_accl_max = [run_acceleration_info_number[2]];

  //HEATMAP
  const stringArray = [
    '10.80059,106.74493',
    '10.800520,106.74490',
    '10.800556,106.74493',
  ];
  const heatmapCoordinates = stringArray.map(coordinate => {
    const [latitude, longitude] = coordinate
      .split(',')
      .map(c => parseFloat(c.trim()));
    return {latitude, longitude};
  });

  //Calories - Donut chart
  const halfCircle = radius + strokeWidth;
  const circleCirumference = 2 * Math.PI * radius;
  const circleRef = useRef();

  const maxPerc = (100 * calories) / max;
  const strokeDashoffset =
    circleCirumference - (circleCirumference * maxPerc) / 100;

  //save data
  const handleSave = () => {
    navigation.navigate('Submit');
  };

  return (
    <View style={styles.container}>
      <Image source={BackGround} style={styles.background} />
      <SafeAreaView>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.popToTop()}>
            <BackArrow />
          </TouchableOpacity>
          <Text style={styles.header__text}>Dashboard</Text>
        </View>
        <ScrollView>
          <View style={styles.content}>
            {/* CONTENT */}
            <View style={styles.stat__container}>
              <View style={styles.stat__list}>
                <View style={styles.verical__list}>
                  <View style={styles.stat__box}>
                    {/* ITEM - TIME */}
                    <View style={[styles.stat__item, styles.break]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View style={[styles.stat__icon, styles.time__blur]}>
                            <Icon
                              name="schedule"
                              style={[styles.icon, styles.time]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Time</Text>
                        </View>
                        {/* STAT NUMBER */}
                        <View style={styles.item__number}>
                          <Text style={styles.number}>
                            {activeTimeInMinute}
                          </Text>
                          <Text style={styles.unit}>mins</Text>
                        </View>
                      </View>
                    </View>
                    {/* ITEM - CALORIES */}
                    <View style={[styles.stat__item, styles.break]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View
                            style={[styles.stat__icon, styles.calories__blur]}>
                            <Icon
                              name="local-fire-department"
                              style={[styles.icon, styles.calories]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Calories</Text>
                        </View>
                        {/* STAT NUMBER */}
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
                          <Text style={styles.unit}>
                            {calories}/{caloriesTarget} kcal
                          </Text>
                          {calories >= 200 ? (
                            <Text style={styles.congrate}>
                              You have reached your goal!
                            </Text>
                          ) : (
                            <></>
                          )}
                        </View>
                      </View>
                    </View>
                    {/* ITEM - JUMP ACCELERATION */}
                    <View style={[styles.stat__item, styles.break]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        <View style={styles.stat__jump}>
                          <Text style={styles.bottom__name}>
                            Jump Acceleration
                          </Text>
                          <Image source={Jump1} style={styles.jump__image} />
                        </View>
                        {/* STAT NUMBER */}
                        <View style={styles.item__number}>
                          <Text style={styles.number}>{jump_accl_max}</Text>
                          <Text style={styles.unit}>m/s</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.stat__box}>
                    {/* ITEM - SPRINT */}
                    <View style={[styles.stat__item, styles.break]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View
                            style={[styles.stat__icon, styles.sprint__blur]}>
                            <Icon
                              name="directions-run"
                              style={[styles.icon, styles.sprint]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Sprint</Text>
                        </View>
                        {/* STAT NUMBER */}
                        <View style={styles.item__number}>
                          <Text style={styles.number}>{run_avg}</Text>
                          <Text style={styles.unit}>AVG m/s</Text>
                        </View>
                      </View>
                    </View>
                    {/* ITEM - STEPS */}
                    <View style={[styles.stat__item, styles.break]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View style={[styles.stat__icon, styles.step__blur]}>
                            <Icon
                              name="run-circle"
                              style={[styles.icon, styles.step]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Steps</Text>
                        </View>
                        {/* STAT NUMBER */}
                        <View style={styles.item__number}>
                          <Text style={styles.number}>{steps}</Text>
                          <Text style={styles.unit}>steps</Text>
                        </View>
                      </View>
                    </View>
                    {/* ITEM - DISTANCE */}
                    <View style={[styles.stat__item, styles.break]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View
                            style={[styles.stat__icon, styles.distance__blur]}>
                            <Icon
                              name="directions-walk"
                              style={[styles.icon, styles.distance]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Distance</Text>
                        </View>
                        {/* STAT NUMBER */}
                        <View style={styles.item__number}>
                          <Text style={styles.number}>{distance}</Text>
                          <Text style={styles.unit}>km</Text>
                        </View>
                      </View>
                    </View>
                    {/* ITEM - JUMP */}
                    <View style={[styles.stat__item, styles.break]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View style={[styles.stat__icon, styles.jump__blur]}>
                            <Icon
                              name="arrow-upward"
                              style={[styles.icon, styles.jump]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Jump</Text>
                        </View>
                        {/* STAT NUMBER */}
                        <View style={styles.item__number}>
                          <Text style={styles.number}>{jump}</Text>
                          <Text style={styles.unit}>jumps</Text>
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
                      <View style={[styles.stat__icon, styles.heatmap__blur]}>
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
                        initialRegion={{
                          latitude: map[0], // Set the initial latitude of the map CENTER OF VN
                          longitude: map[1], // Set the initial longitude of the map CENTER OF VN
                          latitudeDelta: 0.0005, // Adjust the delta values as needed to zoom in/out
                          longitudeDelta: 0.0005,
                        }}
                        mapType="satellite" // Change the map type to satellite
                      >
                        <Heatmap
                          points={heatmapCoordinates}
                          radius={10} // Adjust the radius of each heatmap point
                          opacity={0.8} // Adjust the opacity of the heatmap
                        />
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
                    <View style={[styles.item__number, styles.multi]}>
                      <View style={styles.item}>
                        <Text style={styles.number}>{run}</Text>
                        <Text style={styles.unit}>m/s</Text>
                      </View>
                      <View style={styles.line}></View>
                      <View style={styles.item}>
                        <Text style={styles.number}>{run_avg}</Text>
                        <Text style={styles.unit}>AVG m/s</Text>
                      </View>
                      <View style={styles.line}></View>
                      <View style={styles.item}>
                        <Text style={styles.number}>{run_max}</Text>
                        <Text style={styles.unit}>MAX m/s</Text>
                      </View>
                    </View>
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
                      <Text style={styles.stat__name}>Speed Acceleration</Text>
                    </View>
                    {/* STAT NUMBER */}
                    <View style={[styles.item__number, styles.multi]}>
                      <View style={styles.item}>
                        <Text style={styles.number}>{run_accl}</Text>
                        <Text style={styles.unit}>m/s</Text>
                      </View>
                      <View style={styles.line}></View>
                      <View style={styles.item}>
                        <Text style={styles.number}>{run_accl_avg}</Text>
                        <Text style={styles.unit}>AVG m/s</Text>
                      </View>
                      <View style={styles.line}></View>
                      <View style={styles.item}>
                        <Text style={styles.number}>{run_accl_max}</Text>
                        <Text style={styles.unit}>MAX m/s</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.save__btn_container}
                onPress={handleSave}>
                <View style={styles.save__btn}>
                  <Text style={styles.save__btn_text}>save your data</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    padding: 15,
    // backgroundColor: 'teal',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    padding: 15,
  },
  header__text: {
    fontSize: 25,
    fontWeight: 900,
    color: '#FFF',
  },
  stat__container: {
    width: '100%',
    height: '100%',
    marginTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 200, //clear after done
  },
  stat__list: {
    gap: 20,
  },
  verical__list: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat__box: {
    width: '47%',
    justifyContent: 'space-between',
  },
  stat__item: {
    width: '100%',
    marginTop: 10,
  },
  stat__item_content: {
    width: '100%',
    backgroundColor: '#15212D',
    padding: 10,
    borderRadius: 15,
    shadowColor: '#EFE8E8',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.5,
    shadowRadius: 7.68,
    elevation: 12,
  },
  item__head: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat__icon: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {fontSize: 20},
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
    backgroundColor: '#4B333C',
  },
  jump: {
    color: '#F44336',
  },
  heatmap__blur: {
    backgroundColor: '#4D292F',
  },
  heatmap: {
    color: '#F44336',
  },
  stat__name: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 600,
    marginLeft: 10,
  },
  stat__jump: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  jump__image: {
    width: 60,
    height: 95,
    resizeMode: 'cover',
  },
  item__number: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  number: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: 700,
  },
  bottom__name: {
    textAlign: 'center',
    fontSize: 15,
    color: '#FFF',
    fontWeight: 700,
  },
  unit: {
    marginTop: 10,
    color: '#FFF',
    fontWeight: 600,
  },
  congrate: {
    fontSize: 13,
    marginTop: 10,
    color: '#43A047',
    textAlign: 'center',
  },
  map__container: {
    position: 'relative',
    marginTop: 20,
    paddingBottom: 10,
  },
  map__disable: {
    position: 'absolute',
    width: '100%',
    height: 250,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: 250,
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
    marginTop: 10,
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
  save__btn_container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  save__btn: {
    backgroundColor: '#E79C25',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    width: '70%',
  },
  save__btn_text: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 17,
  },
});
