import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Submit from '../screens/components/Submit';
import Success from '../screens/components/Success';
import Stats from '../screens/IOT/Stats';
import BLEScreen from '../screens/BLE';

const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="BLE">
        <Stack.Screen name="BLE" component={BLEScreen} />
        <Stack.Screen name="Submit" component={Submit} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
