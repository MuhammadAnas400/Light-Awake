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

export default function UpgradeScreenPulseRate({
  alarm,
  hasUpdated,
  setHasUpdated,
}) {
  const [screenWakeUpRate, setScreenWakeUpRate] = useState(); // screen pulse rate fetched from api
  const [screenWakeUpRateEnabled, setScreenWakeUpRateEnabled] = useState(false); // screen pulse rate enabled fetched from api

  useEffect(() => {
    setScreenWakeUpRate(alarm?.screen_pulse_rate);
    setScreenWakeUpRateEnabled(alarm?.screen_pulse_rate_enabled);
  }, [alarm]);

  const handleSwitchValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'screen_pulse_rate_enabled', value).then(
      () => {
        setScreenWakeUpRateEnabled(!screenWakeUpRateEnabled);
        setHasUpdated(!hasUpdated);
      },
    );
  };

  const handleSliderValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'screen_pulse_rate', value).then(() => {
      setHasUpdated(!hasUpdated);
    });
  };

  return (
    <SettingContainer>
      <SettingHead>
        <Row>
          <SettingIcon
            source={require('../../../../../../assets/interval-picker-icon.png')}
          />
          <SettingTitle>Screen Wake Up Flash Rate</SettingTitle>
        </Row>
        <Switch
          value={screenWakeUpRateEnabled}
          onValueChange={(v) => handleSwitchValueChange(v)}
        />
      </SettingHead>
      {screenWakeUpRateEnabled && (
        <SettingBody>
          <Slider
            step={screenWakeUpRate || pulseSettings[0].name}
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
