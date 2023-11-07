import {useState, useEffect} from 'react';
import {useIAP} from 'react-native-iap';
import {Toast} from '../../../components/Globals/Toast';
import {sleepAudioIdentifiers} from '../../../constants';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

export const useSleepAudios = (hasSleepAudiosPurchased) => {
  const [sleepAudios, setSleepAudios] = useState([]);
  const [loader, setLoader] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const {connected, products, getProducts} = useIAP();

  useEffect(() => {
    fetchProducts();
  }, [hasSleepAudiosPurchased]);

  useEffect(() => {
    if (products.length === 0) {
      return setSleepAudios([]);
    }

    get(products);
  }, [hasFetched]);

  async function fetchProducts() {
    setLoader(true);

    if (connected) {
      await getProducts({skus: sleepAudioIdentifiers});
    }

    setHasFetched(!hasFetched);
  }

  async function get(products) {
    try {
      const data = {
        products: products,
        audio_type: 'sleep_sound',
      };
      const requestConfig = {
        data: data,
        method: method.post,
        url: `${connectionPath.audios.getAudios}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        sortSleepAudios(response.data.audios);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function sortSleepAudios(audios) {
    const purchased_sleep_audio = [];

    audios.forEach((audio) => {
      if (audio.is_purchased) {
        purchased_sleep_audio.push(audio);
      }
    });

    audios.forEach((audio) => {
      if (!audio.is_purchased) {
        purchased_sleep_audio.push(audio);
      }
    });

    setSleepAudios(purchased_sleep_audio);
    setLoader(false);
  }
  return {
    sleepAudios,
    loader,
    setLoader,
  };
};
