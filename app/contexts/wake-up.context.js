import React, {useContext, useEffect, useRef, useState} from 'react';
import StorageProperty from '../constants/storage-property';
import {getAsyncStorageData, storeAsyncStorageData} from '../constants/utils';

export const WakeUpContext = React.createContext();

const defaultContext = {
  screenColor: 'white',
  screenPulseRate: '1s',
  screenPulseRateEnabled: false,
  flashlightPulseRate: '1s',
  flashlightPulseRateEnabled: false,
  bulbPulseRate: '1s',
  bulbPulseRateEnabled: false,
};

export function WakeUpContextProvider({children}) {
  const [screenColor, setScreenColor] = useState(defaultContext.screenColor);
  const [screenPulseRate, setScreenPulseRate] = useState(
    defaultContext.screenPulseRate,
  );
  const [screenPulseRateEnabled, setScreenPulseRateEnabled] = useState(
    defaultContext.screenPulseRateEnabled,
  );
  const [flashlightPulseRate, setFlashlightPulseRate] = useState(
    defaultContext.flashlightPulseRate,
  );
  const [flashlightPulseRateEnabled, setFlashlightPulseRateEnabled] = useState(
    defaultContext.flashlightPulseRateEnabled,
  );
  const [bulbPulseRate, setBulbPulseRate] = useState(
    defaultContext.bulbPulseRate,
  );
  const [bulbPulseRateEnabled, setBulbPulseRateEnabled] = useState(
    defaultContext.bulbPulseRateEnabled,
  );

  const loadedStoreProperties = useRef(false);

  useEffect(() => {
    async function loadStateFromStorage() {
      const storageValues = await Promise.all([
        getAsyncStorageData(StorageProperty.SCREEN_COLOR),
        getAsyncStorageData(StorageProperty.SCREEN_PULSE_RATE),
        getAsyncStorageData(StorageProperty.SCREEN_PULSE_RATE_ENABLED),
        getAsyncStorageData(StorageProperty.FLASHLIGHT_PULSE_RATE),
        getAsyncStorageData(StorageProperty.FLASHLIGHT_PULSE_RATE_ENABLED),
        getAsyncStorageData(StorageProperty.BULB_PULSE_RATE),
        getAsyncStorageData(StorageProperty.BULB_PULSE_RATE_ENABLED),
      ]);

      setScreenColor(storageValues[0] || defaultContext.screenColor);
      setScreenPulseRate(storageValues[1] || defaultContext.screenPulseRate);
      setScreenPulseRateEnabled(
        storageValues[2] === 'true' ?? defaultContext.screenPulseRateEnabled,
      );
      setFlashlightPulseRate(
        storageValues[3] || defaultContext.flashlightPulseRate,
      );
      setFlashlightPulseRateEnabled(
        storageValues[4] === 'true' ??
          defaultContext.flashlightPulseRateEnabled,
      );
      setBulbPulseRate(storageValues[3] || defaultContext.bulbPulseRate);
      setBulbPulseRateEnabled(
        storageValues[4] === 'true' ?? defaultContext.bulbPulseRateEnabled,
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
    store(StorageProperty.SCREEN_COLOR, screenColor);
  }, [screenColor]);

  useEffect(() => {
    store(StorageProperty.SCREEN_PULSE_RATE, screenPulseRate);
  }, [screenPulseRate]);

  useEffect(() => {
    store(
      StorageProperty.SCREEN_PULSE_RATE_ENABLED,
      `${screenPulseRateEnabled}`,
    );
  }, [screenPulseRateEnabled]);

  useEffect(() => {
    store(StorageProperty.FLASHLIGHT_PULSE_RATE, flashlightPulseRate);
  }, [flashlightPulseRate]);

  useEffect(() => {
    store(
      StorageProperty.FLASHLIGHT_PULSE_RATE_ENABLED,
      `${flashlightPulseRateEnabled}`,
    );
  }, [flashlightPulseRateEnabled]);

  useEffect(() => {
    store(StorageProperty.BULB_PULSE_RATE, bulbPulseRate);
  }, [bulbPulseRate]);

  useEffect(() => {
    store(StorageProperty.BULB_PULSE_RATE_ENABLED, `${bulbPulseRateEnabled}`);
  }, [bulbPulseRateEnabled]);

  return (
    <WakeUpContext.Provider
      value={{
        screenColor,
        setScreenColor,
        screenPulseRate,
        setScreenPulseRate,
        screenPulseRateEnabled,
        setScreenPulseRateEnabled,
        flashlightPulseRate,
        setFlashlightPulseRate,
        flashlightPulseRateEnabled,
        setFlashlightPulseRateEnabled,
        bulbPulseRate,
        setBulbPulseRate,
        bulbPulseRateEnabled,
        setBulbPulseRateEnabled,
      }}>
      {children}
    </WakeUpContext.Provider>
  );
}

export function useWakeUpContext() {
  const context = useContext(WakeUpContext);
  if (context === undefined) {
    throw new Error(
      'useWakeUpContext can only be used inside WakeUpContextProvider',
    );
  }
  return context;
}
