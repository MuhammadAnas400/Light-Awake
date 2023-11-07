import React, {useContext, useEffect, useRef, useState} from 'react';
import StorageProperty from '../constants/storage-property';
import {getAsyncStorageData, storeAsyncStorageData} from '../constants/utils';

export const AlarmTimeContext = React.createContext();

const defaultContext = {
  hours: 7,
  minutes: 0,
};

export function AlarmTimeContextProvider({children}) {
  const [hours, setHours] = useState(defaultContext.hours);
  const [minutes, setMinutes] = useState(defaultContext.minutes);

  const loadedStoreProperties = useRef(false);

  useEffect(() => {
    async function loadStateFromStorage() {
      const storageValues = await Promise.all([
        getAsyncStorageData(StorageProperty.ALARM_HOURS),
        getAsyncStorageData(StorageProperty.ALARM_MINUTES),
      ]);

      setHours(storageValues[0] || defaultContext.hours);
      setMinutes(storageValues[1] || defaultContext.minutes);

      loadedStoreProperties.current = true;
    }

    loadStateFromStorage();
  }, []);

  const store = (key, value) => {
    if (loadedStoreProperties.current) {
      storeAsyncStorageData(key, value.toString());
    }
  };

  useEffect(() => {
    store(StorageProperty.ALARM_HOURS, hours);
  }, [hours]);

  useEffect(() => {
    store(StorageProperty.ALARM_MINUTES, minutes);
  }, [minutes]);

  return (
    <AlarmTimeContext.Provider
      value={{
        hours,
        setHours,
        minutes,
        setMinutes,
      }}>
      {children}
    </AlarmTimeContext.Provider>
  );
}

export function useAlarmTimeContext() {
  const context = useContext(AlarmTimeContext);
  if (context === undefined) {
    throw new Error(
      'useWakeUpContext can only be used inside WakeUpContextProvider',
    );
  }
  return context;
}
