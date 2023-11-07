import React from 'react';

import {TouchableOpacity} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../../styles/commonStyledComponents.js';

export default function UpgradeWakeupArtPicker({alarm, navigation}) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('WakeupArtOption', {id: alarm.id})}>
      <SettingContainer>
        <SettingHead>
          <Row style={{width: responsiveWidth(60)}}>
            <SettingIcon
              style={{height: responsiveHeight(3), width: responsiveWidth(6)}}
              source={require('../../../../../../assets/wakeup_art.png')}
            />
            <SettingTitle style={{fontSize: responsiveFontSize(2)}}>
              Wakeup Art Option
            </SettingTitle>
          </Row>
          <EditingIcon source={require('../../../../../../assets/next.png')} />
        </SettingHead>
      </SettingContainer>
    </TouchableOpacity>
  );
}

const EditingIcon = styled.Image`
  margin-right: ${responsiveWidth(1)};
  width: ${responsiveWidth(8)};
  height: ${responsiveHeight(4)};
`;
