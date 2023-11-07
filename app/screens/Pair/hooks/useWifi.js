import {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import Geolocation from '@react-native-community/geolocation';
import {storeAsyncStorageData} from '../../../constants/utils';
import StorageProperty from '../../../constants/storage-property';

export function useWifi() {
  const [wifiSsids, setWifiSsids] = useState({});
  const [wifiSsid, setWifiSsid] = useState('');

  console.log(wifiSsid);

  const handleSetWifi = (ssid) => {
    setWifiSsid(ssid);
  };

  function requestLocationAuthorizationIos() {
    Geolocation.requestAuthorization();

    getIosWifi();
  }

  function getIosWifi() {
    WifiManager.getCurrentWifiSSID().then(
      (ssid) => {
        setWifiSsid(ssid);
        storeAsyncStorageData(StorageProperty.WIFI_NAME, `${ssid}`);
      },
      () => {
        setWifiSsid('');
      },
    );
  }

  async function requestLocationAuthorizationAndroid() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'LightAwake Access Location Permission',
        message:
          'Allow to LightAwake use Location Services information as needed.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    getAndroidWifi();
  }

  function getAndroidWifi() {
    WifiManager.loadWifiList().then((ssid) => {
      setWifiSsids(ssid);
      storeAsyncStorageData(StorageProperty.WIFI_NAME, `${ssid}`);
    });

    // workaround in case ssid is empty
    WifiManager.getCurrentWifiSSID().then((ssid) => {
      setWifiSsid(ssid);
      useEffect(() => {
        console.log('wifiSet')
        storeAsyncStorageData(StorageProperty.WIFI_NAME, `${ssid}`);
      }, []);
    });
  }

  return {
    wifiSsids,
    wifiSsid,
    requestLocationAuthorizationIos,
    requestLocationAuthorizationAndroid,
    getIosWifi,
    getAndroidWifi,
    handleSetWifi,
    setWifiSsid,
  };
}
