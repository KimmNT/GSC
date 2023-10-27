import React, {createContext, useContext, useState} from 'react';

const AppContext = createContext();

export function AppContextProvider({children}) {
  const [enteredNumber, setEnteredNumber] = useState(null);

  return (
    <AppContext.Provider value={{enteredNumber, setEnteredNumber}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
