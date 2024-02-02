import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import NonAvatar from '../../../assets/images/emptyAvatar.png';
import {useStudentInfo} from '../../ReactContexts/StudentInfoContext';
import {useQRCodeContext} from '../../ReactContexts/QRcodeContext.js';
import {useQRListContext} from '../../ReactContexts/QRlistContext.js';
const res = Dimensions.get('window').height;

export default function TakeStudent({navigation, route}) {
  const {qrcodeCut, classIdChose} = route.params;
  const {addStudentInfo} = useStudentInfo();
  const [studentValue, setStudentValue] = useState([]);
  const [passed, setPassed] = useState(false);
  const {addScannedQRCode} = useQRCodeContext();
  const {addQRList} = useQRListContext();

  //FETCH DATA
  useEffect(() => {
    const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';
    const apiUrl = `https://api.qlhv.geniofut.com/api/getStudentsByClassIdForIoT/${classIdChose}`;
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            'x-api-key': apiKey,
          },
        });
        setStudentValue(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleTakeStudentInfor = (stuId, stuAVa, stuName) => {
    console.log(qrcodeCut);
    addStudentInfo(qrcodeCut, stuId, stuAVa, stuName);
    setPassed(true);
  };

  if (passed) {
    const steps = 0;
    const time = 0;
    const calories = 0;
    const flex = 0;
    const distance = 0;
    const jump = 0;
    const speed_average = 0;
    const speed_max = 0;
    addScannedQRCode(
      qrcodeCut,
      steps,
      time,
      calories,
      flex,
      distance,
      jump,
      speed_average,
      speed_max,
    );
    addQRList(qrcodeCut);
    // Move the addStudentInfo call inside the if block
    navigation.navigate('Group');
  }

  return (
    <View style={styles.student__container}>
      <ScrollView>
        <View style={styles.student__list}>
          {studentValue.map(student => (
            <TouchableOpacity
              onPress={() =>
                handleTakeStudentInfor(
                  student.gibbonStudentID,
                  student.avatar,
                  student.name,
                )
              }
              style={[styles.student__item, styles.shadow]}
              key={student.gibbonStudentID}>
              {student.avatar === '' ? (
                <Image source={NonAvatar} style={styles.student__item_img} />
              ) : (
                <Image
                  source={{uri: student.avatar}}
                  style={styles.student__item_img}
                />
              )}
              <Text style={styles.student__item_name}>{student.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  student__container: {
    marginTop: res * 0.05,
  },
  student__search_container: {
    paddingHorizontal: res * 0.02,
    marginBottom: res * 0.03,
  },
  student__search_content: {
    backgroundColor: '#BDBDBD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: res * 0.02,
    gap: res * 0.01,
    borderRadius: res * 0.05,
  },
  student__search_icon: {
    fontSize: res * 0.03,
    color: '#E0E0E0',
  },
  student__search_text: {
    width: '100%',
    paddingVertical: res * 0.01,
    fontSize: res * 0.02,
  },
  student__list: {
    paddingBottom: res * 0.1,
    paddingHorizontal: res * 0.02,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: res * 0.02,
  },
  student__item: {
    width: '45%',
    backgroundColor: '#FFF',
    borderRadius: res * 0.01,
    padding: res * 0.01,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: -5,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.68,
    elevation: 12,
  },
  student__item_img: {
    width: '100%',
    height: res * 0.2,
    resizeMode: 'cover',
    borderRadius: res * 0.01,
  },
  student__item_name: {
    width: '100%',
    paddingVertical: res * 0.015,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000',
  },
});
