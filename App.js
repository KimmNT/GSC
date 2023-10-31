import React, {useEffect, useState} from 'react';
import Splash from './src/screens/Splash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Routing from './src/router/Routing';
import {LogBox} from 'react-native';
import {DeviceInfoProvider} from './src/ReactContexts/DeviceInfoContext';
import {StudentInfoProvider} from './src/ReactContexts/StudentInfoContext';
import WeirdCom from './src/screens/TEST/WeirdCom';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

//remove warning ViewPropTypes will be removed from React Native,
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  const [isSplash, setIsSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsSplash(false);
    }, 2300);
  });
  return (
    <DeviceInfoProvider>
      <StudentInfoProvider>
        {/* <SafeAreaProvider>{isSplash ? <Splash /> : <Routing />}</SafeAreaProvider> */}
        <Routing />
        {/* <WeirdCom /> */}
      </StudentInfoProvider>
    </DeviceInfoProvider>

    // <TakeQRCode />
  );
};

export default App;
