import React from 'react';
import {Modal} from 'react-native';

import {openComposer} from 'react-native-email-link';
import {responsiveWidth} from 'react-native-responsive-dimensions';

import styled from 'styled-components/native';
import {
  ModalBody,
  Backdrop,
  ButtonText,
  CancelContainer,
  ExitModalButton,
  ModalButtonContainer,
  ModalHeader,
  ModalText,
  ModalXIcon,
  Spacer,
} from '../../styles/commonStyledComponents';
import {scaleHeight, scaleWidth} from '../../styles/scales';
import {theme} from '../../styles/theme';

const StatusModal = ({
  statusModalOpen,
  setStatusModalOpen,
  status,
  message,
  error,
  navigation,
  to,
}) => {
  const handleCloseModal = (to) => {
    setStatusModalOpen(false);

    var navigate = {
      home: function () {
        return navigation.navigate('Home');
      },
      bulbs: function () {
        return navigation.navigate('Home', {from: 'pair'});
      },
    };

    navigate[to]();
  };

  const handleSendEmail = () => {
    openComposer({
      to: 'lightawaketest@gmail.com',
      // 'support@lightawake.biz',
      subject: 'Hey, I just encountered an error.',
      body: 'Error details: \n\n' + JSON.stringify(error),
    })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        navigation.navigate('Bulbs');
      });
  };

  function statusDisplay(status) {
    function isError() {
      return {
        icon: <IconImage source={require('../../../assets/error-icon.png')} />,
        cancelContainer: (
          <CancelContainer onPress={() => handleSendEmail()}>
            <ModalButtonContainer
              style={{
                backgroundColor: '#ffffff',
                width: scaleWidth(300),
              }}>
              <ButtonText>Send error details to support?</ButtonText>
            </ModalButtonContainer>
          </CancelContainer>
        ),
      };
    }

    function isSuccess() {
      return {
        icon: (
          <IconImage source={require('../../../assets/success-icon.png')} />
        ),
        cancelContainer: (
          <CancelContainer onPress={() => handleCloseModal(to)}>
            <ModalButtonContainer
              style={{
                backgroundColor: '#ffffff',
              }}>
              <ButtonText>Continue</ButtonText>
            </ModalButtonContainer>
          </CancelContainer>
        ),
      };
    }

    var displays = {
      Success: isSuccess,
      Error: isError,
    };

    return displays[status]?.();
  }

  return (
    <Modal visible={statusModalOpen} transparent={true} animationType="fade">
      <Backdrop>
        <ModalBody
          style={{width: responsiveWidth(90)}}
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          <ExitButtonContainer
            style={{alignItems: 'flex-end'}}
            onPress={() => handleCloseModal(to)}>
            <ExitModalButton>
              <ModalXIcon
                source={require('../../../assets/images/cancel.png')}
              />
            </ExitModalButton>
          </ExitButtonContainer>
          <ImageHolder style={{borderRadius: 100}}>
            {statusDisplay(status)?.icon}
          </ImageHolder>
          <ModalHeader
            style={{
              marginBottom: 10,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            {status}!
          </ModalHeader>
          <ModalText style={{marginLeft: 5, textAlign: 'center'}}>
            {message}
          </ModalText>
          <Spacer />
          {statusDisplay(status)?.cancelContainer}
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default StatusModal;

const ExitButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;

const ImageHolder = styled.View`
  height: ${scaleHeight(120)}px;
  width: ${scaleHeight(120)}px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconImage = styled.Image`
  width: ${scaleHeight(110)}px;
  height: ${scaleHeight(110)}px;
`;
