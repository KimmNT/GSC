import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackArrow from './BackArrow';

const res = Dimensions.get('window').height;

export default function GetClassesModel(props) {
  const {visible, closeModal, sendClassId, sendClassName} = props;
  const [apiValue, setApiValue] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  //SEARCH BOX
  const handleSearch = query => {
    setSearchQuery(query);
  };
  const filtered = apiValue.filter(classes =>
    classes.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //FETCH DATA
  useEffect(() => {
    const apiKey = '251cb836e62cd90f35de2a2fe570133e643a182b';
    const apiUrl = 'http://api-gibbon-genio.dev.ncs.int/api/getClassesForIoT';
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            'x-api-key': apiKey,
          },
        });
        setApiValue(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleCloseModal = (classIdChose, classNameChose) => {
    sendClassId(classIdChose);
    sendClassName(classNameChose);
    closeModal();
  };

  const handleCloseClassModal = () => {
    closeModal();
  };
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.class__container}>
        <View style={styles.class__search_container}>
          <TouchableOpacity onPress={handleCloseClassModal}>
            <BackArrow />
          </TouchableOpacity>
          <View style={styles.class__search_content}>
            <Icon name="search" style={styles.class__search_icon} />
            <TextInput
              style={styles.class__search_text}
              placeholder="Search for a class"
              onChangeText={handleSearch}
              value={searchQuery}
            />
          </View>
        </View>
        <ScrollView>
          <View style={styles.class__content}>
            <View style={styles.class__list}>
              {filtered.map(classes => (
                <TouchableOpacity
                  onPress={() =>
                    handleCloseModal(classes.gibbonClassID, classes.code)
                  }
                  key={classes.gibbonClassID}
                  style={styles.class__item}>
                  <View style={styles.class__item_name_container}>
                    <Text style={styles.class__item_name}>{classes.code}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  class__container: {
    marginTop: res * 0.05,
  },
  class__search_container: {
    paddingHorizontal: res * 0.02,
    marginBottom: res * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: res * 0.02,
    width: '100%',
  },
  class__search_content: {
    backgroundColor: '#BDBDBD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: res * 0.02,
    gap: res * 0.01,
    borderRadius: res * 0.05,
    width: '80%',
  },
  class__search_icon: {
    fontSize: res * 0.03,
    color: '#E0E0E0',
  },
  class__search_text: {
    width: '100%',
    paddingVertical: res * 0.01,
    fontSize: res * 0.02,
  },
  class__list: {
    paddingBottom: res * 0.1,
    paddingHorizontal: res * 0.02,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: res * 0.02,
  },
  class__item: {
    width: '48%',
    backgroundColor: '#15212D',
    // alignItems: 'center',
    padding: res * 0.01,
    borderRadius: res * 0.01,
    justifyContent: 'center',
  },
  class__item_name_container: {
    borderRadius: res * 0.007,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: res * 0.02,
  },
  class__item_name: {
    color: '#15212D',
    fontWeight: '600',
  },
});
