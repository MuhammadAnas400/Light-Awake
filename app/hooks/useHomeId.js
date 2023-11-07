import {useState, useEffect} from 'react';

import DeviceInfo from 'react-native-device-info';
import {
  queryHomeList,
  createHome,
  dismissHome,
} from '@volst/react-native-tuya';

export function useHomeId() {
  const [homeId, setHomeId] = useState();

  async function getDeviceId() {
    const id = await DeviceInfo.getUniqueId();
    return id;
  }

  async function getHomeId() {
    const homeList = await queryHomeList();
    const deviceId = await getDeviceId();
    const home = homeList.find((home) => home.geoName === deviceId);

    if (home) {
      const {homeId} = home;

      setHomeId(homeId);
    } else {
      const result = await createHome({
        name: 'LightAwake',
        geoName: deviceId,
        lon: 0,
        lat: 0,
        rooms: ['LighAwake Room'],
      });

      if (result === 'success') {
        getHomeId();
      }
    }
  }

  return {homeId, getHomeId};
}
