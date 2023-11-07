import React, {useContext, useEffect, useRef, useState} from 'react';
import StorageProperty from '../constants/storage-property';
import {getAsyncStorageData, storeAsyncStorageData} from '../constants/utils';

export const BulbContext = React.createContext();

const defaultContext = {
  homeId: 74172521,
};

export function BulbContextProvider({children}) {
  const [homeId, setHomeId] = useState(defaultContext.homeId);

  const loadedStoreProperties = useRef(false);

  useEffect(() => {
    async function loadStateFromStorage() {
      const storageValues = await Promise.all([
        getAsyncStorageData(StorageProperty.TUYA_HOME_ID),
      ]);

      setHomeId(storageValues[0] ?? defaultContext.homeId);

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
    store(StorageProperty.TUYA_HOME_ID, homeId);
  }, [homeId]);

  return (
    <BulbContext.Provider
      value={{
        homeId,
        setHomeId,
      }}>
      {children}
    </BulbContext.Provider>
  );
}

export function useBulbContext() {
  const context = useContext(BulbContext);
  if (context === undefined) {
    throw new Error(
      'useBulbContext can only be used inside BulbContextProvider',
    );
  }
  return context;
}
