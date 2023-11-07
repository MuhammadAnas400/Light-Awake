import {useState} from 'react';
import StorageProperty from '../constants/storage-property';
import {getAsyncStorageData, storeAsyncStorageData} from '../constants/utils';

export function useActiveBulbs() {
  const [activeBulbs, setActiveBulbs] = useState();

  async function getActivatedDevices() {
    const activeBulbsFromAsyncStorage = JSON.parse(
      await getAsyncStorageData(StorageProperty.ACTIVE_DEVICE),
    );
    setActiveBulbs(activeBulbsFromAsyncStorage);
    return {activeBulbsFromAsyncStorage};
  }

  async function setActivatedDevices(activeDevice) {
    storeAsyncStorageData(
      StorageProperty.ACTIVE_DEVICE,
      `${JSON.stringify(activeDevice)}`,
    ).then(() => {
      setActiveBulbs(activeDevice);
    });
  }
  
  return [activeBulbs, {getActivatedDevices, setActivatedDevices}];
}