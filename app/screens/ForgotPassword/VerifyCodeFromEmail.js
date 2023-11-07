import React, {useState, useEffect} from 'react';
import {Platform, KeyboardAvoidingView, View, Keyboard} from 'react-native';

import AnimatedLoader from 'react-native-animated-loader';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {KeycodeInput} from '../../components/Globals/KeycodeInput';
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
  method,
} from '../../network/AxiosRequestHandler';

const VerifyCodeFromEmail = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss;
    });
  }, []);

  const handleKeyCodeInputComplete = (code) => {
    verifyCode(code);
  };

  async function verifyCode(code) {
    setIsLoading(true);
    try {
      const params = {
        verification_code: code,
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: connectionPath.auth.verifyCode,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        setIsLoading(false);
        Toast('Success', 'Verification completed', 'success', 'success');
        setTimeout(() => {
          navigation.navigate('UpdatePassword');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        console.log(error);
        setIsLoading(false);
        Toast('Error', 'Verification failed. Try again.', 'danger', 'danger');
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
              Verifying code....
            </SigningTitle>
          </StackChildWrapper>
        </StackContainer>
      );
    }

    function isIdle() {
      return (
        <StackContainer>
          <StackChildWrapper style={{alignItems: 'center'}}>
            <KeycodeInput
              numeric={true}
              value={value}
              onChange={(newValue) => setValue(newValue)}
              onComplete={(completedValue) => {
                handleKeyCodeInputComplete(completedValue);
              }}
            />
          </StackChildWrapper>
          <Spacer />
          <StackChildWrapper>
            <SendButtonContainer onPress={() => console.log('HI')}>
              <ButtonText>Submit</ButtonText>
            </SendButtonContainer>
            <Spacer style={{marginTop: responsiveScreenHeight(2)}} />
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
        <ScreenContent>
          <Spacer />
          <ScreenTitle>Verification Code</ScreenTitle>
          <ScreenSubTitle>
            Please enter the verification code we sent to your email.
          </ScreenSubTitle>
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

export default VerifyCodeFromEmail;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  margin: auto;
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
  font-size: ${responsiveScreenFontSize(3.8)}px;
  text-align: center;
`;

const ScreenSubTitle = styled(ScreenTitle)`
  padding-top: 10px;
  font-size: ${responsiveScreenFontSize(2.3)};
  font-family: ${(props) => props.theme.fonts.regular};
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

const SendButtonContainer = styled.TouchableOpacity`
  width: 80%;
  height: ${scaleHeight(46)}px;
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
  margin-top: ${responsiveScreenHeight(12)};
`;
// width: 100%;
// padding: 0 ${scaleWidth(30)}px;
// margin: auto;
