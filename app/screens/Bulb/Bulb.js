
import React from 'react';
import {Platform} from 'react-native';

import {responsiveHeight} from 'react-native-responsive-dimensions';

import BackButton from '../../components/Globals/BackButton';
import ChangeBulbNameButton from './components/ChangeBulbNameButton';
import ChangeBulbColorButton from './components/ChangeBulbColorButton';
import ChangeBulbLightOnOff from './components/ChangeBulbLightOnOff';
import RemoveBulbButton from './components/RemoveBulbButton';

import styled from 'styled-components/native';
import {scaleHeight} from '../../styles/scales';
import {
  BackgroundImage,
  ScreenHead,
  ScreenContainer as DefaultScreenContainer,
  ScreenTitle,
  StackContainer,
  StackChildWrapper,
} from '../../styles/commonStyledComponents';
import RNUxcam from 'react-native-ux-cam';

const Bulb = ({route, navigation}) => {

  RNUxcam.tagScreenName('Bulb Screen');

  const {device} = route.params;

  return (
    <ScreenContainer>
      <ScreenHead style={{zIndex: 1}}>
        <BackButton
          onPress={() => navigation.navigate('Bulbs', {status: 'configured'})}
        />
        <ScreenTitle>{device.name}</ScreenTitle>
      </ScreenHead>
      <BackgroundImage
        source={require('../../../assets/images/settings-background.png')}
        resizeMode="stretch"
        style={{
          height: responsiveHeight(92),
          position: Platform.OS === 'ios' ? 'absolute' : 'relative',
        }}>
        <ButtonsContainer
          style={{
            marginTop: responsiveHeight(15),
          }}>
          <Stack>
            <ChangeBulbNameButton device={device} navigation={navigation} />
            <Spacer />
            <ChangeBulbColorButton device={device} />
            <Spacer />
            <ChangeBulbLightOnOff device={device} />
            <Spacer />
            <RemoveBulbButton device={device} navigation={navigation} />
          </Stack>
        </ButtonsContainer>
      </BackgroundImage>
    </ScreenContainer>
  );
};

const Stack = ({children}) => {
  return (
    <StackContainer>
      {React.Children.map(children, (child, index) => {
        const isLastChild = index === children.length - 1;
        return isLastChild ? (
          child
        ) : (
          <StackChildWrapper>{child}</StackChildWrapper>
        );
      })}
    </StackContainer>
  );
};

const ButtonsContainer = styled.View`
  width: 100%;
  padding: 0 ${scaleHeight(30)}px;
  margin-top: ${scaleHeight(190)}px;
`;

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const Spacer = styled.View``;

export default Bulb;
