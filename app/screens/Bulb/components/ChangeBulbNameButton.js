import React, {useState} from 'react';
import ChangeBulbNameForm from './ChangeBulbNameForm';

import styled from 'styled-components/native';
import {
  ScreenContainer as DefaultScreenContainer,
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../styles/commonStyledComponents';

const ChangeBulbNameButton = ({device, navigation}) => {
  const [formShow, setFormShow] = useState(false);

  return (
    <PairTouchable
      style={{
        shadowColor: 'none',
        shadowOpacity: 0,
        shadowRadius: 0,
        borderRadius: 5,
      }}
      onPress={() => setFormShow(!formShow)}>
      <SettingContainer onPress={() => setFormShow(!formShow)}>
        <SettingHead>
          <Row>
            <SettingIcon
              source={require('../../../../assets/pencil.png')}
              style={{width: 23, height: 23}}
            />
            <SettingTitle>Change Bulb Name</SettingTitle>
          </Row>
        </SettingHead>
      </SettingContainer>
      {formShow && (
        <ChangeBulbNameForm
          formShow={formShow}
          setFormShow={setFormShow}
          device={device}
          navigation={navigation}
        />
      )}
    </PairTouchable>
  );
};

export default ChangeBulbNameButton;

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
