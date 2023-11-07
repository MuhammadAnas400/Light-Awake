import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import * as Brightness from 'expo-brightness';
import {useKeepAwake, deactivateKeepAwake} from 'expo-keep-awake';

import useTime from '../../../hooks/useTime';
import useAppState from '../hooks/useAppState';
import useNotify from '../hooks/useNotify';
import {useTuyaServices} from '../../../hooks/useTuyaServices';
import {formatTo24hFormat, formatTo12hFormat} from '../../../constants/utils';

import {useTimeFormatContext} from '../../../contexts/time-format.context';
import {useDeviceBrightnessContext} from '../../../contexts/device-brightness.context';

import styled from 'styled-components/native';
import {scaleWidth} from '../../../styles/scales';
import {
  IllustratedBackgroundImage,
  ClockBar,
} from '../../../styles/commonStyledComponents';
import RNUxcam from 'react-native-ux-cam';

const FreeSleep = ({route, navigation}) => {
  RNUxcam.tagScreenName('Sleep Screen');
  useKeepAwake();
  const {timeFormat} = useTimeFormatContext();
  const {timeToDisplay, period, nowDateInMiliseconds} = useTime(timeFormat);
  const {readyToChangeBrightness, restoreDeviceBrightnessWhenAppIsReady} =
    useDeviceBrightnessContext();
  const {appStateVisible} = useAppState();
  const {notify} = useNotify();
  const {turnBulbOff} = useTuyaServices();
  const [isScrensaverActive, setIsScreensaverActive] = useState(false);
  const [displayTurnOffMessage, setDisplayTurnOffMessage] = useState(false);
  const isFocused = useIsFocused();

  const {adjustedAlarmDateInMiliseconds} = route.params;
  const alarmDate = new Date(adjustedAlarmDateInMiliseconds);
  alarmDate.setSeconds(0);
  const alarmHours = alarmDate.getHours();
  const alarmMinutes = alarmDate.getMinutes();
  const {timeToDisplay: alarmTimeToDisplay, period: alarmPeriod} =
    timeFormat === '24'
      ? formatTo24hFormat(alarmHours, alarmMinutes)
      : formatTo12hFormat(alarmHours, alarmMinutes);

  useEffect(() => {
    turnBulbOff();
  }, []);

  useEffect(() => {
    restoreDeviceBrightnessWhenAppIsReady();
    if (appStateVisible == 'background') {
      notify();
    }
  }, [appStateVisible]);

  useEffect(() => {
    const setMinimumBrightness = async () => {
      // setting brightness after moving app to background on android
      // doesn't work if we didn't get brightness earlier
      await Brightness.getBrightnessAsync();
      await Brightness.setBrightnessAsync(0);
    };

    if (readyToChangeBrightness && isFocused) {
      setMinimumBrightness();
    }
  }, [readyToChangeBrightness, isFocused]);

  useEffect(() => {
    if (!isScrensaverActive) {
      const screensaverDelay = setTimeout(() => {
        setIsScreensaverActive(true);
      }, 60000);
      return () => clearTimeout(screensaverDelay);
    }
  }, [isScrensaverActive]);

  // useEffect(() => {
  //   const soundPlayer = new Sound(sleepSound, Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log('failed to load the sound', error);
  //       return;
  //     }
  //     soundPlayer.setNumberOfLoops(-1);

  //     soundPlayer.setVolume(mapVolumeSettingToDecimal(sleepSoundVolume));

  //     if (sleepSoundEnabled) {
  //       soundPlayer.play();
  //     }
  //   });

  //   setTimeout(() => {
  //     let index = +sleepSoundVolume;

  //     var interval = setInterval(() => {
  //       if (index > 0) {
  //         index--;
  //         const element = volumeSettings[index];

  //         soundPlayer.setVolume(element.volume);
  //       } else {
  //         soundPlayer.stop();
  //       }
  //     }, 500);

  //     setTimeout(() => {
  //       clearInterval(interval);
  //     }, +sleepSoundVolume * 10000);
  //   }, mapSleepSoundSettingToTimeInMilliseconds(sleepSoundTimer));

  //   return () => {
  //     soundPlayer.stop();
  //   };
  // }, [sleepSound, sleepSoundEnabled]);

  useEffect(() => {
    if (alarmDate.getTime() <= nowDateInMiliseconds) {
      setTimeout(() => {
        navigation.replace('FreeAlarm');
      }, 1000);
    }
  }, [nowDateInMiliseconds || alarmDate]);

  const disableScreensaver = () => {
    setIsScreensaverActive(false);
  };

  const handleCancelAlarmPress = () => {
    setDisplayTurnOffMessage(true);
  };

  const handleTurnOffPress = () => {
    deactivateKeepAwake();
    navigation.goBack();
  };

  const handleBackButtonPress = () => {
    setDisplayTurnOffMessage(false);
  };

  if (isScrensaverActive) {
    return (
      <TouchableWithoutFeedback onPress={disableScreensaver}>
        <Screensaver />
      </TouchableWithoutFeedback>
    );
  }

  return (
    <IllustratedBackgroundImage
      source={require('../../../../assets/images/home-background.png')}
      resizeMode="cover">
      <Background displayTurnOffMessage={displayTurnOffMessage} />
      <Container>
        <ClockContainer>
          <ClockBar>
            <Clock periodExist={Boolean(period)}>{timeToDisplay}</Clock>
            {period ? (
              <PeriodContainer>
                <PeriodText active={period === 'AM'}>AM</PeriodText>
                <PeriodText active={period === 'PM'}>PM</PeriodText>
              </PeriodContainer>
            ) : null}
          </ClockBar>
          <AlarmTimeBanner periodExist={Boolean(alarmPeriod)}>
            Alarm time: {alarmTimeToDisplay} {alarmPeriod}
          </AlarmTimeBanner>
        </ClockContainer>
      </Container>
      <TurnOffContainer>
        {displayTurnOffMessage ? (
          <>
            <TurnOffMessage>
              Do you really want to turn off the alarm?
            </TurnOffMessage>
            <TurnOffButton onPress={handleTurnOffPress}>
              <TurnOffText>Turn off</TurnOffText>
            </TurnOffButton>
            <BackButton onPress={handleBackButtonPress}>
              <BackButtonText>Back</BackButtonText>
            </BackButton>
          </>
        ) : (
          <CancelContainer
            onPress={handleCancelAlarmPress}
            displayTurnOffMessage={displayTurnOffMessage}>
            <CancelButton>
              <XIcon source={require('../../../../assets/images/cancel.png')} />
            </CancelButton>
            <CancelText>Cancel</CancelText>
          </CancelContainer>
        )}
      </TurnOffContainer>
    </IllustratedBackgroundImage>
  );
};

const Screensaver = styled.View`
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Background = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.darkBlueGray};
  opacity: 0.8;
  z-index: ${(props) => (props.displayTurnOffMessage ? 1 : 0)};
`;

const Container = styled.SafeAreaView`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClockContainer = styled.View`
  width: 100%;
  padding-bottom: 10%;
  display: flex;
`;

const Clock = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.black};
  font-size: ${(props) => (props.periodExist ? 90 : 100)}px;
`;

const PeriodContainer = styled.View`
  display: flex;
  margin-left: 16px;
`;

const PeriodText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.black};
  font-size: 24px;
  opacity: ${(props) => (props.active ? 1 : 0.3)};
`;

const AlarmTimeBanner = styled.Text`
  width: ${Math.max(scaleWidth(300), 300)}px;
  padding: 4px;
  margin: auto;
  border-radius: 12px;
  overflow: hidden;
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${(props) => (props.periodExist ? 26 : 30)}px;
  text-align: center;
  color: white;
  background-color: ${(props) => props.theme.colors.eggplant};
  opacity: 0.9;
`;

const CancelContainer = styled.TouchableOpacity`
  display: flex;
  align-items: center;
`;

const CancelButton = styled.View`
  height: 64px;
  width: 64px;
  border-radius: 32px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
  background-color: ${(props) => props.theme.colors.white};
`;

const CancelText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 24px;
  margin-bottom: 32px;
`;

const XIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const TurnOffContainer = styled.View`
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 3;
`;

const TurnOffMessage = styled.Text`
  width: 265px;
  margin: auto;
  margin-bottom: 64px;
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 26px;
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

const TurnOffButton = styled.TouchableOpacity`
  width: 265px;
  height: 80px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 52px;
  background-color: ${(props) => props.theme.colors.white};
`;

const TurnOffText = styled.Text`
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 30px;
  color: ${(props) => props.theme.colors.eggplant};
`;

const BackButton = styled.TouchableOpacity`
  width: 265px;
  height: 80px;
  margin: auto;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackButtonText = styled.Text`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 30px;
  color: ${(props) => props.theme.colors.white};
`;

export default FreeSleep;
