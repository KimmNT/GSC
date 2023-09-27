import {StyleSheet, Text, View, Button, FlatList} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

export default function WeirdCom({navigation, route}) {
  const [textArray, setTextArray] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const newText = route.params?.text;
      if (newText) {
        setTextArray([...textArray, newText]);
      }
    }, [route.params?.text]),
  );
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button
        title="Go to Text Entry"
        onPress={() =>
          navigation.navigate('MoreWeirdCom', {
            onTextEntered: text => setTextArray([...textArray, text]),
          })
        }
      />
      <FlatList
        data={textArray}
        renderItem={({item}) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
