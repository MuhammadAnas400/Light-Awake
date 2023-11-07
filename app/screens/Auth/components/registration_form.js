import React, {useEffect, useState} from 'react';
import {View, ScrollView, TouchableWithoutFeedback} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {showMessage, hideMessage} from 'react-native-flash-message';

import {Toast} from '../../../components/Globals/Toast';
import {AppleSignIn} from './social_logins/apple_sign_in';
import {GoogleSignIn} from './social_logins/google_sign_in';

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

import {useHomeId} from '../../../hooks/useHomeId';

export default function RegistrationForm({navigation, isLogin, setIsLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const {homeId, getHomeId} = useHomeId();

  useEffect(() => {
    async function fetch() {
      await getHomeId();
    }

    fetch();
  }, []);

  const handleRegisterClicked = async () => {
    const userExists = await verifyUser();

    if (validateFullName(fullName)) {
      return Toast(
        'Error',
        'Please remove unnecessary characters on Full Name.',
        'danger',
        'danger',
      );
    }

    if (
      email == '' ||
      fullName == '' ||
      password == '' ||
      confirmPassword == ''
    ) {
      return Toast(
        'Error',
        'Complete the form to continue.',
        'danger',
        'danger',
      );
    }

    if (password !== confirmPassword) {
      return Toast(
        'Error',
        'Password and password confirmation must match.',
        'danger',
        'danger',
      );
    }

    if (userExists) {
      signup(connectionPath.auth.loginAsGuest);
    } else {
      signup(connectionPath.auth.signUp);
    }
  };

  async function verifyUser() {
    try {
      const params = {
        device_id: await DeviceInfo.getUniqueId(),
        email: email,
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: `${connectionPath.auth.checkGuestUserExists}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async function signup(url) {
    try {
      const params = {
        email: email,
        full_name: fullName,
        password: password,
        password_confirmation: confirmPassword,
        homeId: homeId,
        device_id: await DeviceInfo.getUniqueId(),
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: url,
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

      Toast(
        'Success',
        'Successfully registered to the app!',
        'success',
        'success',
      );
      setTimeout(() => {
        navigation.navigate('Store');
      }, 2000);
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.message) {
        return Toast(
          'Error',
          error.response.data.message.toString(),
          'danger',
          'danger',
        );
      }

      Toast(
        'Error',
        error.response.data.errors.full_messages.toString(),
        'danger',
        'danger',
      );
    }
  }

  const handlePasswordInfoPressed = () => {
    setShowPasswordInfo(!showPasswordInfo);

    if (showPasswordInfo) {
      hideMessage();
    } else {
      const description = [
        '• must be at least 6 characters. \n',
        '• to be more secure you can add special characters.',
      ];

      showMessage({
        hideOnPress: true,
        description,
        icon: 'info',
        message: 'Password must follow these rules:',
        position: 'center',
        type: 'info',
        duration: 5000,
      });
    }
  };

  const validateFullName = (name) => {
    var re = /[^a-zA-Z\s]/gi;
    return re.test(name);
  };

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
                value={fullName}
                onChangeText={(fullName) => setFullName(fullName)}
                placeholder="Full name"
                placeholderTextColor="#A9A9A9"
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
                placeholder="Password"
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
            <TouchableWithoutFeedback onPress={handlePasswordInfoPressed}>
              <PasswordValidationIconContainer>
                <InfoIcon source={require('../../../../assets/info.png')} />
              </PasswordValidationIconContainer>
            </TouchableWithoutFeedback>
          </StackChildWrapper>
          <StackChildWrapper>
            <InputTextContainer>
              <InputText
                secureTextEntry={isConfirmPasswordSecure}
                value={confirmPassword}
                onChangeText={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
                placeholder="Confirm password"
                placeholderTextColor="#A9A9A9"
              />
              <TouchableWithoutFeedback
                onPress={() =>
                  setIsConfirmPasswordSecure(!isConfirmPasswordSecure)
                }>
                <Icon
                  source={
                    isConfirmPasswordSecure
                      ? require('../../../../assets/visibility.png')
                      : require('../../../../assets/invisible.png')
                  }
                />
              </TouchableWithoutFeedback>
            </InputTextContainer>
          </StackChildWrapper>
          <Spacer />
          <StackChildWrapper>
            <SetPairButton onPress={() => handleRegisterClicked()}>
              <ButtonText>Sign Up</ButtonText>
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
              <AuthButton onPress={() => setIsLogin(true)}>
                <Description>Already have an account?</Description> Login
              </AuthButton>
            </Footer>
          </StackChildWrapper>
        </View>
      </ScrollView>
    </StackContainer>
  );
}

const AuthButton = styled.Text`
  font-size: ${scaleWidth(15)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.yellow};
  margin: auto;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
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

const Icon = styled.Image`
  width: ${responsiveScreenWidth(6.5)};
  height: ${responsiveScreenHeight(3)};
  margin-right: ${responsiveScreenWidth(3)};
`;

const InfoIcon = styled.Image`
  width: ${responsiveScreenWidth(4.5)};
  height: ${responsiveScreenHeight(2)};
  margin-left: ${responsiveScreenWidth(3)};
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

const PasswordValidationIconContainer = styled.View`
  margin: auto;
  margin-left: auto;
  margin-right: ${responsiveScreenWidth(3.9)};
`;

const SetPairButton = styled.TouchableOpacity`
  width: 100%;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(5)}px;
  margin: auto;
`;

const StackContainer = styled.View`
  position: relative;
  width: 100%;
  padding: 0 ${scaleWidth(30)}px;
  margin-top: ${scaleHeight(80)}px;
  background-color: ${(props) => props.theme.colors.lightIndigo};
`;

const StackChildWrapper = styled.View`
  padding: 2.5% 2.9%;
  border-radius: 5px;
  width: 100%;
`;

const SocialLoginTextSpacer = styled(AuthButton)`
  color: ${(props) => props.theme.colors.white};
`;
