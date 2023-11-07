import React, {useContext, useEffect, useRef, useState} from 'react';
import {soundSettings} from '../constants/available-settings';
import StorageProperty from '../constants/storage-property';
import {getAsyncStorageData, storeAsyncStorageData} from '../constants/utils';

export const SleepSoundContext = React.createContext();

const defaultContext = {
  sleepSound: soundSettings[0]?.track,
  sleepSoundEnabled: false,
  sleepSoundVolume: '10',
  sleepSoundTimer: '1',
};

export function SleepSoundContextProvider({children}) {
  const [sleepSound, setSleepSound] = useState(defaultContext.sleepSound);
  const [sleepSoundEnabled, setSleepSoundEnabled] = useState(
    defaultContext.sleepSoundEnabled,
  );
  const [sleepSoundTimer, setSleepSoundTimer] = useState(
    defaultContext.sleepSoundTimer,
  );
  const [sleepSoundVolume, setSleepSoundVolume] = useState(
    defaultContext.sleepSoundVolume,
  );
  const loadedStoreProperties = useRef(false);

  useEffect(() => {
    async function loadStateFromStorage() {
      const storageValues = await Promise.all([
        getAsyncStorageData(StorageProperty.SLEEP_SOUND),
        getAsyncStorageData(StorageProperty.SLEEP_SOUND_ENABLED),
        getAsyncStorageData(StorageProperty.SLEEP_SOUND_VOLUME),
        getAsyncStorageData(StorageProperty.SLEEP_SOUND_TIMER),
      ]);

      setSleepSound(storageValues[0] || defaultContext.sleepSound);
      setSleepSoundEnabled(
        storageValues[1] === 'true' ?? defaultContext.sleepSoundEnabled,
      );
      setSleepSoundVolume(storageValues[2] || defaultContext.sleepSoundVolume);
      setSleepSoundTimer(storageValues[3] || defaultContext.sleepSoundTimer);

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
    store(StorageProperty.SLEEP_SOUND, sleepSound);
  }, [sleepSound]);

  useEffect(() => {
    store(StorageProperty.SLEEP_SOUND_ENABLED, `${sleepSoundEnabled}`);
  }, [sleepSoundEnabled]);

  useEffect(() => {
    store(StorageProperty.SLEEP_SOUND_VOLUME, sleepSoundVolume);
  }, [sleepSoundVolume]);

  useEffect(() => {
    store(StorageProperty.SLEEP_SOUND_TIMER, sleepSoundTimer);
  }, [sleepSoundTimer]);

  return (
    <SleepSoundContext.Provider
      value={{
        sleepSound,
        setSleepSound,
        sleepSoundEnabled,
        setSleepSoundEnabled,
        sleepSoundVolume,
        setSleepSoundVolume,
        sleepSoundTimer,
        setSleepSoundTimer,
      }}>
      {children}
    </SleepSoundContext.Provider>
  );
}

export function useSleepSoundContext() {
  const context = useContext(SleepSoundContext);
  if (context === undefined) {
    throw new Error(
      'useSleepSoundContext can only be used inside SleepSoundContextProvider',
    );
  }
  return context;
}
