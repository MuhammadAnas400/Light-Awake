import {
  initActivator,
  send,
  getCurrentUser,
  loginWithEmail,
  logout,
  getHomeDetail,
} from '@volst/react-native-tuya';
import {useEffect, useState} from 'react';
import {useActiveBulbs} from './useActiveBulbs';
import {useHomeId} from './useHomeId';

export function useTuyaServices() {
  const [activeBulbs, {getActivatedDevices}] = useActiveBulbs();
  const {homeId, getHomeId} = useHomeId();

  useEffect(() => {
    async function fetch() {
      await getHomeId();
    }

    fetch();
  }, []);

  useEffect(() => {
    async function getActiveBulbs() {
      await getActivatedDevices();
    }

    getActiveBulbs();
  }, []);

  async function turnBulbOff(type) {
    if (type === 'inactive') {
      const homeDetail = await getHomeDetail({homeId: homeId}),
        {deviceList} = homeDetail;

      sendCommand(deviceList, false);
    }

    sendCommand(activeBulbs, false);
  }

  async function turnBulbOn() {
    sendCommand(activeBulbs, true);
  }

  async function pair(wifiSsid, wifiPw) {
    await initActivator({
      homeId: homeId,
      ssid: wifiSsid,
      password: wifiPw,
      time: 300,
      type: 'TY_EZ',
    });
  }

  async function sendCommand(bulbs, light) {
    for (let index = 0; index < bulbs.length; index++) {
      const bulb = bulbs[index];
      try {
        await send({
          devId: bulb.devId,
          command: {
            20: light,
          },
        });
      } catch (error) {
        await send({
          devId: bulb.devId,
          command: {
            20: light,
          },
        });
      }
    }
  }

  async function loginTuya() {
    const user = await getCurrentUser();

    if (user) {
      const result = await logout();
      console.log('====================================');
      console.log('logging out ', result);
      console.log('====================================');
    }

    const result = await loginWithEmail({
      countryCode: '1',
      email: 'lightawaketuya@gmail.com',
      password: 'Password',
    });

    console.log('====================================');
    console.log('logging in ', result);
    console.log('====================================');
  }

  return {pair, turnBulbOn, turnBulbOff, loginTuya};
}
