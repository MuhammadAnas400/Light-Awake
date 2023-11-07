import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import LoginForm from './components/login_form';
import RegistrationForm from './components/registration_form';
import {ScreenContent} from '../../styles/commonStyledComponents';
import {Platform} from 'react-native';
import styled from 'styled-components';

export function Form({navigation}) {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <FormContainer style={{position: 'absolute'}}>
      {isLogin ? (
        <LoginForm
          navigation={navigation}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
        />
      ) : (
        <RegistrationForm
          navigation={navigation}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
        />
      )}
    </FormContainer>
  );
}
const FormContainer = styled(ScreenContent)`
  position: absolute;
  width: ${responsiveScreenWidth(100)};
  height: ${Platform.OS === 'ios' ? '83%' : '77%'};
  bottom: ${responsiveScreenHeight(10)};
`;