import React, {createContext, useContext, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Toast} from './Toast';
import {getAsyncStorageData} from '../../constants/utils';
import StorageProperty from '../../constants/storage-property';
import Geolocation from '@react-native-community/geolocation';

const NetworkInfoContext = createContext();

NetInfo.configure({
  shouldFetchWiFiSSID: true,
});

Geolocation.requestAuthorization();

export const NetworkInfoProvider = ({children}) => {
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [storedWifi, setStoredWifi] = useState('');
  const [lastToastMessage, setLastToastMessage] = useState('');

  // Fetch stored Wifi
  useEffect(() => {
    async function getWifiName() {
      const storedWifiName = await getAsyncStorageData(
        StorageProperty.WIFI_NAME,
      );
      setStoredWifi(storedWifiName);
    }
    getWifiName();
  }, []);

  useEffect(() => {
    let isFirstRun = true;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (isFirstRun) {
        isFirstRun = false;
      } else {
        if (state.isConnected && state.details && state.details.ssid) {
          setConnectionInfo(state);
        } else if (state.isConnected) {
          setConnectionInfo(state);
        } else {
          setConnectionInfo(state);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [connectionInfo]);

  useEffect(() => {
    if (connectionInfo && storedWifi) {
      let toastMessage = '';

      if (connectionInfo.type !== 'wifi') {
        toastMessage = 'Wifi Not Detected';
      } else if (connectionInfo.details.ssid !== storedWifi) {
        toastMessage = 'Network Change Detected';
      } else if (connectionInfo.isConnected === false) {
        toastMessage = 'Network Not Detected';
      } else if (
        connectionInfo.isConnected === true &&
        connectionInfo.type === 'wifi'
      ) {
        toastMessage = 'Network Detected';
      }

      if (toastMessage && toastMessage !== lastToastMessage) {
        setLastToastMessage(toastMessage);
        Toast(
          toastMessage === 'Network Detected' ? 'Success' : 'Error',
          toastMessage,
          toastMessage === 'Network Detected' ? 'success' : 'danger',
          toastMessage === 'Network Detected' ? 'success' : 'danger',
        );
      }
    }
  }, [connectionInfo, storedWifi, lastToastMessage]);

  return (
    <NetworkInfoContext.Provider value={{storedWifi}}>
      {children}
    </NetworkInfoContext.Provider>
  );
};

export const useNetworkInfo = () => useContext(NetworkInfoContext);
