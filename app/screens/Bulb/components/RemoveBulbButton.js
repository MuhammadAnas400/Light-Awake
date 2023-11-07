import React, {useState} from 'react';

import styled from 'styled-components/native';
import RemoveBulbForm from './RemoveBulbForm';

import {
  ScreenContainer as DefaultScreenContainer,
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../styles/commonStyledComponents';

const RemoveBulbButton = ({device, navigation}) => {
  const [showRemoveForm, setShowRemoveForm] = useState(false);

  return (
    <PairTouchable
      style={{
        shadowColor: 'none',
        shadowOpacity: 0,
        shadowRadius: 0,
        borderRadius: 5,
      }}
      onPress={() => setShowRemoveForm(true)}>
      <SettingContainer onPress={() => setShowRemoveForm(true)}>
        <SettingHead>
          <Row>
            <SettingIcon
              source={require('../../../../assets/close.png')}
              style={{width: 18, height: 18}}
            />
            <SettingTitle>Remove Bulb</SettingTitle>
          </Row>
        </SettingHead>
      </SettingContainer>
      {showRemoveForm && (
        <RemoveBulbForm
          showRemoveForm={showRemoveForm}
          setShowRemoveForm={setShowRemoveForm}
          deviceId={device.devId}
          navigation={navigation}
        />
      )}
    </PairTouchable>
  );
};

export default RemoveBulbButton;

const PairTouchable = styled.TouchableOpacity`
  border-radius: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.yellow};
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
`;
