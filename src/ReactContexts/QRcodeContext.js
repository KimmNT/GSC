import {createContext, useContext, useState} from 'react';

const QRCodeContext = createContext();

export const QRCodeProvider = ({children}) => {
  const [scannedQRCodes, setScannedQRCodes] = useState([]);

  const addScannedQRCode = (
    qrcode,
    steps,
    time,
    calories,
    flex,
    distance,
    jump,
    speed_average,
    speed_max,
  ) => {
    setScannedQRCodes(prevQRCodes => {
      const existingIndex = prevQRCodes.findIndex(
        item => item.qrcode === qrcode,
      );

      if (existingIndex !== -1) {
        // If QR code already exists, update the steps and time values
        const updatedQRCodes = [...prevQRCodes];
        updatedQRCodes[existingIndex] = {
          ...updatedQRCodes[existingIndex],
          steps,
          time,
          calories,
          flex,
          distance,
          jump,
          speed_average,
          speed_max,
        };
        return updatedQRCodes;
      } else {
        // If QR code doesn't exist, add a new entry
        return [
          ...prevQRCodes,
          {
            qrcode,
            steps,
            time,
            calories,
            flex,
            distance,
            jump,
            speed_average,
            speed_max,
          },
        ];
      }
    });
  };
  const clearScannedQRCode = () => {
    setScannedQRCodes([]);
  };

  return (
    <QRCodeContext.Provider
      value={{scannedQRCodes, addScannedQRCode, clearScannedQRCode}}>
      {children}
    </QRCodeContext.Provider>
  );
};

export const useQRCodeContext = () => {
  return useContext(QRCodeContext);
};
