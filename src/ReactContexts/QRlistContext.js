import {createContext, useContext, useState} from 'react';

const QRlistContext = createContext();

export const QRlistProvider = ({children}) => {
  const [qrList, setQRList] = useState([]);

  const addQRList = code => {
    setQRList(prevCodes => [
      ...prevCodes,
      {qrcode: code}, // Store as an object with the property name "qrcode"
    ]);
  };

  return (
    <QRlistContext.Provider value={{qrList, addQRList}}>
      {children}
    </QRlistContext.Provider>
  );
};

export const useQRListContext = () => {
  return useContext(QRlistContext);
};
