import React, {useState} from 'react';
import {send} from '@volst/react-native-tuya';
import Switch from '../../../components/Globals/Switch';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../styles/commonStyledComponents';
import {Toast} from '../../../components/Globals/Toast';

const ChangeBulbLightOnOff = ({device}) => {
  const [light, setLight] = useState(device?.dps[20]);

  const handleSwitch = () => {
    lightOnOff();
  };

  async function lightOnOff() {
    setLight(!light);

    try {
      await send({
        devId: device.devId,
        command: {
          20: !light,
        },
      });
    } catch (error) {
      Toast('Error', error, 'danger', 'danger');
    }
  }

  return (
    <SettingContainer>
      <SettingHead>
        <Row>
          <SettingIcon
            source={require('../../../../assets/flashlight-icon.png')}
          />
          <SettingTitle>Turn Bulb {light ? 'Off' : 'On'}</SettingTitle>
        </Row>
        <Switch value={light} onValueChange={handleSwitch} />
      </SettingHead>
    </SettingContainer>
  );
};

export default ChangeBulbLightOnOff;
