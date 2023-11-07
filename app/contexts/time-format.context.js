import React, {useContext, useState, useEffect} from 'react';
import {getAsyncStorageData, storeAsyncStorageData} from '../constants/utils';

export const TimeFormatContext = React.createContext();

const defaultSettings = {
  timeFormat: '12',
};

export function TimeFormatContextProvider({children}) {
  const [timeFormat, setTimeFormat] = useState();

  useEffect(() => {
    getAsyncStorageData('timeFormat').then((value) => {
      setTimeFormat(value || defaultSettings.timeFormat);
    });
  }, []);

  useEffect(() => {
    timeFormat && storeAsyncStorageData('timeFormat', timeFormat);
  }, [timeFormat]);

  return (
    <TimeFormatContext.Provider value={{timeFormat, setTimeFormat}}>
      {children}
    </TimeFormatContext.Provider>
  );
}

export function useTimeFormatContext() {
  const context = useContext(TimeFormatContext);
  if (context === undefined) {
    throw new Error(
      'useTimeFormatContext can only be used inside TimeFormatContext.Provider',
    );
  }
  return context;
}
