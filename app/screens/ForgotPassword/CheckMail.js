
import React, {useState, useEffect} from 'react';
import {Platform, KeyboardAvoidingView, View, Keyboard} from 'react-native';

import LottieView from 'lottie-react-native';
import AnimatedLoader from 'react-native-animated-loader';
import {openInbox} from 'react-native-email-link';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import BackButton from '../../components/Globals/BackButton';
import StatusModal from '../../components/Modals/StatusModal';
import {Toast} from '../../components/Globals/Toast';

import {theme} from '../../styles/theme';
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
  method,
} from '../../network/AxiosRequestHandler';

const CheckMail = ({navigation}) => {
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

  const handleOpenEmailPress = () => {
    openInbox();
    navigation.navigate('VerifyCodeFromEmail');
  };

  const handleSubmitPress = () => {
    sendInstructions();
  };

  async function sendInstructions() {
    setIsLoading(true);
    try {
      const params = {
        email: email,
        redirect_url: connectionPath.auth.editPassword,
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: connectionPath.auth.sendEmailInstructions,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        setIsLoading(false);
        setStatus('Success');
        setStatusModalOpen(true);
      }
    } catch (error) {
      if (error.response) {
        console.log(error);
        setIsLoading(false);
        setStatus('Error');
        setStatusModalOpen(true);
      }
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
            <ScreenTitle>Check your mail</ScreenTitle>
            <ScreenSubTitle>
              We have sent a password recovery code to your email.
            </ScreenSubTitle>
          </StackChildWrapper>
          <Spacer />
          <StackChildWrapper>
            <SendButtonContainer onPress={handleOpenEmailPress}>
              <ButtonText>Open email app</ButtonText>
            </SendButtonContainer>
            <Spacer />
            <ButtonText
              onPress={() => {
                navigation.navigate('VerifyCodeFromEmail');
              }}
              style={{
                color: theme.colors.white,
                fontFamily: theme.fonts.bold,
                fontSize: responsiveScreenFontSize(1.8),
              }}>
              Skip, I'll check later
            </ButtonText>
          </StackChildWrapper>
          <Footer>
            <AuthButton>
              Did not receive the email? Check your spam filter or,{' '}
              <Description onPress={() => navigation.goBack()}>
                try another email address
              </Description>
            </AuthButton>
          </Footer>
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
          <BackButton onPress={() => navigation.goBack()}/>
          <ScreenTitle />
        </ScreenHead>
        <ScreenContent>
          <LottieView
            source={require('../../../assets/email_sent.json')}
            style={{
              width: responsiveScreenWidth(30),
              height: responsiveScreenHeight(30),
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            autoPlay
            loop
          />
          <Spacer />
        </ScreenContent>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            paddingTop: responsiveScreenHeight(20),
          }}>
          {renderForm()}
        </View>
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

export default CheckMail;


const AuthButton = styled.Text`
  font-size: ${scaleWidth(15)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
  margin: auto;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  margin: auto;
`;

const Description = styled(AuthButton)`
  color: ${(props) => props.theme.colors.yellow};
`;

// margin-top: ${responsiveScreenHeight(15)};
const Footer = styled.View`
  margin-top: ${responsiveScreenHeight(15)};
  position: relative;
  display: flex;
  justify-content: center;
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
  z-index: -1;
`;

const ScreenTitle = styled.Text`
  width: 100%;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${responsiveScreenFontSize(3.8)}px;
  text-align: center;
  z-index: -1
`;

const ScreenSubTitle = styled(ScreenTitle)`
  padding-top: 10px;
  font-size: ${responsiveScreenFontSize(2.3)};
  font-family: ${(props) => props.theme.fonts.regular};
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

const SendButtonContainer = styled.TouchableOpacity`
  width: 55%;
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
