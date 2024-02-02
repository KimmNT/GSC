import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Submit from '../screens/components/Submit';
import Success from '../screens/components/Success';
import BLEScreen from '../screens/BLE';
import GroupDevice from '../screens/GROUPING/GroupDevice';
import TakeQRCode from '../screens/GROUPING/TakeQRCode';
import TakePicture from '../screens/GROUPING/TakePicture';
import GetClasses from '../screens/SUBMIT/GetClasses';
import GetStudents from '../screens/SUBMIT/GetStudents';
import SubmitDone from '../screens/SUBMIT/SubmitDone';
import TakeStudent from '../screens/GROUPING/TakeStudent';
import WeirdCom from '../screens/TEST/WeirdCom';
import Submiting from '../screens/GROUPING/Submiting';
import SubmitSuccess from '../screens/GROUPING/SubmitSuccess';
import Group from '../screens/GROUPING/Group';

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
        <Stack.Screen name="GroupDevice" component={GroupDevice} />
        <Stack.Screen name="TakeQRCode" component={TakeQRCode} />
        <Stack.Screen name="TakePicture" component={TakePicture} />
        <Stack.Screen name="TakeStudent" component={TakeStudent} />
        <Stack.Screen name="Classes" component={GetClasses} />
        <Stack.Screen name="Student" component={GetStudents} />
        <Stack.Screen name="SubmitDone" component={SubmitDone} />
        <Stack.Screen name="Submitting" component={Submiting} />
        <Stack.Screen name="SubmitSuccess" component={SubmitSuccess} />
        <Stack.Screen name="Group" component={Group} />
        {/* /// */}
        <Stack.Screen name="Weird" component={WeirdCom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
