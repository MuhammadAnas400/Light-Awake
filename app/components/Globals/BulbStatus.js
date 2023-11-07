import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    getHomeDetail,
    registerDevListener,
    unRegisterAllDevListeners
  } from '@volst/react-native-tuya';
import {useHomeId} from '../../hooks/useHomeId';
import StorageProperty from '../../constants/storage-property';
import {getAsyncStorageData,} from '../../constants/utils';

const BulbStatusContext = createContext();

export const BulbStatusProvider = ({ children }) => {
  const [activeDevice, setActiveDevice] = useState([]);
//   const [inactiveDevice, setInactiveDevice] = useState(null);
  const [bulbStatus, setBulbStatus] = useState(null);
//   const eventType = 'onStatusChanged';

useEffect(() => {
    async function getStoredDevice() {
      const activeDevice = await getAsyncStorageData(
        StorageProperty.ACTIVE_DEVICE,
    );
    setActiveDevice(activeDevice);
    }
    getStoredDevice() 
},[]);

// useEffect(() => {
//   if (activeDevice !== null || undefined || []) {
//     let decoded = JSON.parse(activeDevice);
//     console.log(decoded[0].devId);
//     let devId = decoded[0].devId
//     registerDevListener({devId: devId}, 'onStatusChanged', (data) => {
//       console.log('listening');
//       console.log(data);
//     })
//   }
// }, [])


// if (activeDevice !== null || activeDevice !== undefined || activeDevice !== []){
//   let decoded = JSON.parse(activeDevice);
//   registerDevListener({devId: decoded[0].devId, type: eventType, callback: (data) => {
//     console.log(data);
//     setBulbStatus('offline');
//     setInactiveDevice(...inactiveDevice, device);
//     return Toast(
//       'Error',
//       `${device.name} Not Detected`,
//       'danger',
//       'danger',
//       );
//   }})    
//   };


// useEffect(() => {
  
// }, [])

// useEffect(() => {
  
//   if (activeDevice) {
    
//     // decoded.forEach((device) => {
//     //   console.log(device);
//     //   registerDevListener({devId: device.devId}, eventType, (data) => {
//     //     console.log(data);
//     //     setBulbStatus('offline');
//     //     setInactiveDevice(...inactiveDevice, device);
//     //     return Toast(
//     //       'Error',
//     //       `${device.name} Not Detected`,
//     //       'danger',
//     //       'danger',
//     //       );
//     //   });
//     // });
//   }
//   // if (inactiveDevice) {
//   //   let decoded = JSON.parse(inactiveDevice);
//   //   decoded.forEach((device) => {
//   //     registerDevListener({devId: device.devId}, eventType, (data) => {
//   //       console.log(data);
//   //       setBulbStatus('online');
//   //       return Toast(
//   //         'Success',
//   //         `${device.name} Detected`,
//   //         'success',
//   //         'success',
//   //         );
//   //     });
//   //   });
//   // }

//   // return () => {
//   //   unRegisterAllDevListeners();
//   // };
  
// }, []);

  return (
    <BulbStatusContext.Provider value={bulbStatus}>
      {children}
    </BulbStatusContext.Provider>
  );
    
}

export const useBulbStatus = () => useContext(BulbStatusContext);

    // const {homeId, getHomeId} = useHomeId();
    // const [devices, setDevices] = useState(null);
    // const [error, setError] = useState(null);
    // const [bulbStatus, setBulbStatus] = useState(null);
    // const eventType = 'onStatusChanged';

    // useEffect(() => {
    //     async function fetch() {
    //       await getHomeId();
    //     }
    
    //     fetch();
    //   }, []);
    
    //   useEffect(() => {
    //     async function getHomeDevicesApi() {
    //       try {
    //         // Must fetch data from Tuya for updated lists of online devices(bulbs)
    //         console.log(homeId);
    //         const homeDetail = await getHomeDetail({homeId: homeId}),
    //           {deviceList} = homeDetail;
    //           console.log(deviceList)
    //         setDevices(deviceList);
    //       } catch (error) {
    //         setError(error);
    //     }
    // }
    //     if (homeId != null) {
    //         getHomeDevicesApi(homeId);
    //       }

    // }, [homeId]);

    // useEffect(() => {
    //     if (devices) {
    //         devices.forEach(device => {
    //             console.info(`DEVICE ${device}`);
    //             registerDevListener({devId: device.devId}, eventType, (data) => {
    //                 console.log(data);
    //                 console.log('test')
    //             })
    //         })
        
    //     return () => {
    //         unRegisterAllDevListeners();
    //     };
    //     }
    // }, [devices,])

    // return (
    //     <BulbStatusContext.Provider value={bulbStatus}>
    //         {children}
    //     </BulbStatusContext.Provider>
    // );