import {useEffect, useState} from 'react';
import {useHomeId} from '../../../hooks/useHomeId';
import {getHomeDetail} from '@volst/react-native-tuya';

export function useDevices(isRefresh, setIsRefresh, params) {
  const {homeId, getHomeId} = useHomeId();
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      await getHomeId();
    }

    fetch();
  }, []);

  useEffect(() => {
    async function getHomeDevicesApi() {
      try {
        // Must fetch data from Tuya for updated lists of online devices(bulbs)
        const homeDetail = await getHomeDetail({homeId: homeId}),
          {deviceList} = homeDetail;
        const sortedBulbs = sortBulbs(deviceList);
        setDevices(sortedBulbs);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (homeId != null) {
      getHomeDevicesApi(homeId);
    }

    if (isRefresh) {
      setLoading(true);
      setIsRefresh(false);
    }
  }, [homeId, isRefresh, params]);

  function sortBulbs(devices) {
    let bulbs = [];

    Object.keys(devices).map(
      (val) => devices[val].isOnline && bulbs.push(devices[val]),
    );

    const sortedBulbs = bulbs.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });

    return sortedBulbs;
  }

  return {devices, loading, error};
}
