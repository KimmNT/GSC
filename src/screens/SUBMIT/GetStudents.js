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
import Icon from 'react-native-vector-icons/MaterialIcons';
const res = Dimensions.get('window').height;

export default function GetStudents({route, navigation}) {
  const {
    classIdChose,
    time,
    steps,
    calories,
    acceleration,
    distance,
    jumps,
    run_avg,
    run_max,
  } = route.params;
  const [studentValue, setStudentValue] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  //CONVERT TO
  timeToNumber = parseInt(time).toFixed(2);
  stepToNumber = parseInt(steps).toFixed(2);
  caloriesToNumber = parseFloat(calories).toFixed(2);
  accelToNumber = parseFloat(acceleration).toFixed(2);
  distanceToNumber = parseFloat(distance).toFixed(2);
  jumpToNumber = parseInt(jumps).toFixed(2);
  runAVGToNumber = parseFloat(run_avg).toFixed(2);
  runMAXToNumber = parseFloat(run_max).toFixed(2);

  console.log(
    classIdChose,
    stepToNumber,
    calories,
    accelToNumber,
    distanceToNumber,
    jumpToNumber,
    runAVGToNumber,
    runMAXToNumber,
  );

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

  //SAVE STUDENT INFORMATION
  const handleSaveStudentInformation = (studentID, studentName) => {
    Alert.alert(
      'Save information!',
      `Do you want to save information of ${studentName} ?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log(`NOPE!`),
        },
        {
          text: 'OK',
          onPress: async () => {
            const url =
              'https://api.qlhv.geniofut.com/api/postStudentHealthForIoT';
            const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';

            const currentDate = new Date();

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            const data = {
              gibbonStudentID: studentID,
              gibbonClassID: classIdChose,
              time: timeToNumber,
              step: stepToNumber,
              calories: caloriesToNumber,
              flexibitity: accelToNumber,
              distance: distanceToNumber,
              jump: jumpToNumber,
              speed_average: runAVGToNumber,
              speed_max: runMAXToNumber,
              date: formattedDate,
            };
            const headers = {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            };
            console.log(data);
            const res = await axios.post(url, data, {headers});
            console.log(res.data);
            res.data.status
              ? navigation.navigate('SubmitDone')
              : console.log('Something went wrong!');
          },
        },
      ],
    );
  };

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
          {filtered.map(student => (
            <TouchableOpacity
              onPress={() =>
                handleSaveStudentInformation(
                  student.gibbonStudentID,
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
