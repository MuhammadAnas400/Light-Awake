import React, {useContext, useEffect, useRef, useState} from 'react';
import {soundSettings} from '../constants/available-settings';
import StorageProperty from '../constants/storage-property';
import {getAsyncStorageData, storeAsyncStorageData} from '../constants/utils';

export const AlarmSoundContext = React.createContext();

const defaultContext = {
  alarmSound: soundSettings[0]?.track,
  alarmSoundEnabled: false,
};

export function AlarmSoundContextProvider({children}) {
  const [alarmSound, setAlarmSound] = useState(defaultContext.alarmSound);
  const [alarmSoundEnabled, setAlarmSoundEnabled] = useState(
    defaultContext.alarmSoundEnabled,
  );
  const loadedStoreProperties = useRef(false);

  useEffect(() => {
    async function loadStateFromStorage() {
      const storageValues = await Promise.all([
        getAsyncStorageData(StorageProperty.ALARM_SOUND),
        getAsyncStorageData(StorageProperty.ALARM_SOUND_ENABLED),
      ]);

      setAlarmSound(storageValues[0] || defaultContext.alarmSound);
      setAlarmSoundEnabled(
        storageValues[1] === 'true' ?? defaultContext.alarmSoundEnabled,
      );

      loadedStoreProperties.current = true;
    }

    loadStateFromStorage();
  }, []);

  const store = (key, value) => {
    if (loadedStoreProperties.current) {
      storeAsyncStorageData(key, value);
    }
  };

  useEffect(() => {
    store(StorageProperty.ALARM_SOUND, alarmSound);
  }, [alarmSound]);

  useEffect(() => {
    store(StorageProperty.ALARM_SOUND_ENABLED, `${alarmSoundEnabled}`);
  }, [alarmSoundEnabled]);

  return (
    <AlarmSoundContext.Provider
      value={{
        alarmSound,
        setAlarmSound,
        alarmSoundEnabled,
        setAlarmSoundEnabled,
      }}>
      {children}
    </AlarmSoundContext.Provider>
  );
}

export function useAlarmSoundContext() {
  const context = useContext(AlarmSoundContext);
  if (context === undefined) {
    throw new Error(
      'useAlarmSoundContext can only be used inside AlarmSoundContextProvider',
    );
  }
  return context;
}
