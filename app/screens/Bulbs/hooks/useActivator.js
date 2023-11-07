import {useEffect} from 'react';
import {useActiveBulbs} from '../../../hooks/useActiveBulbs';

export default useActivator = () => {
  const [activeBulbs, {getActivatedDevices, setActivatedDevices}] =
    useActiveBulbs();

  useEffect(() => {
    getActivatedDevices();
  }, []);

  async function activateDevice(device) {
    var bulbs = [];
    bulbs.push(device);

    setActivatedDevices(bulbs);
  }

  async function deactivateDevice(device) {
    var activeDevices = activeBulbs.filter(
      (bulb) => bulb.devId !== device.devId,
    );

    setActivatedDevices(activeDevices);
  }

  return [{activateDevice, deactivateDevice}];
};
