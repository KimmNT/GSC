import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {useDeviceInfo} from './DeviceInfoContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NonAvatar from '../../../assets/images/emptyAvatar.png';
import axios from 'axios';

const res = Dimensions.get('window').height;

export default function TakeStudents({navigation, route}) {
  const {qrcode, classIdChose} = route.params;
  const [studentValue, setStudentValue] = useState([]);
  const [chosenStudentInfor, setChosenStudentInfor] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [idPassed, setIdPassed] = useState(false);
  const [deviceInfor, setDeviceInfor] = useState({
    qrcode: route.params.qrcode,
    classId: route.params.classIdChose,
    steps: 0,
    time: 0,
    distance: 0,
    calories: 0,
    speed_avg: 0,
    speed_max: 0,
    flex: 0,
    jump: 0,
  });

  const {addDeviceInfo} = useDeviceInfo();

  //SEARCH BOX
  const handleSearch = query => {
    setSearchQuery(query);
  };
  //FILTER FUNCTION
  const filtered = studentValue.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //FETCH DATA
  useEffect(() => {
    const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';
    const apiUrl = `http://api-gibbon-genio.dev.ncs.int/api/getStudentsByClassIdForIoT/${classIdChose}`;
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

  // HANDLE MAP STUDENT
  const handleMapStudent = (stuID, stuAva) => {
    setChosenStudentInfor(prevChosenStudentInfor => ({
      ...prevChosenStudentInfor,
      studentId: stuID,
      studentAva: stuAva,
      qrcode: qrcode,
    }));
    setIdPassed(true);
    // Optionally, you can also store the data in your deviceInfoArray
    const newDeviceInfo = {
      qrcode: qrcode,
      classId: classIdChose,
      steps: 0,
      time: 0,
      distance: 0,
      calories: 0,
      speed_avg: 0,
      speed_max: 0,
      flex: 0,
      jump: 0,
    };
    addDeviceInfo(newDeviceInfo);
  };

  if (idPassed) {
    navigation.navigate('GroupDevice', {
      studentInfor: chosenStudentInfor,
    });
  }

  return (
    <View style={styles.student__container}>
      <View style={styles.student__search_container}>
        <View style={styles.student__search_content}>
          <Icon name="search" style={styles.student__search_icon} />
          <TextInput
            style={styles.student__search_text}
            placeholder="Search for a student"
            onChangeText={handleSearch}
            value={searchQuery}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.student__list}>
          {studentValue.map(student => (
            <TouchableOpacity
              onPress={() =>
                handleMapStudent(student.gibbonStudentID, student.avatar)
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
    width: '48%',
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
    height: res * 0.3,
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
