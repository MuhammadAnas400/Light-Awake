import React, {useState, useEffect} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {showMessage, hideMessage} from 'react-native-flash-message';

import {Toast} from '../../components/Globals/Toast';

import styled from 'styled-components/native';

import {scaleHeight, scaleWidth} from '../../styles/scales';
import {
  ScreenHead,
  ScreenContainer as DefaultScreenContainer,
  Spacer,
} from '../../styles/commonStyledComponents';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../network/AxiosRequestHandler';
import {removeAsyncStorageData} from '../../constants/utils';
import StorageProperty from '../../constants/storage-property';
import BackButton from '../../components/Globals/BackButton';

const UpdatePassword = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss;
    });
  }, []);

  const handleSubmitPress = () => {
    updatePassword();
  };

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

  async function updatePassword() {
    console.log(password, confirmPassword);
    if (password !== confirmPassword) {
      return Toast(
        'Error',
        'Password and confirm password must match.',
        'danger',
        'danger',
      );
    }

    try {
      const data = {
        password: password,
        password_confirmation: confirmPassword,
      };
      const requestConfig = {
        data: data,
        method: method.put,
        url: connectionPath.auth.updatePassword,
      };

      const response = await AxiosRequestHandler(requestConfig, true, true);

      if (response) {
        logout();
        Toast('Success', 'Password updated!', 'success', 'success');

        setTimeout(() => {
          navigation.navigate('Auth');
        }, 2000);
      }
    } catch (error) {
      Toast(
        'Error',
        error.response.data.errors.full_messages,
        'danger',
        'danger',
      );
    }
  }

  async function logout() {
    try {
      const data = {};
      const requestConfig = {
        data: data,
        method: method.delete,
        url: `${connectionPath.auth.logout}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        removeAsyncStorageData(StorageProperty.USER_TOKEN);
      }
    } catch (error) {
      Toast('Danger', 'An error occurred. Try again.', 'danger', 'danger');
    }
  }

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
          <ScreenTitle>Create New Password</ScreenTitle>
          <ScreenSubTitle>
            Your new password must be different from previous used passwords.
          </ScreenSubTitle>
          <FormContainer>
            <StackContainer>
              <ScrollView>
                <View>
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
                              ? require('../../../assets/visibility.png')
                              : require('../../../assets/invisible.png')
                          }
                        />
                      </TouchableWithoutFeedback>
                    </InputTextContainer>
                  </StackChildWrapper>
                  <StackChildWrapper>
                    <TouchableWithoutFeedback
                      onPress={handlePasswordInfoPressed}>
                      <PasswordValidationIconContainer>
                        <InfoIcon
                          source={require('../../../assets/info.png')}
                        />
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
                              ? require('../../../assets/visibility.png')
                              : require('../../../assets/invisible.png')
                          }
                        />
                      </TouchableWithoutFeedback>
                    </InputTextContainer>
                  </StackChildWrapper>
                  <Spacer />
                  <StackChildWrapper>
                    <SetPairButton onPress={handleSubmitPress}>
                      <ButtonText>Reset Password</ButtonText>
                    </SetPairButton>
                  </StackChildWrapper>
                </View>
              </ScrollView>
            </StackContainer>
          </FormContainer>
        </ScreenContent>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

export default UpdatePassword;

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
  font-size: ${responsiveScreenFontSize(3.2)}px;
  text-align: left;
`;

const ScreenSubTitle = styled(ScreenTitle)`
  padding-top: 10px;
  font-size: ${responsiveScreenFontSize(2.2)};
  font-family: ${(props) => props.theme.fonts.regular};
  text-align: left;
  color: ${(props) => props.theme.colors.white};
`;

const FormContainer = styled(ScreenContent)`
  position: absolute;
  width: ${responsiveScreenWidth(100)};
  height: ${Platform.OS === 'ios' ? '83%' : '77%'};
  bottom: ${responsiveScreenHeight(10)};
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
