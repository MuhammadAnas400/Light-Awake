import React from 'react';

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

import {useWakeUpContext} from '../../../../../contexts/wake-up.context';

import {pulseSettings} from '../../../../../constants/available-settings';

export default function ScreenPulseRate() {
  const {
    screenPulseRate,
    setScreenPulseRate,
    screenPulseRateEnabled,
    setScreenPulseRateEnabled,
  } = useWakeUpContext();

  const handleSwitchValueChange = (value) => {
    setScreenPulseRateEnabled(value);
  };

  const handleSliderValueChange = (value) => {
    setScreenPulseRate(value);
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
          value={screenPulseRateEnabled}
          onValueChange={(v) => handleSwitchValueChange(v)}
        />
      </SettingHead>
      {screenPulseRateEnabled && (
        <SettingBody>
          <Slider
            step={screenPulseRate || pulseSettings[0].name}
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
