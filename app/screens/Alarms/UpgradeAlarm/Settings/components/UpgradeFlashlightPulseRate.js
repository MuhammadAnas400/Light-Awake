import React, {useState, useEffect} from 'react';

import Slider from '../../../../../components/Globals/Slider';
import Switch from '../../../../../components/Globals/Switch';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../../../styles/commonStyledComponents';

import {pulseSettings} from '../../../../../constants/available-settings';

import updateAlarmDetails from '../../helper/updateAlarmDetails';

export default function UpgradeFlashlightPulseRate({
  alarm,
  hasUpdated,
  setHasUpdated,
}) {
  const [screenFlashlightRate, setScreenFlashlightRate] = useState(); // screen pulse rate fetched from api
  const [screenFlashlightRateEnabled, setScreenFlashlightRateEnabled] =
    useState(false); // screen pulse rate enabled fetched from api

  useEffect(() => {
    setScreenFlashlightRate(alarm?.flashlight_pulse_rate);
    setScreenFlashlightRateEnabled(alarm?.flashlight_pulse_rate_enabled);
  }, [alarm]);

  const handleSwitchValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'flashlight_pulse_rate_enabled', value).then(
      () => {
        setScreenFlashlightRateEnabled(!screenFlashlightRateEnabled);
        setHasUpdated(!hasUpdated);
      },
    );
  };

  const handleSliderValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'flashlight_pulse_rate', value).then(() => {
      setHasUpdated(!hasUpdated);
    });
  };

  return (
    <SettingContainer>
      <SettingHead>
        <Row>
          <SettingIcon
            source={require('../../../../../../assets/flashlight-icon.png')}
          />
          <SettingTitle>Camera LED Flash Rate</SettingTitle>
        </Row>
        <Switch
          value={alarm?.flashlight_pulse_rate_enabled}
          onValueChange={(v) => handleSwitchValueChange(v)}
        />
      </SettingHead>
      {screenFlashlightRateEnabled && (
        <SettingBody>
          <Slider
            step={screenFlashlightRate || pulseSettings[0].name}
            onStepChange={(v) => handleSliderValueChange(v)}
            labels={pulseSettings.map((setting) => setting.name)}
          />
        </SettingBody>
      )}
    </SettingContainer>
  );
}

const SettingBody = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
