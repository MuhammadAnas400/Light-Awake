import React, {useState} from 'react';

import Slider from '../../../../../components/Globals/Slider';
import Switch from '../../../../../components/Globals/Switch';

import {useWakeUpContext} from '../../../../../contexts/wake-up.context';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../../../styles/commonStyledComponents';
import {scaleWidth} from '../../../../../styles/scales';
import {pulseSettings} from '../../../../../constants/available-settings';

export default function BulbPulseRate() {
  const {
    bulbPulseRate,
    setBulbPulseRate,
    bulbPulseRateEnabled,
    setBulbPulseRateEnabled,
  } = useWakeUpContext();

  const handleSwitchValueChange = (value) => {
    setBulbPulseRateEnabled(value);
  };

  const handleSliderValueChange = (value) => {
    setBulbPulseRate(value);
  };

  return (
    <SettingContainer>
      <SettingHead>
        <Row>
          <SettingIcon
            source={require('../../../../../../assets/flashlight-icon.png')}
          />
          <SettingTitle>Use Bulb</SettingTitle>
        </Row>
        <Switch
          value={bulbPulseRateEnabled}
          onValueChange={(v) => handleSwitchValueChange(v)}
        />
      </SettingHead>
      {bulbPulseRateEnabled && (
        <SettingBody>
          <SettingSubTitleContainer>
            <SettingSubTitle>Bulb Flash Rate</SettingSubTitle>
          </SettingSubTitleContainer>
          <Slider
            step={bulbPulseRate || pulseSettings[0].name}
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
  flex-direction: column;
  align-items: flex-start;
`;

const SettingSubTitleContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 2px;
`;

const SettingSubTitle = styled(SettingTitle)`
  font-size: ${Math.min(scaleWidth(17), 17)}px;
`;
