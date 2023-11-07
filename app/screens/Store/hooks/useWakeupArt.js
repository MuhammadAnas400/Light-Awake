import {useState, useEffect} from 'react';
import IAP from 'react-native-iap';
import {Toast} from '../../../components/Globals/Toast';
import {wakeupArtIdentifiers} from '../../../constants';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

export const useWakeupArts = (deps) => {
  const [wakeupArts, setWakeupArts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [deps]);

  function fetchProducts() {
    IAP.getProducts(wakeupArtIdentifiers)
      .then((response) => {
        editResponse(response);
      })
      .catch((error) => {
        Toast('Error', error.message, 'danger', 'danger');
      });

    function editResponse(art) {
      const response = [];

      for (let index = 0; index < art.length; index++) {
        response[index] = {
          productId: art[index].productId,
          description: description(art[index].productId),
          localizedPrice: art[index].localizedPrice,
        };
      }

      function description(productId) {
        const descriptionOf = {
          '01_wakeup_art':
            'There is no comfort in the growth zone and no growth in the comfort zone.',
          '02_wakeup_art':
            "Don't wait until you've reached your goal to be proud of yourself. Be proud of every step you take toward reaching that goal.",
          '03_wakeup_art':
            'Motivation is what gets you started. Habit is what keeps you going.',
          '04_wakeup_art': 'You are stronger than you think.',
          '05_wakeup_art':
            'May the next few months be a period of magnificent transformation.',
          '06_wakeup_art':
            "The only bad workout is the one that didn't happen.",
          '07_wakeup_art':
            'Challenging yourself every day is one of the most exciting ways to live.',
        };

        return descriptionOf[productId];
      }

      fetch(response);
    }

    async function fetch(products) {
      try {
        const data = {
          products: products,
        };
        const requestConfig = {
          data: data,
          method: method.post,
          url: `${connectionPath.arts.getWakeupArts}`,
        };

        const response = await AxiosRequestHandler(requestConfig);

        if (response) {
          console.log(response);
          sortWakeupArts(response.data.arts);
        }
      } catch (error) {
        fetch(products);
      }
    }

    function sortWakeupArts(arts) {
      const purchased_wakeup_arts = [];

      arts.forEach((art) => {
        if (art.is_purchased) {
          purchased_wakeup_arts.push(art);
        }
      });

      arts.forEach((art) => {
        if (!art.is_purchased) {
          purchased_wakeup_arts.push(art);
        }
      });

      setWakeupArts(purchased_wakeup_arts);
    }
  }

  return {
    wakeupArts,
  };
};
