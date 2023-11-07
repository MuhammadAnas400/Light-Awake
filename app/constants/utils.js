import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAsyncStorageData = async (storageKey, storedValue) => {
  try {
    await AsyncStorage.setItem(storageKey, storedValue);
  } catch (e) {
    console.error(
      `Error while saving to AsyncStorage key:${storageKey} value:${storedValue}`,
      e,
    );
  }
};

export const getAsyncStorageData = async (storageKey) => {
  try {
    return await AsyncStorage.getItem(storageKey);
  } catch (e) {
    console.error(`Error while saving to AsyncStorage ${storageKey}`, e);
    return null;
  }
};

export const removeAsyncStorageData = async (storageKey) => {
  try {
    return await AsyncStorage.removeItem(storageKey);
  } catch (e) {
    console.error(`Error while saving to AsyncStorage ${storageKey}`, e);
    return null;
  }
};

export const formatTo24hFormat = (hours, minutes) => {
  const hoursIn24hFormat = hours === 0 ? 24 : hours;
  return {
    timeToDisplay: `${hoursIn24hFormat.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`,
    period: null,
  };
};

export const formatTo12hFormat = (hours, minutes) => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const reducedHours = hours % 12;
  const hoursIn12hFormat = reducedHours === 0 ? 12 : reducedHours;
  return {
    timeToDisplay: `${hoursIn12hFormat.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`,
    period,
  };
};
