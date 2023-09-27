import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import React, {useState} from 'react';

export default function MoreWeirdCom({navigation, route}) {
  const [text, setText] = useState('');

  const handleTextSubmit = () => {
    navigation.navigate('WeirdCom', {text});
  };
  return (
    <View>
      <TextInput
        placeholder="Enter text"
        value={text}
        onChangeText={text => setText(text)}
      />
      <Button title="Send Text" onPress={handleTextSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({});
