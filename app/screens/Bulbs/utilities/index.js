import {useState} from 'react';
import {useAsync} from '../../../hooks/useAsync';
import {
  getAsyncStorageData,
  storeAsyncStorageData,
} from '../../../constants/utils';
import StorageProperty from '../../../constants/storage-property';

export default function utilities(params) {
  const [activeDevices, setActiveDevices] = useState([]);

  function checker(device) {
    var found = response?.find((element) => element.devId === device.devId);

    if (found) {
      return true;
    } else {
      return false;
    }
  }

  async function activateDevice(device) {
    activeDevices.push(device);
    setActiveDevices([device]);

    const result = await storeActiveDevicesApi();

    return result;
  }

  async function deactivateDevice(device) {
    var active = activeDevices.filter((item) => item.devId !== device.devId);
    setActiveDevices([active]);

    const result = await storeActiveDevicesApi();

    return result;
  }

  async function storeActiveDevicesApi() {
    const result = await storeAsyncStorageData(
      StorageProperty.ACTIVE_DEVICE,
      `${JSON.stringify(activeDevices)}`,
    );

    return result;
  }

  async function getActiveDevicesApi() {
    const result = await getAsyncStorageData(StorageProperty.ACTIVE_DEVICE);
    return JSON.parse(result);
  }

  const activeBulbs = useAsync(getActiveDevicesApi, [], [], true),
    {response} = activeBulbs;

  return {
    checker,
    activateDevice,
    deactivateDevice,
  };
}
