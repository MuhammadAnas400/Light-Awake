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

export default function FlashlightPulseRate() {
  const {
    flashlightPulseRate,
    setFlashlightPulseRate,
    flashlightPulseRateEnabled,
    setFlashlightPulseRateEnabled,
  } = useWakeUpContext();

  const handleSwitchValueChange = (value) => {
    setFlashlightPulseRateEnabled(value);
  };

  const handleSliderValueChange = (value) => {
    setFlashlightPulseRate(value);
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
          value={flashlightPulseRateEnabled}
          onValueChange={(v) => handleSwitchValueChange(v)}
        />
      </SettingHead>
      {flashlightPulseRateEnabled && (
        <SettingBody>
          <Slider
            step={flashlightPulseRate || pulseSettings[0].name}
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
