// DeviceInfoContext.js
import {createContext, useContext, useState} from 'react';

const DeviceInfoContext = createContext();

export const DeviceInfoProvider = ({children}) => {
  const [deviceInfoArray, setDeviceInfoArray] = useState([]);

  const addDeviceInfo = deviceInfo => {
    setDeviceInfoArray([...deviceInfoArray, deviceInfo]);
  };

  return (
    <DeviceInfoContext.Provider value={{deviceInfoArray, addDeviceInfo}}>
      {children}
    </DeviceInfoContext.Provider>
  );
};

export const useDeviceInfo = () => {
  return useContext(DeviceInfoContext);
};
