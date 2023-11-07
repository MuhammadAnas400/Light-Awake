import {useState, useEffect} from 'react';
import {useIAP} from 'react-native-iap';
import {
  hardOfHearingAlarmSoundIdentifiers,
  industrialSoundsAlarmSoundIdentifiers,
  musicAlarmSoundIdentifiers,
  natureSoundsAlarmSoundIdentifiers,
  poetryAlarmSoundIdentifiers,
} from '../../../constants';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

export const useAlarmAudios = (hasAlarmAudiosPurchased, category) => {
  const [audios, setAudios] = useState([]);
  const [loader, setLoader] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const {connected, products, getProducts} = useIAP();

  useEffect(() => {
    if (products.length === 0) {
      return setAudios([]);
    }

    get(products);
  }, [hasFetched]);

  useEffect(() => {
    fetchProducts();
  }, [hasAlarmAudiosPurchased, category]);

  async function get(products) {
    try {
      const data = {
        products: products,
        audio_type: 'alarm_sound',
        alarm_sound_type: category,
      };
      const requestConfig = {
        data: data,
        method: method.post,
        url: `${connectionPath.audios.getAudios}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        sortAudios(response.data.audios);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProducts() {
    const identifiers = {
      Music: musicAlarmSoundIdentifiers,
      Poetry: poetryAlarmSoundIdentifiers,
      'Nature Sounds': natureSoundsAlarmSoundIdentifiers,
      'Industrial Sounds': industrialSoundsAlarmSoundIdentifiers,
      'Hard of Hearing': hardOfHearingAlarmSoundIdentifiers,
    };

    setLoader(true);

    if (
      //workaround for fetching IAP on Android
      category === 'Poetry'
    ) {
      setAudios([]);
      setLoader(false);
      return;
    }

    if (connected) {
      await getProducts({skus: identifiers[category]});
    }

    setHasFetched(!hasFetched);
  }

  function sortAudios(audios) {
    const purchased_audio = [];

    audios.forEach((audio) => {
      if (audio.is_purchased) {
        purchased_audio.push(audio);
      }
    });

    audios.forEach((audio) => {
      if (!audio.is_purchased) {
        purchased_audio.push(audio);
      }
    });

    setAudios(purchased_audio);
    setLoader(false);
  }

  return {
    audios,
    loader,
    setLoader,
  };
};