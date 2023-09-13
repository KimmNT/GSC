import {createContext, useContext, useState} from 'react';

const DeviceInfoContext = createContext();

export const DeviceInfoProvider = ({children}) => {
  const [deviceInfoArray, setDeviceInfoArray] = useState([]);

  const addDeviceInfo = deviceInfo => {
    setDeviceInfoArray([...deviceInfoArray, deviceInfo]);
  };

  const clearDeviceInfoArray = () => {
    setDeviceInfoArray([]);
  };

  return (
    <DeviceInfoContext.Provider
      value={{deviceInfoArray, addDeviceInfo, clearDeviceInfoArray}}>
      {children}
    </DeviceInfoContext.Provider>
  );
};

export const useDeviceInfo = () => {
  return useContext(DeviceInfoContext);
};
