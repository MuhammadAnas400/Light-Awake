import React, {useEffect, useState} from 'react';
import {Modal, Platform} from 'react-native';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import LottieView from 'lottie-react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import styled from 'styled-components/native';
import {
  ScreenContainer as DefaultScreenContainer,
  SettingTitle,
} from '../../../styles/commonStyledComponents';
import {scaleHeight, scaleWidth} from '../../../styles/scales';
import {theme} from '../../../styles/theme';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

let freeItems = [
  {
    key: 0,
    product_identifier: '02_wake',
    name: 'Alarm Sound: Wake - Pleasant Tone',
  },
  {
    key: 1,
    product_identifier: '07_holo',
    name: 'Alarm Sound: Holo - Drum Beat',
  },
  {
    key: 2,
    product_identifier: '04_drilling_concrete',
    name: 'Alarm Sound: Drilling - Sound of work',
  },
  {
    key: 3,
    product_identifier: '07_general_short_story',
    name: 'Alarm Sound: General Cluster - Short story',
  },
  {
    key: 4,
    product_identifier: '04_toll',
    name: 'Alarm Sound: Toll - Ethereal Tone',
  },
];

const GiftPrompt = ({
  promptGift,
  informUserModal,
  setPromptGift,
  setInformUserModal,
  isGuestUser,
  setIsGuestUser,
}) => {
  const [chosenGift, setChosenGift] = useState([freeItems[0]]);

  const handleGiftChosen = (gift) => {
    setChosenGift(gift);
  };

  const handleCloseModal = () => {
    setPromptGift(!promptGift);
  };

  const handlePurchaseButtonClicked = () => {
    receiveFreeGift();
  };

  async function receiveFreeGift() {
    const deviceId = await DeviceInfo.getUniqueId();

    try {
      const data = {
        product_identifier: chosenGift.product_identifier,
        iap_type: 'Audio',
        device_id: deviceId,
      };

      const requestConfig = {
        data: data,
        method: method.post,
        url: connectionPath.iaps.receiveFreeGift,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        if (response.data.guest_user) {
          setPromptGift(!promptGift);
          setIsGuestUser(true);
          setTimeout(() => {
            setInformUserModal(!informUserModal);
          }, 1000);
        } else {
          setPromptGift(!promptGift);
          setIsGuestUser(false);
          setTimeout(() => {
            setInformUserModal(!informUserModal);
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderAnswers = Object.keys(freeItems).map((key) => (
    <AnswerContainer key={key}>
      <CheckBoxContainer>
        <BouncyCheckbox
          disableBuiltInState
          fillColor="#f3d449"
          isChecked={
            freeItems[key].product_identifier == chosenGift.product_identifier
          }
          onPress={() => handleGiftChosen(freeItems[key])}
          size={25}
        />
      </CheckBoxContainer>
      <ScreenTitleContainer>
        <SettingTitle
          style={{width: `85%`, fontSize: responsiveScreenFontSize(1.9)}}>
          {freeItems[key].name}
        </SettingTitle>
      </ScreenTitleContainer>
    </AnswerContainer>
  ));

  return (
    <Modal visible={promptGift} transparent={true} animationType="fade">
      <Backdrop>
        <ModalBody
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          {/* <CancelContainer onPress={() => handleCloseModal()}>
            <ExitModalButton>
              <ModalXIcon
                source={require('../../../../assets/images/cancel.png')}
              />
            </ExitModalButton>
          </CancelContainer> */}
          <BodyContainer>
            <HeaderContainer>
              <ScreenTitle
                style={{
                  fontSize: responsiveScreenFontSize(3),
                  fontFamily: theme.fonts.bold,
                }}>
                Thank you for taking the time to complete this survey!
              </ScreenTitle>
            </HeaderContainer>
            <ScreenTitle>
              What item from the Light Awake store would you like for free, as a
              courtesy for taking this survey?
            </ScreenTitle>
            <AnswersContainer>{renderAnswers}</AnswersContainer>
            <Spacer />
            {chosenGift?.product_identifier && (
              <ButtonContainer>
                <SetChangeButton onPress={handlePurchaseButtonClicked}>
                  <ButtonText>Accept</ButtonText>
                </SetChangeButton>
              </ButtonContainer>
            )}
          </BodyContainer>
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default GiftPrompt;

const AnswersContainer = styled.View`
  width: 93%;
  display: flex;
  padding-bottom: 3px;
  padding-top: 3px;
  flex-direction: column;
  align-items: flex-start;
`;

const AnswerContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding-top: ${responsiveScreenHeight(2)};
`;

const CheckBoxContainer = styled.View`
  margin-top: auto;
  margin-bottom: auto;
  width: 35px;
`;

const ScreenTitleContainer = styled.View`
  width: 100%;
  margin-right: 10%;
`;

const ButtonContainer = styled.View`
  width: 100%;
  border-radius: 5px;
  padding-top: ${responsiveScreenHeight(2)};
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

const HeaderContainer = styled.View`
  display: flex;
  padding-bottom: ${responsiveScreenHeight(2)}
  padding-top: ${responsiveScreenHeight(2)}
  width: 95%;
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
  height: ${responsiveScreenHeight(70)};
  width: 90%;
`;

const ModalXIcon = styled.Image`
  width: 12px;
  height: 12px;
  align-items: flex-end;
`;

const ScreenTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.default};
  color: ${(props) => props.theme.colors.white};
  font-size: ${responsiveScreenFontSize(2)};
`;

const SetChangeButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;

const Spacer = styled.View`
  height: ${responsiveScreenHeight(3)};
`;
