import React, {useContext, useCallback, useState, useEffect} from 'react';
import {Platform} from 'react-native';
import * as Brightness from 'expo-brightness';
import {useAppState} from '../hooks/useAppState';

export const DeviceBrightnessContext = React.createContext();

export function DeviceBrightnessContextProvider({children}) {
  const [userDeviceBrightness, setUserDeviceBrightness] = useState();
  const [readyToChangeBrightness, setReadyToChangeBrightness] = useState(false);
  const appState = useAppState();

  useEffect(() => {
    if (userDeviceBrightness === undefined || appState === 'active') {
      setReadyToChangeBrightness(false);
      const readDeviceBrightness = async () => {
        const readedBrightness = await Brightness.getBrightnessAsync();
        setUserDeviceBrightness(readedBrightness);
        setReadyToChangeBrightness(true);
      };

      readDeviceBrightness();
    }
  }, [appState, userDeviceBrightness]);

  useEffect(() => {
    if (appState === 'background' && readyToChangeBrightness) {
      Brightness.setBrightnessAsync(userDeviceBrightness);
    }
  }, [appState, userDeviceBrightness, readyToChangeBrightness]);

  const restoreDeviceBrightness = useCallback(() => {
    if (userDeviceBrightness) {
      Platform.OS === 'ios'
        ? Brightness.setBrightnessAsync(userDeviceBrightness)
        : Brightness.useSystemBrightnessAsync();
    }
  }, [userDeviceBrightness]);

  useEffect(() => {
    return () => {
      restoreDeviceBrightness();
    };
  }, [restoreDeviceBrightness]);

  const restoreDeviceBrightnessWhenAppIsReady = useCallback(() => {
    if (readyToChangeBrightness) {
      restoreDeviceBrightness();
    }
  }, [readyToChangeBrightness, restoreDeviceBrightness]);

  return (
    <DeviceBrightnessContext.Provider
      value={{
        userDeviceBrightness,
        readyToChangeBrightness,
        restoreDeviceBrightnessWhenAppIsReady,
      }}>
      {children}
    </DeviceBrightnessContext.Provider>
  );
}

export function useDeviceBrightnessContext() {
  const context = useContext(DeviceBrightnessContext);
  if (context === undefined) {
    throw new Error(
      'useDeviceBrightnessContext can only be used inside DeviceBrightnessContext.Provider',
    );
  }
  return context;
}
