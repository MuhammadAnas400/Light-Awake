import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';

import styled from 'styled-components';
import {scaleWidth} from '../../../styles/scales';
import {
  Row,
  SettingContainer,
  SettingHead,
  SettingTitle,
} from '../../../styles/commonStyledComponents';

export default function AddBulbButton({handlePairingPress}) {
  return (
    <TouchableWithoutFeedback onPress={handlePairingPress}>
      <SettingContainer>
        <SettingHead>
          <Row>
            <EditingIcon
              source={require('../../../../assets/plus.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
            <SettingTitle>Add Bulb</SettingTitle>
          </Row>
        </SettingHead>
      </SettingContainer>
    </TouchableWithoutFeedback>
  );
}
const EditingIcon = styled.Image`
  margin-right: ${scaleWidth(15)}px;
`;
