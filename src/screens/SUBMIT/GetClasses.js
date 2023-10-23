import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';

const res = Dimensions.get('window').height;

export default function GetClasses({navigation}) {
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

  //GET THE ID OF CLASS
  const handlePressClass = id => {
    navigation.navigate('Student', {id});
  };

  return (
    <View style={styles.class__container}>
      <View style={styles.class__search_text_container}>
        <TextInput
          style={styles.class__search_text}
          placeholder="Search for a class"
          onChangeText={handleSearch}
          value={searchQuery}
        />
      </View>
      <ScrollView>
        <View style={styles.class__content}>
          <View style={styles.class__list}>
            {filtered.map(classes => (
              <TouchableOpacity
                onPress={() => handlePressClass(classes.gibbonClassID)}
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
  );
}

const styles = StyleSheet.create({
  class__container: {
    marginTop: res * 0.05,
  },
  class__content: {
    paddingBottom: res * 0.1,
    paddingHorizontal: res * 0.02,
  },
  class__search_text_container: {
    paddingHorizontal: res * 0.02,
  },
  class__search_text: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#15212D',
    borderRadius: res * 0.005,
    paddingVertical: res * 0.01,
    paddingHorizontal: res * 0.01,
    marginBottom: res * 0.03,
    fontSize: res * 0.02,
  },
  class__list: {
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
