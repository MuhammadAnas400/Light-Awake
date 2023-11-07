import React, {useEffect, useState} from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {useTimeFormatContext} from '../../contexts/time-format.context';

import useTime from '../../hooks/useTime';

import styled from 'styled-components/native';
import {
  ClockBarContainer,
  Clock,
  PeriodContainer,
  PeriodText,
  IllustratedBackgroundImage,
} from '../../styles/commonStyledComponents';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../network/AxiosRequestHandler';
import SurveyPrompt from './components/SurveyPrompt';
import {useTimer} from './hooks/useTimer';
import GiftPrompt from './components/GiftPrompt';
import InformUserModal from '../../components/Modals/InformUserModal';
import RNUxcam from 'react-native-ux-cam';


const Home = ({navigation, route}) => {
  const {timeFormat, setTimeFormat} = useTimeFormatContext();

  const {timer, hasAnsweredSurvey} = useTimer();
  const {timeToDisplay, period} = useTime(timeFormat);
  const isFocused = useIsFocused();

  const [isLoggedIn, setIsLoggedIn] = useState();
  const [promptSurvey, setPromptSurvey] = useState(false);
  const [promptGift, setPromptGift] = useState(false);
  const [informUserModal, setInformUserModal] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);

  const handleFormatIconPress = () => {
    setTimeFormat((prevFormat) => (prevFormat === '24' ? '12' : '24'));
  };

  const handleClockIconPress = () => {
    navigation.navigate('Alarms', {timeToDisplay, period});
  };

  const handleInfoIconPress = () => {
    navigation.navigate('About');
  };

  const handleBulbPress = () => {
    navigation.navigate('Bulbs');
    // navigation.navigate('Pair');
  };

  const handleIconPress = () => {
    isLoggedIn ? navigation.navigate('Store') : navigation.navigate('Auth');
  };

  const handleIsLoggedIn = (status) => {
    setIsLoggedIn(status);
  };

  async function verifyUser() {
    try {
      const data = {};
      const requestConfig = {
        data: data,
        method: method.post,
        url: `${connectionPath.auth.verifyUser}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        handleIsLoggedIn(true);
      }
    } catch (error) {
      handleIsLoggedIn(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      verifyUser();
      // setPromptGift(true);
      // setPromptSurvey(true);
    }
  }, [isLoggedIn, isFocused]);

  useEffect(() => {
    if (route.params != undefined) {
      setTimeout(() => {
        setPromptGift(true);
      }, 500);
    }
  }, [route.params]);

  useEffect(() => {
    if (new Date().getDate() == timer) {
      if (hasAnsweredSurvey == null) {
        setPromptSurvey(true);
      }
    }
  }, [timer]);

  RNUxcam.tagScreenName('Home Screen');
  
  return (
    <IllustratedBackgroundImage
      source={require('../../../assets/images/home-background.png')}
      resizeMode="cover">
      <SafeAreaView>
        <ContentContainer>
          <TopBar>
            <TouchableOpacity onPress={handleFormatIconPress}>
              <IconImage
                source={
                  timeFormat === '24'
                    ? require('../../../assets/images/12-format-icon.png')
                    : require('../../../assets/images/24-format-icon.png')
                }
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleInfoIconPress}>
              <IconImage
                source={require('../../../assets/images/info-icon.png')}
              />
            </TouchableOpacity>
          </TopBar>
          <ClockBarContainer>
            <Clock>{timeToDisplay}</Clock>
            {period && (
              <PeriodContainer>
                <PeriodText active={period === 'AM'}>AM</PeriodText>
                <PeriodText active={period === 'PM'}>PM</PeriodText>
              </PeriodContainer>
            )}
          </ClockBarContainer>
          <BottomBar>
            <TouchableOpacity onPress={handleIconPress}>
              {isLoggedIn ? (
                <IconImage
                  source={require('../../../assets/images/store-icon.png')}
                />
              ) : (
                <IconImage
                  source={require('../../../assets/images/user-icon.png')}
                />
              )}
            </TouchableOpacity>
            <AlarmTouchable onPress={handleClockIconPress}>
              <ClockIcon
                source={require('../../../assets/images/clock-icon.png')}
              />
            </AlarmTouchable>
            <TouchableOpacity onPress={handleBulbPress}>
              <IconImage
                source={require('../../../assets/images/bulb-icon.png')}
              />
            </TouchableOpacity>
          </BottomBar>
        </ContentContainer>
      </SafeAreaView>
      <SurveyPrompt
        promptSurvey={promptSurvey}
        setPromptSurvey={setPromptSurvey}
        navigation={navigation}
      />
      <GiftPrompt
        promptGift={promptGift}
        setPromptGift={setPromptGift}
        informUserModal={informUserModal}
        setInformUserModal={setInformUserModal}
        isGuestUser={isGuestUser}
        setIsGuestUser={setIsGuestUser}
      />
      <InformUserModal
        informUserModal={informUserModal}
        setInformUserModal={setInformUserModal}
        greetings={'Gift received!'}
        message={
          isGuestUser
            ? 'Oops! It looks like you do not have an account with us. To be able to use the gift, you need to create an account.'
            : 'To check item you can visit the Store or go directly to the Alarm Settings.'
        }
        isGuestUser={isGuestUser}
        navigation={navigation}
      />
    </IllustratedBackgroundImage>
  );
};

export default Home;

const ContentContainer = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopBar = styled.View`
  width: 100%;
  padding-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BottomBar = styled.View`
  width: 100%;
  padding-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const IconImage = styled.Image`
  width: 60px;
  height: 60px;
  margin: 0 32px;
`;

const AlarmTouchable = styled.TouchableOpacity`
  height: 140px;
  width: 140px;
  border-radius: 70px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.yellow};
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
`;

const ClockIcon = styled.Image`
  height: 70px;
  width: 70px;
`;
