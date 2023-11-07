import React from 'react';
import {TouchableOpacity} from 'react-native';
import {DateTimePickerModal} from 'react-native-modal-datetime-picker';

import AlarmSoundPicker from './components/AlarmSoundPicker';
import BulbPulseRate from './components/BulbPulseRate';
import FlashlightPulseRate from './components/FlashlightPulseRate';
import ScreenColorPicker from './components/ScreenColorPicker';
import ScreenPulseRate from './components/ScreenPulseRate';
import SleepSoundPicker from './components/SleepSoundPicker';
import {PairBulbWithUsButton} from '../../components/PairBulbWithUsButton';
import BackButton from '../../../../components/Globals/BackButton';

import styled from 'styled-components/native';
import {scaleWidth, scaleHeight} from '../../../../styles/scales';
import {
  ButtonText,
  ScreenContainer as DefaultScreenContainer,
  ScreenContent,
  ScreenHead,
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
  StackContainer,
  ClockBarContainer,
  Clock,
  PeriodContainer,
  PeriodText,
  StackChildWrapper,
} from '../../../../styles/commonStyledComponents';
import RNUxcam from 'react-native-ux-cam';

export default function FreeAlarmSettingsScreen({
  setDatePickerVisibility,
  isDatePickerVisible,
  timeFormat,
  handleConfirm,
  hideDatePicker,
  handleStartAlarm,
  scaleWidth,
  isFocused,
  activeBulbs,
  navigation,
  selectedDate,
}) {
  RNUxcam.tagScreenName('Alarm Screen');
  return (
    <ScreenContainer>
      <ScreenHead>
        <BackButton
          onPress={() =>
            navigation.navigate('Alarms', {
              selectedDate,
            })
          }
        />
        <ScreenTitle>SET ALARM TIME</ScreenTitle>
      </ScreenHead>
      <ScreenContent
        style={{
          paddingTop: 0,
        }}>
        <ClockBar>
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <Clock>{selectedDate.timeToDisplay}</Clock>
          </TouchableOpacity>

          {selectedDate.period && (
            <PeriodContainer>
              <PeriodText active={selectedDate.period === 'AM'}>AM</PeriodText>
              <PeriodText active={selectedDate.period === 'PM'}>PM</PeriodText>
            </PeriodContainer>
          )}
        </ClockBar>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          date={selectedDate.raw}
          locale={timeFormat === '24' ? 'en_GB' : 'en_US'} // hack for 24h time picker in iOS
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          headerTextIOS="Pick alarm time"
        />
        <SetAlarmButton onPress={handleStartAlarm}>
          <ButtonText
            style={{
              fontSize: scaleWidth(20),
            }}>
            Set Alarm
          </ButtonText>
        </SetAlarmButton>
      </ScreenContent>
      <BackgroundImage
        source={require('../../../../../assets/images/settings-background.png')}
        resizeMode="stretch">
        <Stack>
          <ScreenColorPicker />
          <ScreenPulseRate />
          <FlashlightPulseRate />
          <AlarmSoundPicker
            isScreenFocused={isFocused}
            navigation={navigation}
          />
          {activeBulbs?.length > 0 ? (
            <BulbPulseRate />
          ) : (
            <PairBulbWithUsButton navigation={navigation} />
          )}
          <SleepSoundPicker navigation={navigation} />
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
