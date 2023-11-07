import {useEffect, useState} from 'react';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

export const useTrackSettings = (audio_type, dependencies) => {
  const [trackSettings, setTrackSettings] = useState([]);

  useEffect(() => {
    async function getUserAudios() {
      try {
        const params = {};
        const requestConfig = {
          params: params,
          method: method.get,
          url: `${connectionPath.users.getAudios}`,
        };

        const response = await AxiosRequestHandler(requestConfig);

        if (response) {
          console.log('Latest Response', response.data.audios);
          const {audios} = response.data;
          const purchasedSounds = audios.filter(
            (element) => element.audio.audio_type === audio_type,
          );

          setTrackSettings(purchasedSounds);
        }
      } catch (error) {
        console.log('Track Error', error);
      }
    }

    getUserAudios();
  }, [dependencies]);

  return {
    trackSettings,
  };
};
