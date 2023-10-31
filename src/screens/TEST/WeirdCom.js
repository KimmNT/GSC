import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';

export default function WeirdCom() {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDone(true);
    }, 3000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (isDone) {
      // Display an alert when isDone becomes true
      Alert.alert("It's done", 'The task is complete!');
    }
  }, [isDone]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {isDone ? <Text>ITS DONE</Text> : <Text>NOT DONE YET</Text>}
    </View>
  );
}

const styles = StyleSheet.create({});
