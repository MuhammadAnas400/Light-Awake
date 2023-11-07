
import React from 'react';
import {Platform, TouchableWithoutFeedback} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import styled from 'styled-components/native';
import {scaleWidth} from '../../../styles/scales';
import {
  ScreenContainer as DefaultScreenContainer,
  SettingContainer,
  SettingHead,
  SettingTitle,
} from '../../../styles/commonStyledComponents';

export default function BulbsList({
  devices,
  check,
  handleCheckboxPress,
  handleSettingsIconPress,
}) {
  const BulbsList = Object.keys(devices ?? []).map((val) => (
    <SettingContainer key={val}>
      <SettingHead>
        <BulbsContainer>
          {Platform.OS === 'ios' ? (
            <CheckBoxContainer>
              <CheckBox
                value={check(devices[val])}
                onValueChange={() => handleCheckboxPress(devices[val])}
                tintColor={'FFFFFF'}
                onCheckColor={'#4025b5'}
                onFillColor={'#f3d449'}
                onTintColor={'#f3d449'}
              />
            </CheckBoxContainer>
          ) : (
            <CheckBoxContainer>
              <CheckBox
                value={check(devices[val])}
                onValueChange={() => handleCheckboxPress(devices[val])}
                tintColors={{
                  true: '#f3d449',
                  false: '#FFFFFF',
                }}
              />
            </CheckBoxContainer>
          )}
          <ScreenTitleContainer>
            <SettingTitle
              style={{
                width: `100%`,
              }}>
              {devices[val].name}
            </SettingTitle>
          </ScreenTitleContainer>
        </BulbsContainer>
        <BulbsContainer
          style={{
            justifyContent: 'flex-end',
            width: `5%`,
          }}>
          <TouchableWithoutFeedback
            onPress={() => handleSettingsIconPress(devices[val])}>
            <EditingIcon
              source={require('../../../../assets/settings.png')}
              style={{
                width: 23,
                height: 23,
              }}
            />
          </TouchableWithoutFeedback>
        </BulbsContainer>
      </SettingHead>
    </SettingContainer>
  ));
  return <>{BulbsList}</>;
}

const CheckBoxContainer = styled.View`
  width: 40px;
`;

const BulbsContainer = styled.View`
  width: 85%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EditingIcon = styled.Image`
  margin-right: ${scaleWidth(15)}px;
`;

const ScreenTitleContainer = styled.View`
  width: 100%;
  margin-right: 10%;
`;
