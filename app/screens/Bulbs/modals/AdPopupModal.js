
import React from 'react';
import {Modal, Linking} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import {
  Backdrop,
  ButtonText,
  ExitModalButton,
  ModalXIcon,
  ModalBody,
  ModalHeader,
  ModalButtonContainer,
  ModalText,
  ScreenContainer as DefaultScreenContainer,
  Spacer,
} from '../../../styles/commonStyledComponents';
import {theme} from '../../../styles/theme';
import styled from 'styled-components/native';

import {storeAsyncStorageData} from '../../../constants/utils';
import StorageProperty from '../../../constants/storage-property';

const AdPopupModal = ({
  isAdPopUpModalDisabled,
  setIsAdPopUpModalDisabled,
  adPopUpModalOpen,
  setAdPopUpModalOpen,
  isCheckboxSelected,
  setIsCheckboxSelected,
}) => {
  const handleCloseModal = (isDisabled) => {
    setAdPopUpModalOpen(false);
    setIsAdPopUpModalDisabled(isDisabled);
    storeAsyncStorageData(StorageProperty.AD_MODAL_DISABLED, `${isDisabled}`);
  };

  return (
    <Modal
      visible={!isAdPopUpModalDisabled && adPopUpModalOpen}
      onRequestClose={() => handleCloseModal(isCheckboxSelected)}
      transparent={true}
      animationType="fade">
      <Backdrop>
        <ModalBody
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          <CancelContainer onPress={() => handleCloseModal(isCheckboxSelected)}>
            <ExitModalButton>
              <ModalXIcon
                style={{alignItems: 'center'}}
                source={require('../../../../assets/images/cancel.png')}
              />
            </ExitModalButton>
          </CancelContainer>
          <Spacer />
          <HighLight
            style={{
              fontSize: responsiveFontSize(2.7),
              textAlign: 'center',
            }}>
            Enhance Your Wake Experience With Our Smart Bulb!
          </HighLight>
          <Spacer style={{paddingTop: responsiveHeight(3)}} />

          <ModalText style={{textAlign: 'justify'}}>
            <HighLight>
              The Light Awake Smart LED Bulb allows you to have options for the
              color of light you wake up to,
            </HighLight>{' '}
            which means more methods to how you want to wake up.
          </ModalText>
          <Spacer />
          <ModalText style={{textAlign: 'justify'}}>
            <HighLight>
              Especially designed for use with the Light Awake app
            </HighLight>
            , the standard US-compatible bulb will work with any lamp. After an
            easy pairing process, the bulb can be used for light alarms or
            controlled as a smart bulb via the Light Awake app.
          </ModalText>
          <Spacer />
          <HighLight>
            Get yours today and try awaking to (more!) light and any color of
            the rainbow you desire.
          </HighLight>
          <Spacer style={{paddingTop: responsiveHeight(3)}} />
          <CancelContainer
            onPress={() => Linking.openURL('https://lightawake.biz/bulb/')}
            style={{marginLeft: 0}}>
            <ModalButtonContainer
              style={{
                backgroundColor: theme.colors.yellow,
                width: responsiveWidth(60),
              }}>
              <ButtonText>Wake With More Light!</ButtonText>
            </ModalButtonContainer>
          </CancelContainer>
          <Spacer />
          <CheckboxModalContainer>
            <BouncyCheckbox
              onPress={(isChecked) => setIsCheckboxSelected(isChecked)}
            />
            <CheckboxText>Do not show again</CheckboxText>
          </CheckboxModalContainer>
          <Spacer />
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default AdPopupModal;

const CancelContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;

const CheckboxModalContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CheckboxText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 14px;
`;

const HighLight = styled(ModalHeader)`
  font-size: ${responsiveFontSize(2)};
`;
