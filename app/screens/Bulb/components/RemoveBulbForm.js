import React from 'react';
import {Modal} from 'react-native';

import {removeDevice} from '@volst/react-native-tuya';

import styled from 'styled-components/native';
import {
  ModalBody,
  Backdrop,
  ButtonText,
  CancelContainer,
  ModalButtonContainer,
  ModalHeader,
  ModalText,
} from '../../../styles/commonStyledComponents';
import {theme} from '../../../styles/theme';

import {Toast} from '../../../components/Globals/Toast';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const RemoveBulbForm = ({
  showRemoveForm,
  setShowRemoveForm,
  deviceId,
  navigation,
}) => {
  async function deleteDevice() {
    try {
      await removeDevice({devId: deviceId});
      setTimeout(() => {
        setShowRemoveForm(false);
        navigation.navigate('Bulbs', {from: 'bulb'});
      }, 500);
    } catch (error) {
      Toast('Error', error, 'danger', 'danger');
    }
  }

  return (
    <Modal visible={showRemoveForm} transparent={true} animationType="fade">
      <Backdrop>
        <ModalBody
          style={{
            height: responsiveScreenHeight(30),
            width: responsiveScreenWidth(85),
          }}
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          <ModalHeader
            style={{
              marginBottom: 10,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            Remove Device?
          </ModalHeader>
          <ModalText style={{marginLeft: 5, textAlign: 'center'}}>
            Bulb will be disabled after the device is removed.
          </ModalText>
          <Spacer />
          <ButtonsContainer>
            <ButtonContainer onPress={() => setShowRemoveForm(false)}>
              <ModalButtonContainer
                style={{
                  backgroundColor: '#f3d449',
                }}>
                <ButtonText>Cancel</ButtonText>
              </ModalButtonContainer>
            </ButtonContainer>
            <ButtonContainer onPress={() => deleteDevice()}>
              <ModalButtonContainer
                style={{
                  backgroundColor: '#ffffff',
                }}>
                <ButtonText>Confirm</ButtonText>
              </ModalButtonContainer>
            </ButtonContainer>
          </ButtonsContainer>
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default RemoveBulbForm;

const ButtonContainer = styled(CancelContainer)``;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

export const Spacer = styled.View`
  padding-top: ${responsiveScreenHeight(4)};
`;
