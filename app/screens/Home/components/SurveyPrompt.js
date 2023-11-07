import React from 'react';
import {Modal} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import styled from 'styled-components/native';
import {scaleHeight, scaleWidth} from '../../../styles/scales';
import {theme} from '../../../styles/theme';

const SurveyPrompt = ({promptSurvey, setPromptSurvey, navigation}) => {
  const handlePurchaseButtonClicked = () => {
    setPromptSurvey(!promptSurvey);
    navigation.navigate('Survey');
  };

  const handleCloseModal = () => {
    setPromptSurvey(!promptSurvey);
  };

  return (
    <Modal visible={promptSurvey} transparent={true} animationType="fade">
      <Backdrop>
        <ModalBody
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          <CancelContainer onPress={() => handleCloseModal()}>
            <ExitModalButton>
              <ModalXIcon
                source={require('../../../../assets/images/cancel.png')}
              />
            </ExitModalButton>
          </CancelContainer>
          <BodyContainer>
            <LottieView
              source={require('../../../../assets/alarm_clock.json')}
              style={{
                width: responsiveScreenWidth(21),
                height: responsiveScreenHeight(21),
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: responsiveScreenHeight(2),
              }}
              autoPlay
              loop
            />

            <IconHolder>
              <ScreenTitle
                style={{
                  textAlign: 'center',
                  fontSize: responsiveScreenFontSize(3),
                  fontFamily: theme.fonts.bold,
                }}>
                Enjoying LightAwake?
              </ScreenTitle>
            </IconHolder>
            <ScreenTitle style={{textAlign: 'center'}}>
              Answer this quick survey and receive a free gift (in-app purchase)
              from us. Free account signup required to redeem gift.
            </ScreenTitle>
            <ButtonContainer>
              <SetChangeButton onPress={handlePurchaseButtonClicked}>
                <ButtonText>Continue?</ButtonText>
              </SetChangeButton>
            </ButtonContainer>
          </BodyContainer>
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default SurveyPrompt;

const ButtonContainer = styled.View`
  width: 100%;
  border-radius: 5px;
  padding-top: ${responsiveScreenHeight(4)};
`;

const BodyContainer = styled.View`
  width: 100%;
  height: ${responsiveScreenHeight(65)};
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  margin: auto;
`;

const Backdrop = styled.View`
  width: 100%;
  height: 100%;
  background-color: #00000080;
`;

const CancelContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;

const ExitModalButton = styled.View`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
  background-color: ${(props) => props.theme.colors.white};
`;

const IconHolder = styled.View`
  border-radius: ${responsiveScreenWidth(10)};
  padding-bottom: ${responsiveScreenHeight(2)}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBody = styled(LinearGradient)`
  elevation: 7;
  shadow-opacity: 0.9;
  shadow-radius: 20px;
  shadow-offset: 0px 2px;
  shadow-color: #000;
  display: flex;
  align-items: center;
  margin: auto;
  padding: 20px;
  border-radius: 20px;
  z-index: 100;
  max-width: 90%;
  height: ${responsiveScreenHeight(58)};
  width: 85%;
`;

const ModalXIcon = styled.Image`
  width: 12px;
  height: 12px;
  align-items: flex-end;
`;

const ScreenTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.default};
  color: ${(props) => props.theme.colors.white};
  font-size: ${responsiveScreenFontSize(2.1)};
`;

const SetChangeButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;

const Spacer = styled.View`
  height: ${responsiveScreenHeight(5)};
`;
