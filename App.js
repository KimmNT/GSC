import React, {useEffect, useState} from 'react';
import Splash from './src/screens/Splash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Routing from './src/router/Routing';
import {LogBox} from 'react-native';
import Loading from './src/screens/components/Loading';

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
    <SafeAreaProvider>{isSplash ? <Splash /> : <Routing />}</SafeAreaProvider>
  );
};

export default App;
