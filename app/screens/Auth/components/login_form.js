import React, {useState} from 'react';

import {
  Platform,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import styled from 'styled-components/native';
import {scaleHeight, scaleWidth} from '../../../styles/scales';
import {
  ScreenContainer as DefaultScreenContainer,
  Spacer,
} from '../../../styles/commonStyledComponents';

import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';
import {storeAsyncStorageData} from '../../../constants/utils';
import StorageProperty from '../../../constants/storage-property';

import {Toast} from '../../../components/Globals/Toast';
//
import {AppleSignIn} from './social_logins/apple_sign_in';
import {GoogleSignIn} from './social_logins/google_sign_in';

export default function LoginForm({navigation, isLogin, setIsLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const handleForgotPasswordPress = () => {
    navigation.navigate('ResetPassword');
  };

  async function login() {
    try {
      const data = {
        email: email,
        password: password,
        // device_id: DeviceInfo.getUniqueId(),
      };
      const requestConfig = {
        data: data,
        method: method.post,
        url: connectionPath.auth.loginWithEmail,
      };

      const response = await AxiosRequestHandler(requestConfig, true, true);
      const authToken = {
        client: response?.headers['client'],
        uid: response?.headers['uid'],
        'access-token': response?.headers['access-token'],
      };

      storeAsyncStorageData(
        StorageProperty.USER_TOKEN,
        JSON.stringify(authToken),
      );

      Toast('Success', 'Successfully logged in!', 'success', 'success');
      setTimeout(() => {
        navigation.navigate('Store');
      }, 2000);
    } catch (error) {
      if (error.response) {
        Toast('Error', error.response.data.message, 'danger', 'danger');
      }
    }
  }

  return (
    <StackContainer>
      <ScrollView>
        <View>
          <StackChildWrapper>
            <InputTextContainer>
              <InputText
                value={email}
                onChangeText={(email) => setEmail(email)}
                placeholder="Enter email"
                placeholderTextColor="#A9A9A9"
                autoCapitalize="none"
                style={{width: '91%'}}
              />
            </InputTextContainer>
          </StackChildWrapper>
          <StackChildWrapper>
            <InputTextContainer>
              <InputText
                secureTextEntry={isPasswordSecure}
                value={password}
                onChangeText={(password) => setPassword(password)}
                placeholder="Password (required)"
                placeholderTextColor="#A9A9A9"
              />
              <TouchableWithoutFeedback
                onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
                <Icon
                  source={
                    isPasswordSecure
                      ? require('../../../../assets/visibility.png')
                      : require('../../../../assets/invisible.png')
                  }
                />
              </TouchableWithoutFeedback>
            </InputTextContainer>
          </StackChildWrapper>
          <StackChildWrapper>
            <ResetPasswordButton onPress={handleForgotPasswordPress}>
              Forgot Password?
            </ResetPasswordButton>
          </StackChildWrapper>
          <Spacer />
          <StackChildWrapper>
            <SetPairButton onPress={() => login()}>
              <ButtonText>Login</ButtonText>
            </SetPairButton>
          </StackChildWrapper>
          <Spacer />
          <StackChildWrapper>
            <SocialLoginTextSpacer>
              ─── Or continue by ───
            </SocialLoginTextSpacer>
          </StackChildWrapper>
          <StackChildWrapper>
            {Platform.OS === 'ios' ? (
              <AppleSignIn isLogin={isLogin} navigation={navigation} />
            ) : (
              <GoogleSignIn navigation={navigation} />
            )}
            <Spacer />
          </StackChildWrapper>
          <StackChildWrapper>
            <Footer>
              <AuthButton onPress={() => setIsLogin(false)}>
                <Description>Not a member?</Description> Register now
              </AuthButton>
            </Footer>
          </StackChildWrapper>
        </View>
      </ScrollView>
    </StackContainer>
  );
}

const StyledText = styled.Text`
  font-size: ${scaleWidth(15)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.yellow};
`;

const ResetPasswordButton = styled(StyledText)`
  margin-left: auto;
  margin-right: ${responsiveScreenWidth(1)};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  margin: auto;
`;

const Icon = styled.Image`
  width: ${responsiveScreenWidth(6.5)};
  height: ${responsiveScreenHeight(3)};
  margin-right: ${responsiveScreenWidth(3)};
`;

const InputText = styled.TextInput`
  margin: auto;
  font-size: 16px;
  background-color: white;
  border-color: white;
  border-radius: ${scaleWidth(5)}px;
  border-width: 1px;
  height: ${scaleHeight(50)}px;
  width: 80%
  padding: 10px;
  
`;

const InputTextContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: ${scaleWidth(5)}px;
`;

const SetPairButton = styled.TouchableOpacity`
  width: 100%;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(5)}px;
  margin: auto;
`;

const StackChildWrapper = styled.View`
  padding: 2.5% 2.9%;
  border-radius: 5px;
  width: 100%;
`;

const StackContainer = styled.View`
  position: relative;
  width: 100%;
  padding: 0 ${scaleWidth(30)}px;
  margin-top: ${scaleHeight(80)}px;
  background-color: ${(props) => props.theme.colors.lightIndigo};
`;

const AuthButton = styled.Text`
  font-size: ${scaleWidth(15)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.yellow};
  margin: auto;
`;

const Description = styled(AuthButton)`
  color: ${(props) => props.theme.colors.white};
`;

const Footer = styled.View`
  position: relative;
  display: flex;
  justify-content: center;
`;

const SocialLoginTextSpacer = styled(AuthButton)`
  color: ${(props) => props.theme.colors.white};
`;
