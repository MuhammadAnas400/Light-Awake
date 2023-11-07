import React from 'react';
import {TouchableOpacity} from 'react-native';
import {DateTimePickerModal} from 'react-native-modal-datetime-picker';

import UpgradeBulbPulseRate from './components/UpgradeBulbPulseRate';
import UpgradeFlashlightPulseRate from './components/UpgradeFlashlightPulseRate';
import UpgradeScreenColorPicker from './components/UpgradeScreenColorPicker';
import UpgradeScreenPulseRate from './components/UpgradeScreenPulseRate';
import UpgradeSleepSoundPicker from './components/UpgradeSleepSoundPicker';
import UpgradeAlarmSoundPicker from './components/UpgradeAlarmSoundPicker';
import {PairBulbWithUsButton} from '../../components/PairBulbWithUsButton';
import BackButton from '../../../../components/Globals/BackButton';

import styled from 'styled-components/native';
import {scaleWidth, scaleHeight} from '../../../../styles/scales';
import {
  ButtonText,
  ScreenContainer as DefaultScreenContainer,
  ScreenContent,
  ScreenHead,
  StackContainer,
  ClockBarContainer,
  Clock,
  PeriodContainer,
  PeriodText,
  StackChildWrapper,
} from '../../../../styles/commonStyledComponents';
import RNUxcam from 'react-native-ux-cam';

export default function UpgradeAlarmSettingsScreen({
  navigation,
  selectedDate,
  setDatePickerVisibility,
  date,
  alarm,
  isDatePickerVisible,
  timeFormat,
  handleConfirm,
  hideDatePicker,
  handleStartAlarm,
  hasUpdated,
  setHasUpdated,
  isFocused,
  activeBulbs,
  sleepSoundHourLimit,
  addTrackToQueue,
}) {
  RNUxcam.tagScreenName('Alarm Screen');
  return (
    <ScreenContainer>
      <ScreenHead>
        <BackButton
          onPress={() => navigation.navigate('Alarms', {selectedDate})}
        />
        <ScreenTitle>SET ALARM TIME</ScreenTitle>
      </ScreenHead>
      <ScreenContent style={{paddingTop: 0}}>
        <ClockBar>
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <Clock>
              {date((alarm.alarm ?? selectedDate).raw).timeToDisplay}
            </Clock>
          </TouchableOpacity>
          {alarm.alarm?.period && (
            <PeriodContainer>
              <PeriodText active={date(alarm.alarm?.raw).period === 'AM'}>
                AM
              </PeriodText>
              <PeriodText active={date(alarm.alarm?.raw).period === 'PM'}>
                PM
              </PeriodText>
            </PeriodContainer>
          )}
        </ClockBar>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          date={new Date(alarm.alarm?.raw)}
          locale={timeFormat === '24' ? 'en_GB' : 'en_US'} // hack for 24h time picker in iOS
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          headerTextIOS="Pick alarm time"
        />
        <SetAlarmButton onPress={handleStartAlarm}>
          <ButtonText style={{fontSize: scaleWidth(20)}}>Set Alarm</ButtonText>
        </SetAlarmButton>
      </ScreenContent>
      <BackgroundImage
        source={require('../../../../../assets/images/settings-background.png')}
        resizeMode="stretch">
        <Stack>
          <UpgradeScreenColorPicker
            alarm={alarm?.alarm}
            hasUpdated={hasUpdated}
            setHasUpdated={setHasUpdated}
          />
          {/* <UpgradeWakeupArtPicker
          alarm={alarm?.alarm}
          navigation={navigation}
        /> */}
          <UpgradeScreenPulseRate
            alarm={alarm?.alarm}
            hasUpdated={hasUpdated}
            setHasUpdated={setHasUpdated}
          />
          <UpgradeFlashlightPulseRate
            alarm={alarm?.alarm}
            hasUpdated={hasUpdated}
            setHasUpdated={setHasUpdated}
          />
          {activeBulbs?.length > 0 ? (
            <UpgradeBulbPulseRate
              alarm={alarm?.alarm}
              hasUpdated={hasUpdated}
              setHasUpdated={setHasUpdated}
            />
          ) : (
            <PairBulbWithUsButton navigation={navigation} />
          )}
          <UpgradeAlarmSoundPicker
            isScreenFocused={isFocused}
            alarm={alarm?.alarm}
            hasUpdated={hasUpdated}
            setHasUpdated={setHasUpdated}
            addTrackToQueue={addTrackToQueue}
            navigation={navigation}
          />
          <UpgradeSleepSoundPicker
            isScreenFocused={isFocused}
            alarm={alarm?.alarm}
            hasUpdated={hasUpdated}
            setHasUpdated={setHasUpdated}
            sleepSoundHourLimit={sleepSoundHourLimit}
            addTrackToQueue={addTrackToQueue}
            navigation={navigation}
          />
        </Stack>
      </BackgroundImage>
    </ScreenContainer>
  );
}

const Stack = ({children}) => {
  return (
    <StackContainer
      style={{marginTop: scaleHeight(96), backgroundColor: '#211168'}}
      showsVerticalScrollIndicator={true}>
      {React.Children.map(children, (child, index) => {
        const isLastChild = index === children.length - 1;
        return isLastChild ? (
          child
        ) : (
          <StackChildWrapper>{child}</StackChildWrapper>
        );
      })}
    </StackContainer>
  );
};

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const ClockBar = styled(ClockBarContainer)`
  background-color: ${(props) => props.theme.colors.darkIndigo};
  min-width: ${scaleWidth(278)}px;
  min-height: ${scaleHeight(101)}px;
  border-radius: ${scaleWidth(12)}px;
  margin-top: ${scaleHeight(53)}px;
  margin-bottom: ${scaleHeight(17)}px;
  padding: ${scaleWidth(2)}px;
`;

const BackgroundImage = styled.ImageBackground`
  position: absolute;
  width: 100%;
  height: 65%;
  bottom: 0;
`;

const ScreenTitle = styled.Text`
  width: 100%;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${scaleWidth(24)}px;
  text-align: center;
`;

const SetAlarmButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
`;
