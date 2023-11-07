import React, {useState, useEffect} from 'react';
import {Platform, KeyboardAvoidingView, View, Keyboard} from 'react-native';

import AnimatedLoader from 'react-native-animated-loader';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import BackButton from '../../components/Globals/BackButton';
import StatusModal from '../../components/Modals/StatusModal';
import {Toast} from '../../components/Globals/Toast';

import styled from 'styled-components/native';

import {scaleHeight, scaleWidth} from '../../styles/scales';
import {
  BackgroundImage,
  ScreenHead,
  ScreenContainer as DefaultScreenContainer,
  Spacer,
} from '../../styles/commonStyledComponents';
import AxiosRequestHandler, {
  connectionPath,
  LIGHTAWAKE_BASE_URL,
  method,
} from '../../network/AxiosRequestHandler';
import {storeAsyncStorageData} from '../../constants/utils';
import StorageProperty from '../../constants/storage-property';

const ResetPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss;
    });
  }, []);

  const handleSubmitPress = () => {
    sendInstructions();
  };

  async function sendInstructions() {
    setIsLoading(true);

    try {
      const params = {
        email: email,
        redirect_url: LIGHTAWAKE_BASE_URL + connectionPath.auth.editPassword,
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: connectionPath.auth.sendEmailInstructions,
      };

      const response = await AxiosRequestHandler(requestConfig);

      const authToken = {
        client: response?.headers['client'],
        uid: response?.headers['uid'],
        'access-token': response?.headers['access-token'],
      };

      if (response) {
        storeAsyncStorageData(
          StorageProperty.USER_TOKEN,
          JSON.stringify(authToken),
        );
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate('CheckMail');
        }, 2000);
      }
      // setTimeout(() => {
      //   setIsLoading(false);
      //   navigation.navigate('CheckMail');
      // }, 2000);
    } catch (error) {
      console.log(error.response.data.message);
      setIsLoading(false);
      Toast('Error', error.response.data.message, 'danger', 'danger', 10000);
    }
  }

  const getMessage = (status) => {
    var type = {
      Success: 'Successfully sent instructions to email!',
      Error: 'Something went wrong. Try Again.',
    };

    return type[status];
  };

  function renderForm() {
    function isProcessing() {
      return (
        <StackContainer>
          <StackChildWrapper>
            <AnimatedLoader
              visible={true}
              source={require('../../../assets/fetch.json')}
              animationStyle={{
                width: responsiveScreenWidth(20),
                height: responsiveScreenHeight(35),
                marginTop: responsiveScreenHeight(3),
              }}
            />
            <SigningTitle style={{paddingTop: responsiveScreenHeight(30)}}>
              Sending Instructions....
            </SigningTitle>
          </StackChildWrapper>
        </StackContainer>
      );
    }

    function isIdle() {
      return (
        <StackContainer>
          <StackChildWrapper>
            <InputText
              value={email}
              onChangeText={(email) => setEmail(email)}
              placeholder="Enter email"
              placeholderTextColor="#A9A9A9"
              autoCapitalize="none"
            />
          </StackChildWrapper>
          <StackChildWrapper>
            <SendButtonContainer onPress={handleSubmitPress}>
              <ButtonText>Send Instructions</ButtonText>
            </SendButtonContainer>
          </StackChildWrapper>
        </StackContainer>
      );
    }

    var load = {
      true: isProcessing,
      false: isIdle,
    };

    return load[isLoading]();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: '#24146C'}}>
      <ScreenContainer>
        <ScreenHead>
          <BackButton onPress={() => navigation.goBack()} />
          <ScreenTitle />
        </ScreenHead>
        <Spacer />
        <ScreenContent>
          <ScreenTitle>Reset password</ScreenTitle>
          <ScreenSubTitle>
            Enter the email associated with your account and we'll send an email
            with instructions to reset your password.
          </ScreenSubTitle>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              paddingTop: responsiveScreenHeight(15),
            }}>
            {renderForm()}
          </View>
        </ScreenContent>
      </ScreenContainer>
      {statusModalOpen && (
        <StatusModal
          statusModalOpen={statusModalOpen}
          setStatusModalOpen={setStatusModalOpen}
          status={status}
          message={getMessage(status)}
          error={error}
          navigation={navigation}
          to={'home'}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

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

const InputText = styled.TextInput`
  margin: auto;
  font-size: 16px;
  background-color: white;
  border-color: white;
  border-width: 1px;
  height: ${scaleHeight(50)}px;
  width: 100%
  padding: 10px;
  border-radius: ${scaleWidth(5)}px;
`;

const SigningTitle = styled.Text`
  font-size: ${scaleWidth(25)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  margin: auto;
`;

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const ScreenContent = styled.View`
  padding-top: 20px;
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
  text-align: left;
`;

const ScreenSubTitle = styled(ScreenTitle)`
  padding-top: 10px;
  font-size: ${responsiveScreenFontSize(2)};
  font-family: ${(props) => props.theme.fonts.regular};
  text-align: left;
  color: ${(props) => props.theme.colors.white};
`;

const SendButtonContainer = styled.TouchableOpacity`
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
  padding: 0 ${scaleWidth(30)}px
  margin: auto;
  margin-top: ${responsiveScreenHeight(15)};
`;
// width: 100%;
// padding: 0 ${scaleWidth(30)}px;
// margin: auto;
