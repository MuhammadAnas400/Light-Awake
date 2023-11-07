import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, Keyboard, View} from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import BackButton from '../../components/Globals/BackButton';
import NoticeModal from '../../components/Modals/NoticeModal';
import Form from './components/Form';

import styled from 'styled-components/native';
import {
  BackgroundImage,
  ScreenContent,
  ScreenTitle,
  ScreenHead,
  ScreenContainer as DefaultScreenContainer,
  Spacer,
} from '../../styles/commonStyledComponents';
import {useWifi} from './hooks/useWifi';
import {useTuyaServices} from '../../hooks/useTuyaServices';
import RNUxcam from 'react-native-ux-cam';

const Pair = ({navigation}) => {

  RNUxcam.tagScreenName('Pair Screen');

  const {requestLocationAuthorizationIos, requestLocationAuthorizationAndroid} =
    useWifi();
  const {loginTuya} = useTuyaServices();
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [isPairing, setIsPairing] = useState(false);

  useEffect(() => {
    loginTuya();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestLocationAuthorizationIos();
    }

    if (Platform.OS === 'android') {
      requestLocationAuthorizationAndroid();
    }

    setNoticeModalOpen(true);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' && 'padding'}
      style={{flex: 1, backgroundColor: '#24146C'}}>
      <ScreenContainer>
        <ScreenHead>
          <BackButton onPress={() => navigation.goBack()} />
          <ScreenTitle />
        </ScreenHead>
        <Spacer />
        <ScreenContent style={{width: `85%`}}>
          <ScreenTitle>
            {isPairing
              ? 'Adding device...'
              : 'Select 2.4GHz Wi-Fi Network and enter password.'}
          </ScreenTitle>
          <ScreenSubTitle>
            {isPairing
              ? 'Please allow the pairing to complete within 5 minutes.'
              : 'If your Wi-Fi is 5GHz, please set it to be 2.4GHz.'}
          </ScreenSubTitle>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              paddingTop: responsiveScreenHeight(25),
            }}>
            <Form
              isPairing={isPairing}
              setIsPairing={setIsPairing}
              navigation={navigation}
            />
          </View>
        </ScreenContent>
        {noticeModalOpen && (
          <NoticeModal
            noticeModalOpen={noticeModalOpen}
            setNoticeModalOpen={setNoticeModalOpen}
          />
        )}
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

export default Pair;

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const ScreenSubTitle = styled(ScreenTitle)`
  padding-top: 10px;
  font-size: ${responsiveScreenFontSize(1.8)};
  text-align: center;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.regular};
`;

// 1.
// async function register() {
//   var result = await getRegisterEmailValidateCode({
//     countryCode: '+1',
//     email: 'lightawaketest@gmail.com',
//   });

//   console.log(result);
// }

// 2.
// async function reg() {
//   var result = await registerAccountWithEmail({
//     countryCode: '1',
//     email: 'lightawaketest@gmail.com',
//     password: 'Password',
//     validateCode: '825871',
//   });

//   console.log(result);
// }

//3
// async function homeCreate() {
//   var result = await createHome({
//     name: 'Koda 3',
//     geoName: 'Tipolo, Mandaue City, Cebu',
//     lon: 123.9303588355983,
//     lat: 10.337527075788469,
//     rooms: ['Office 3'],
//   });
//   // await dismissHome({
//   //   homeId: 50115720,
//   // });
//   console.log(result);
// }
