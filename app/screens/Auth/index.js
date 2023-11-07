import React from 'react';
import {Platform, KeyboardAvoidingView} from 'react-native';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

import styled from 'styled-components/native';

import {
  ScreenContainer as DefaultScreenContainer,
  Spacer,
  ScreenHead,
} from '../../styles/commonStyledComponents';

import {Form} from './form';
import BackButton from '../../components/Globals/BackButton';
import RNUxcam from 'react-native-ux-cam';


export default function Auth({navigation}) {
  RNUxcam.tagScreenName('Log-in Screen');
  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#24146C'}}
      behavior={Platform.OS === 'ios' && 'padding'}>
      <ScreenContainer>
        <ScreenHead>
          <BackButton onPress={() => navigation.goBack()} />
          <ScreenTitle />
        </ScreenHead>
        <Spacer />
        <ScreenContent>
          <ScreenTitle>Let's sign you in!</ScreenTitle>
          <ScreenSubTitle>
            Enter your details to sign in to your account.
          </ScreenSubTitle>
          <Form navigation={navigation} />
        </ScreenContent>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
  flex: 1;
`;

const ScreenContent = styled.View`
  padding-top: ${Platform.OS === 'ios' ? 10 : 0}px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  position: relative;
  height: 100%;
  width: 85%
  align-items: center;
`;

const ScreenTitle = styled.Text`
  width: 100%;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${responsiveScreenFontSize(4)}px;
  text-align: center;
`;

const ScreenSubTitle = styled(ScreenTitle)`
  padding-top: 10px;
  font-family: ${(props) => props.theme.fonts.default};
  font-size: ${responsiveScreenFontSize(2)};
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;
