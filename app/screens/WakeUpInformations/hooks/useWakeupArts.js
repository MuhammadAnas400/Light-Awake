import {useEffect, useState} from 'react';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

export const useWakeupArts = () => {
  const [wakeupArts, setWakeupArts] = useState([]);

  useEffect(() => {
    async function getUserWakeupArts() {
      try {
        const params = {};
        const requestConfig = {
          params: params,
          method: method.get,
          url: `${connectionPath.users.getArts}`,
        };

        const response = await AxiosRequestHandler(requestConfig);

        if (response) {
          const {arts} = response.data;

          setWakeupArts(arts);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserWakeupArts();
  }, []);

  return {
    wakeupArts,
  };
};
