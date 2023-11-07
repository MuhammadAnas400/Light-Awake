import {useEffect, useState} from 'react';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

export const useAlarm = (id, hasUpdated, timeFormat) => {
  const [alarm, setAlarm] = useState([]);

  useEffect(() => {
    async function getAlarm(id) {
      try {
        const params = {
          id: id,
          timeFormat: timeFormat,
        };
        const requestConfig = {
          params: params,
          method: method.get,
          url: `${connectionPath.alarms.showAlarm}`,
        };

        const response = await AxiosRequestHandler(requestConfig);

        if (response) {
          setAlarm(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getAlarm(id);
  }, [hasUpdated]);

  return {
    alarm,
  };
};
