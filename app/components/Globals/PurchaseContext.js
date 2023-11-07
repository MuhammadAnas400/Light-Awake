/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {createContext, useState, useContext, useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import AxiosRequestHandler, {
  connectionPath,
  LIGHTAWAKE_BASE_URL,
  method,
} from '../../network/AxiosRequestHandler';
import {Toast} from '../Globals/Toast';
import {useIAP} from 'react-native-iap';

const PurchaseContext = createContext();

export const PurchaseProvider = ({children}) => {
  const {currentPurchase, finishTransaction} = useIAP();
  const [audioPurchaseComplete, setAudioPurchaseComplete] = useState(false);
  const [alarmPurchaseComplete, setAlarmPurchaseComplete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function redownloadPurchasedTrack(product) {
    const {audio} = await getPurchasedAudio(product);
    await checkPermission();
    const {path, id} = await download(audio);
    updateIapUrl(path, id);
  }

  useEffect(() => {
    const checkCurrentPurchase = async (purchase) => {
      setAudioPurchaseComplete(false);
      setAlarmPurchaseComplete(false);
      console.log('Purchase: ', purchase);

      const receipt = purchase.transactionReceipt;

      if (receipt) {
        try {
          const isConsumable = false;
          const ackResult = await finishTransaction({
            purchase,
            isConsumable,
          });
          console.log('ackResult', ackResult);
          await handlePurchase(purchase);
        } catch (ackErr) {
          console.warn('ackErr', ackErr);
          setAudioPurchaseComplete(true);
          setAlarmPurchaseComplete(true);
        }
      }
    };
    if (currentPurchase) {
      console.log('Calling checkCurrentPurchase:', currentPurchase);
      checkCurrentPurchase(currentPurchase);
    }
  }, [currentPurchase]);

  const handlePurchase = async (purchase) => {
    console.log(purchase.productId);
    if (purchase && purchase.productId !== 'preset_alarm') {
      console.log('Handle Purchase', purchase);
      const product = await createPurchase(purchase);
      await checkPermission();
      const {path, id} = await download(product);
      await updateIapUrl(path, id);
      return setAudioPurchaseComplete(true);
    } else if (purchase.productId === 'preset_alarm') {
      await createPurchase(purchase);
      return setAlarmPurchaseComplete(true);
    } else {
      return console.log('handlePurchase Error...');
    }
  };

  async function createPurchase(purchase) {
    console.log('Create Purchase', purchase);
    if (purchase && purchase.productId !== 'preset_alarm') {
      try {
        const data = {
          receipt: purchase.transactionReceipt,
          product_identifier: purchase.productId,
          iap_type: 'Audio',
          device_type: Platform.OS,
        };
        const requestConfig = {
          data: data,
          method: method.post,
          url: `${connectionPath.iaps.purchaseProduct}`,
        };

        console.log('Request Config', requestConfig);
        const response = await AxiosRequestHandler(requestConfig);
        const product = response.data.purchase;
        return product;
      } catch (error) {
        console.log(error);
      }
    } else if (purchase && purchase.productId === 'preset_alarm') {
      try {
        console.log('Product ID:', purchase.productId);
        const data = {
          receipt: purchase.transactionReceipt,
          product_identifier: purchase.productId,
          iap_type: 'Alarm',
        };
        const requestConfig = {
          data: data,
          method: method.post,
          url: `${connectionPath.iaps.purchaseProduct}`,
        };

        console.log('Alarm Request Config', requestConfig);
        const response = await AxiosRequestHandler(requestConfig);

        if (response) {
          Toast('Success', 'Download successful!', 'success', 'success');
          return null;
        }
      } catch (error) {
        console.log('Error creating alarm upgrade:', error);
      }
    } else {
      return console.log('createPurchase Error...');
    }
  }

  async function getPurchasedAudio(product) {
    try {
      const params = {
        product_identifier: product.product_identifier,
      };
      const requestConfig = {
        params: params,
        method: method.get,
        url: connectionPath.audios.getAudio,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        const {data} = response;
        const {audio} = data;
        return {audio};
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkPermission = async () => {
    console.log('Checking Permission...');
    if (Platform.OS === 'ios') {
      return {permission: true};
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message:
            'LightAwake needs access to your storage to download the track.',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return {permission: true};
      } else {
        // eslint-disable-next-line no-alert
        return alert('Storage Permission Not Granted.');
      }
    } catch (error) {
      console.log(error);
      return Toast('Error', error, 'danger', 'danger');
    }
  };

  async function download(product) {
    if (isDownloading) {
      console.log('Downloading in progress...');
      return Toast('Error', 'Download in Progress...', 'danger', 'danger');
    }

    console.log('Purchase Downloading...');
    setIsDownloading(true);
    let date = new Date();
    const {config, fs} = ReactNativeBlobUtil;
    let directory = Platform.select({
      android: fs.dirs.SDCardApplicationDir,
      ios: fs.dirs.DocumentDir,
    });

    let options = Platform.select({
      android: {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          path:
            directory +
            '/' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            '.mp3',
          description: 'Track',
        },
      },
      ios: {
        fileCache: true,
        path: `${directory}/${Math.floor(
          date.getTime() + date.getSeconds() / 2,
        )}.mp3`,
      },
    });

    try {
      const response = await config(options)
        .fetch('GET', `${LIGHTAWAKE_BASE_URL}${product.track}`)
        .progress({count: 0.1}, (received, total) => {
          console.log('Progress: ', received / total);
        })
        .catch((error) => {
          console.log('DOWNLOAD ERROR: ' + error);
          return {path: null, id: null};
        });

      const {path} = response;
      const {id} = product;
      console.log('ID: ', {id});

      setIsDownloading(false);
      return {path, id};
    } catch (error) {
      console.log(error);
      setIsDownloading(false);
      return Toast(
        'Error',
        'Oops, something went wrong. Try again.',
        'danger',
        'danger',
      );
    }
  }

  async function updateIapUrl(path, id) {
    console.log('Updating URL...');
    try {
      const params = {
        id: id,
        track_url: path(),
      };
      const requestConfig = {
        params: params,
        method: method.put,
        url: connectionPath.iaps.updateUrl,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        Toast('Success', 'Download successful!', 'success', 'success');
        return {downloaded: true};
      }
    } catch (error) {
      console.log(error);
      Toast(
        'Error!',
        'Oops, something went wrong. Try again.',
        'danger',
        'danger',
      );
    }
  }

  return (
    <PurchaseContext.Provider
      value={{
        audioPurchaseComplete,
        alarmPurchaseComplete,
        getPurchasedAudio,
        redownloadPurchasedTrack,
      }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseHandling = () => useContext(PurchaseContext);
