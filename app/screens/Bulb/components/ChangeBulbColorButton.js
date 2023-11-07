import React, {useState} from 'react';
import ChangeBulbColorForm from './ChangeBulbColorForm';
import styled from 'styled-components/native';
import {
  ScreenContainer as DefaultScreenContainer,
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../styles/commonStyledComponents';

const ChangeBulbColorButton = ({device}) => {
  const [colorWheelShow, setColorWheelShow] = useState(false);

  return (
    <PairTouchable
      style={{
        shadowColor: 'none',
        shadowOpacity: 0,
        shadowRadius: 0,
        borderRadius: 5,
      }}
      onPress={() => setColorWheelShow(!colorWheelShow)}>
      <SettingContainer>
        <SettingHead>
          <Row>
            <SettingIcon
              source={require('../../../../assets/color-picker-icon.png')}
              style={{width: 23, height: 23}}
            />
            <SettingTitle>Bulb Color Settings</SettingTitle>
          </Row>
        </SettingHead>
      </SettingContainer>
      {colorWheelShow && (
        <ChangeBulbColorForm
          colorWheelShow={colorWheelShow}
          setColorWheelShow={setColorWheelShow}
          device={device}
        />
      )}
    </PairTouchable>
  );
};

export default ChangeBulbColorButton;

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
