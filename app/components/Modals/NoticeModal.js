import React, {useState} from 'react';
import {Modal, View} from 'react-native';

import LottieView from 'lottie-react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import styled from 'styled-components/native';
import {
  Backdrop,
  ButtonText,
  ExitModalButton,
  ModalBody,
  ModalXIcon,
  ModalText,
  Spacer,
} from '../../styles/commonStyledComponents';
import {scaleHeight, scaleWidth} from '../../styles/scales';
import {theme} from '../../styles/theme';

const NoticeModal = ({noticeModalOpen, setNoticeModalOpen}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const notices = [
    {
      closeButton: <Spacer style={{marginBottom: responsiveHeight(2)}} />,
      animatedIcon: (
        <LottieView
          source={require('../../../assets/wifi.json')}
          style={{
            width: responsiveWidth(30),
            height: responsiveHeight(30),
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          autoPlay
          loop
        />
      ),
      message: (
        <ModalText
          style={{
            fontSize: responsiveFontSize(2.2),
            marginLeft: 5,
            textAlign: 'center',
          }}>
          Please confirm that the Wi-Fi signal the phone is connected to is 2.4
          GHz as it is required to add a bulb.
          {'\n'}
        </ModalText>
      ),
    },
    {
      closeButton: <Spacer style={{marginBottom: responsiveHeight(2)}} />,
      animatedIcon: (
        <LottieView
          source={require('../../../assets/password.json')}
          style={{
            width: responsiveWidth(30),
            height: responsiveHeight(30),
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          autoPlay
          loop
        />
      ),
      message: (
        <ModalText
          style={{
            fontSize: responsiveFontSize(2.2),
            marginLeft: 5,
            textAlign: 'center',
          }}>
          Wrong password is the main reason why pairing fails. Ensure that you
          have entered the right credentials.
          {'\n'}
        </ModalText>
      ),
    },
    {
      closeButton: (
        <ContinueContainer onPress={() => handleCloseModal()}>
          <ContinueModalButton
            style={{
              backgroundColor: '#ffffff',
            }}>
            <ButtonText>Continue</ButtonText>
          </ContinueModalButton>
        </ContinueContainer>
      ),
      animatedIcon: (
        <LottieView
          source={require('../../../assets/bulb.json')}
          style={{
            width: responsiveWidth(20),
            height: responsiveHeight(20),
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: responsiveHeight(1.5),
            marginBottom: responsiveHeight(8),
          }}
          autoPlay
          loop
        />
      ),
      message: (
        <ModalText
          style={{
            fontSize: responsiveFontSize(2.2),
            marginLeft: 5,
            textAlign: 'center',
          }}>
          Light bulb must be in pairing mode. To enter bulb's pairing mode, turn
          the bulb <Bold>ON-OFF-ON-OFF-ON</Bold>.{'\n'}
          <Bold style={{color: theme.colors.yellow}}>
            {'   '} Light bulb should be steadily blinking
          </Bold>
          .{'\n'}
        </ModalText>
      ),
    },
  ];

  const handleCloseModal = () => {
    setNoticeModalOpen(false);
  };

  const renderNotices = ({item, index}) => {
    return (
      <View key={index}>
        <View>{item.animatedIcon}</View>
        <Spacer />
        {item.message}
        {item.closeButton}
      </View>
    );
  };

  return (
    <Modal visible={noticeModalOpen} transparent={true} animationType="fade">
      <Backdrop>
        <ModalBody
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          <ExitButtonContainer
            style={{alignItems: 'flex-end'}}
            onPress={() => handleCloseModal()}>
            <ExitModalButton>
              <ModalXIcon
                source={require('../../../assets/images/cancel.png')}
              />
            </ExitModalButton>
          </ExitButtonContainer>
          <Carousel
            data={notices}
            renderItem={renderNotices}
            sliderWidth={scaleWidth(380)}
            itemWidth={scaleWidth(350)}
            layout={'default'}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
          <Pagination
            dotsLength={notices.length}
            activeDotIndex={activeSlide}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
            }}
          />
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default NoticeModal;

const ContinueContainer = styled.TouchableOpacity`
  display: flex;
  align-items: flex-end;
`;

const ContinueModalButton = styled.View`
  width: ${scaleWidth(125)}px;
  height: ${scaleHeight(40)}px;
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;

const ExitButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;

const Bold = styled(ModalText)`
  font-weight: 700;
`;
