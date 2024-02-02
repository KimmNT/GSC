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
import {useQRCodeContext} from '../../ReactContexts/QRcodeContext.js';
import {useStudentInfo} from '../../ReactContexts/StudentInfoContext';
import BackArrow from '../components/BackArrow';
import NonAva from '../../../assets/images/emptyAvatar.png';
import axios from 'axios';

const res = Dimensions.get('window').height;

export default function Submiting({navigation, route}) {
  const {classIdChose} = route.params;
  const [result, setResult] = useState([]);
  const {studentInfoArray} = useStudentInfo();
  const {scannedQRCodes} = useQRCodeContext();

  //COMBINE 2 ARRAY INTO ONE
  const combinedArray = scannedQRCodes.map(item1 => ({
    ...item1,
    ...studentInfoArray.find(item2 => item2.qrcode === item1.qrcode),
  }));
  //FINISH COMBINE

  const url = 'https://api.qlhv.geniofut.com/api/postStudentHealthForIoT';
  const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';

  const handlePushToServer = () => {
    combinedArray.forEach((item, index) => {
      setTimeout(async () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const data = {
          gibbonStudentID: item.stuId,
          gibbonClassID: classIdChose,
          time: item.time,
          step: item.steps,
          calories: item.calories,
          flexibitity: item.flex,
          distance: item.distance,
          jump: item.jump,
          speed_average: item.speed_average,
          speed_max: item.speed_max,
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
        <View style={styles.submit__header}>
          <Text style={styles.submit__text}>save information</Text>
          <Text style={styles.submit__total_text}>
            Total: {combinedArray.length}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.submit__list}>
          {combinedArray.map(item => (
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
                <View style={styles.submit__item_qrcode}>
                  <Text style={styles.qrcode__value}>
                    {item.qrcode.substring(9, 15)}
                  </Text>
                </View>
                <View style={styles.submit__item_name}>
                  <Text style={styles.name__value}>{item.stuName}</Text>
                </View>
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
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: res * 0.04,
  },
  submit__header: {
    alignItems: 'flex-end',
    gap: res * 0.02,
    paddingBottom: res * 0.01,
  },
  submit__text: {
    fontSize: res * 0.03,
    textTransform: 'uppercase',
    color: '#000',
    fontWeight: '900',
  },
  submit__total_text: {
    fontSize: res * 0.02,
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
    marginBottom: res * 0.02,
  },
  submit__item_container: {
    flexDirection: 'column',
    gap: res * 0.02,
    alignItems: 'center',
    width: '100%',
  },
  submit__item_img: {
    width: res * 0.15,
    height: res * 0.15,
    resizeMode: 'cover',
    borderRadius: (res * 0.15) / 2,
  },
  submit__item_qrcode: {
    backgroundColor: '#000',
    paddingHorizontal: res * 0.02,
    paddingVertical: res * 0.01,
    borderRadius: res * 0.005,
  },
  qrcode__value: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: res * 0.02,
  },
  submit__item_name: {
    height: res * 0.05,
    width: '100%',
  },
  name__value: {
    textAlign: 'center',
    fontSize: res * 0.02,
    fontWeight: '600',
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
