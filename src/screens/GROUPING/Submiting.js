import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useDeviceInfo} from '../../ReactContexts/DeviceInfoContext';
import {useStudentInfo} from '../../ReactContexts/StudentInfoContext';
import BackArrow from '../components/BackArrow';
import NonAva from '../../../assets/images/emptyAvatar.png';
import axios from 'axios';

const res = Dimensions.get('window').height;

export default function Submiting({navigation}) {
  const [result, setResult] = useState([]);
  const {deviceInfoArray, clearDeviceInfoArray, addDeviceInfo} =
    useDeviceInfo();
  const {studentInfoArray, clearStudentInfoArray, addStudentInfo} =
    useStudentInfo();

  //COMBINE 2 ARRAY INTO ONE
  const qrcodeMap = {};
  for (const item of deviceInfoArray) {
    qrcodeMap[item.qrcode] = item;
  }
  const merchArray = studentInfoArray.map(item1 => ({
    ...item1,
    ...qrcodeMap[item1.qrcode],
  }));
  //FINISH COMBINE

  const url = 'https://api.qlhv.geniofut.com/api/postStudentHealthForIoT';
  const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';

  const handlePushToServer = () => {
    merchArray.forEach((item, index) => {
      setTimeout(async () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const data = {
          gibbonStudentID: item.stuId,
          gibbonClassID: item.classId,
          time: item.time,
          step: item.steps,
          calories: item.calories,
          flexibitity: item.flex,
          distance: item.distance,
          jump: item.jump,
          speed_average: item.speed__avg,
          speed_max: item.speed__max,
          date: formattedDate,
        };
        console.log(data);
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        };
        const res = await axios.post(url, data, {headers});
        setResult(res.data.status);
        console.log(res.data);
      }, index * 1000);
    });
  };

  if (result === 'success') {
    navigation.navigate('SubmitSuccess');
  }
  return (
    <View style={styles.submit__container}>
      <View style={styles.submit__headline}>
        {/* HEADER */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.submit__quit}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.submit__text}>save information</Text>
      </View>
      <ScrollView>
        <View style={styles.submit__list}>
          {merchArray.map(item => (
            <View style={styles.submit__item}>
              <View style={styles.submit__item_container}>
                {item.stuAva === '' ? (
                  <Image source={NonAva} style={styles.submit__item_img} />
                ) : (
                  <Image
                    source={{uri: item.stuAva}}
                    style={styles.submit__item_img}
                  />
                )}
                <Text style={styles.submit__item_qrcode}>
                  {item.qrcode.substring(9, 15)}
                </Text>
                <Text style={styles.name}>{item.stuName}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handlePushToServer} style={styles.submit__btn}>
        <View style={styles.submit__btn_container}>
          <Text style={styles.submit__btn_text}>save now</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  submit__container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#E0E0E0',
  },
  submit__headline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: res * 0.05,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: res * 0.04,
  },
  submit__text: {
    fontSize: res * 0.03,
    textTransform: 'uppercase',
    color: '#000',
    fontWeight: '900',
  },
  submit__list: {
    marginTop: res * 0.05,
    paddingHorizontal: res * 0.04,
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  submit__item: {
    width: '45%',
    backgroundColor: '#FFF',
    paddingHorizontal: res * 0.02,
    paddingVertical: res * 0.02,
    borderRadius: res * 0.015,
  },
  submit__item_container: {
    flexDirection: 'column',
    gap:res*0.015,
    alignItems:"center",
    width:"100%",
  },
  submit__item_img: {
    width: res * 0.1,
    height: res * 0.1,
    resizeMode: 'cover',
    borderRadius: (res * 0.1) / 2,
  },
  submit__item_qrcode: {
    backgroundColor: '#000',
    color: '#FFF',
    padding: res * 0.005,
    textAlign:"center"
  },
  submit__item_name: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: res * 0.01,
    marginTop: res * 0.02,
    borderRadius: res * 0.01,
    borderWidth: 1,
    borderColor: '#000',
  },
  name: {
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  submit__btn: {
    position: 'absolute',
    bottom: res * 0.05,
    alignItems: 'center',
    width: '100%',
  },
  submit__btn_container: {
    paddingHorizontal: res * 0.03,
    paddingVertical: res * 0.02,
    backgroundColor: '#4CAF50',
    borderRadius: res * 0.01,
  },
  submit__btn_text: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontSize: res * 0.02,
    fontWeight: '600',
  },
});
