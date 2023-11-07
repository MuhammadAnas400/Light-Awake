import React, {useState, useEffect} from 'react';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingTitle,
  Row,
  SettingIcon,
} from '../../../../../styles/commonStyledComponents';
import {scaleWidth} from '../../../../../styles/scales';

import {colorSettings} from '../../../../../constants/available-settings';

import updateAlarmDetails from '../../helper/updateAlarmDetails';
import {useWakeUpContext} from '../../../../../contexts/wake-up.context';

export default function UpgradeScreenColorPicker({
  alarm,
  hasUpdated,
  setHasUpdated,
}) {
  const [expanded, setExpanded] = useState(false);
  const [colorScreen, setColorScreen] = useState('white'); // screen color fetched from api

  useEffect(() => {
    setColorScreen(alarm?.screen_color ?? 'white');
  }, [alarm]);

  const handleColorPicker = (backgroundColor) => {
    updateAlarmDetails(alarm?.id, 'screen_color', backgroundColor).then(() => {
      setHasUpdated(!hasUpdated);
    });
  };

  return (
    <SettingContainer>
      <TouchableWithoutFeedback onPress={() => setExpanded((prev) => !prev)}>
        <SettingHead>
          <Row>
            <SettingIcon
              source={require('../../../../../../assets/color-picker-icon.png')}
            />
            <SettingTitle>Screen Wake Up Flash Color</SettingTitle>
          </Row>
          {!expanded && <PreviewColorBox color={colorScreen} />}
        </SettingHead>
      </TouchableWithoutFeedback>
      {expanded && (
        <SettingBody>
          {colorSettings.map(({backgroundColor}) => (
            <SingleColorContainer key={backgroundColor}>
              {<>{backgroundColor === colorScreen && <SelectIndicator />}</>}
              <TouchableOpacity
                onPress={() => handleColorPicker(backgroundColor)}>
                <ColorBox color={backgroundColor} />
              </TouchableOpacity>
            </SingleColorContainer>
          ))}
        </SettingBody>
      )}
    </SettingContainer>
  );
}

const ColorBox = styled.View`
  width: ${scaleWidth(41)}px;
  height: ${scaleWidth(41)}px;
  border-radius: 100px;
  background-color: ${(props) => props.theme.colors[props.color]};
`;

const PreviewColorBox = styled(ColorBox)`
  margin-left: auto;
`;

const SettingBody = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 6%;
`;

const SingleColorContainer = styled.View`
  display: flex;
  position: relative;
  align-items: center;
`;

const SelectIndicator = styled.View`
  position: absolute;
  top: -30%;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-top-width: ${scaleWidth(5)}px;
  border-right-width: ${scaleWidth(5)}px;
  border-bottom-width: 0;
  border-left-width: ${scaleWidth(5)}px;
  border-top-color: white;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
`;
