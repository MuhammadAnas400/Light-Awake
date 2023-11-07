import React from 'react';
import {TouchableOpacity} from 'react-native';
import {
  ScreenContainer as DefaultScreenContainer,
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../styles/commonStyledComponents';

export function PairBulbWithUsButton({navigation}) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Bulbs')}>
      <SettingContainer>
        <SettingHead>
          <Row>
            <SettingIcon
              source={require('../../../../assets/flashlight-icon.png')}
            />
            <SettingTitle>Pair Bulb With Us</SettingTitle>
          </Row>
        </SettingHead>
      </SettingContainer>
    </TouchableOpacity>
  );
}
