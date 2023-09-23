import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';

export default function WeirdCom() {
  const [update, setUpdate] = useState('From the start');
  const handleChangeState = () => {
    setUpdate('Empty');
  };
  console.log(`the update after press: ${update}`);
  useEffect(() => {
    const timmer = setInterval(() => {
      console.log(update);
    }, 2000);
    return () => {
      clearInterval(timmer);
    };
  }, [update]);
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{update}</Text>
      <TouchableOpacity
        style={{backgroundColor: 'tomato', padding: 20, marginTop: 20}}
        onPress={handleChangeState}>
        <Text style={{color: '#FFF'}}>CHANGE!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
