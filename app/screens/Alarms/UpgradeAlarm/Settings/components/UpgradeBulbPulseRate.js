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
import {scaleWidth} from '../../../../../styles/scales';
import {pulseSettings} from '../../../../../constants/available-settings';

import updateAlarmDetails from '../../helper/updateAlarmDetails';

export default function UpgradeBulbPulseRate({
  alarm,
  hasUpdated,
  setHasUpdated,
}) {
  const [bulbRate, setBulbRate] = useState(); // bulb pulse rate fetched from api
  const [bulbRateEnabled, setBulbRateEnabled] = useState(false); // bulb pulse rate enabled fetched from api

  useEffect(() => {
    setBulbRate(alarm?.bulb_pulse_rate);
    setBulbRateEnabled(alarm?.bulb_pulse_rate_enabled);
  }, [alarm]);

  const handleSwitchValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'bulb_pulse_rate_enabled', value).then(() => {
      setBulbRateEnabled(!bulbRateEnabled);
      setHasUpdated(!hasUpdated);
    });
  };

  const handleSliderValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'bulb_pulse_rate', value).then(() => {
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
          <SettingTitle>Use Bulb</SettingTitle>
        </Row>
        <Switch
          value={bulbRateEnabled}
          onValueChange={(v) => handleSwitchValueChange(v)}
        />
      </SettingHead>
      {bulbRateEnabled && (
        <SettingBody>
          <SettingSubTitleContainer>
            <SettingSubTitle>Bulb Flash Rate</SettingSubTitle>
          </SettingSubTitleContainer>
          <Slider
            step={bulbRate || pulseSettings[0].name}
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
