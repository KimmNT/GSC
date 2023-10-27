// StudentInfoContext.js

import {createContext, useContext, useState} from 'react';

const StudentInfoContext = createContext();

export const StudentInfoProvider = ({children}) => {
  const [studentInfoArray, setStudentInfoArray] = useState([]);

  const addStudentInfo = (qrcode, stuId, stuAva) => {
    setStudentInfoArray([...studentInfoArray, {qrcode, stuId, stuAva}]);
  };

  const clearStudentInfoArray = () => {
    setStudentInfoArray([]);
  };

  return (
    <StudentInfoContext.Provider
      value={{studentInfoArray, addStudentInfo, clearStudentInfoArray}}>
      {children}
    </StudentInfoContext.Provider>
  );
};

export const useStudentInfo = () => {
  return useContext(StudentInfoContext);
};
