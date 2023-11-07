import React, {useState, useEffect, useCallback} from 'react';
import {Modal, Linking, ScrollView, Alert} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import TrackPlayer from 'react-native-track-player';

import UpgradeAlarmSettingsScreen from './UpgradeAlarmSettingsScreen';
import styled from 'styled-components/native';
import {
  Backdrop,
  CancelContainer,
  ExitModalButton,
  ScreenContainer as DefaultScreenContainer,
  Spacer,
  ModalBody,
  ModalHeader,
  ModalText,
  ModalXIcon,
} from '../../../../styles/commonStyledComponents';
import {theme} from '../../../../styles/theme';

import {useTimeFormatContext} from '../../../../contexts/time-format.context';
import {useDeviceBrightnessContext} from '../../../../contexts/device-brightness.context';
import {useAlarmTimeContext} from '../../../../contexts/alarm-time.context';
import {useWakeUpContext} from '../../../../contexts/wake-up.context';

import useTime from '../../../../hooks/useTime';
import StorageProperty from '../../../../constants/storage-property';
import {
  getAsyncStorageData,
  storeAsyncStorageData,
} from '../../../../constants/utils';
import updateAlarmDetails from '../helper/updateAlarmDetails';
import useDateTime from '../../hooks/useDateTime';
import {useAlarm} from '../../hooks/useAlarm';
import {useActiveBulbs} from '../../../../hooks/useActiveBulbs';
import {useTuyaServices} from '../../../../hooks/useTuyaServices';

export default function UpgradeAlarmSettingsContainer({navigation, route}) {
  const {id} = route.params;

  //contexts
  const {hours, setHours, minutes, setMinutes} = useAlarmTimeContext();
  const {timeFormat} = useTimeFormatContext();
  const {restoreDeviceBrightnessWhenAppIsReady} = useDeviceBrightnessContext();
  const {bulbPulseRateEnabled} = useWakeUpContext();
  const {date, getFormattedDate} = useDateTime();

  //state
  const [hasUpdated, setHasUpdated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [isModalDisabled, setIsModalDisabled] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const loadedDate = new Date();
    loadedDate.setMinutes(minutes);
    loadedDate.setHours(hours);
    return getFormattedDate(loadedDate);
  });
  const [tacPopUpModalOpen, setTacPopUpModalOpen] = useState(false);
  const [isTacCheckboxSelected, setIsTacCheckboxSelected] = useState(false);
  const [isTacPopUpModalDisabled, setIsTacPopUpModalDisabled] = useState(true);
  const [sleepSoundHourLimit, setSleepSoundHourLimit] = useState([]);
  const [queue, setQueue] = useState([]);

  //hooks
  const {nowDate} = useTime(timeFormat);
  const {alarm} = useAlarm(id, hasUpdated, timeFormat);
  const isFocused = useIsFocused();
  const [activeBulbs, {getActivatedDevices}] = useActiveBulbs();
  const {turnBulbOff} = useTuyaServices();

  const Link = ({href, children}) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(href);
      if (supported) {
        await Linking.openURL(href);
      } else {
        throw new Error(`Don't know how to open this href: ${href}`);
      }
    }, [href]);

    return <HighLight onPress={handlePress}>{children}</HighLight>;
  };

  useEffect(() => {
    async function setupTrackPlayer() {
      try {
        await TrackPlayer.setupPlayer();
      } catch (error) {
        console.log(error);
      }
    }

    setupTrackPlayer();
    getActivatedDevices();
  }, []);

  useEffect(() => {
    async function checkUserTacPopUpModalPreference() {
      const disableTacModal = await getAsyncStorageData(
        StorageProperty.TAC_MODAL_DISABLED,
      );
      setIsTacPopUpModalDisabled(disableTacModal === 'true');
    }

    checkUserTacPopUpModalPreference();
    setTacPopUpModalOpen(true);
  }, []);

  useEffect(() => {
    async function checkUserModalPreference() {
      const disableWarningModal = await getAsyncStorageData(
        StorageProperty.WARNING_MODAL_DISABLED,
      );

      setIsModalDisabled(disableWarningModal === 'true');
    }

    checkUserModalPreference();
  }, []);

  useEffect(() => {
    if (isFocused) {
      restoreDeviceBrightnessWhenAppIsReady();
    }
  }, [restoreDeviceBrightnessWhenAppIsReady, isFocused]);

  useEffect(() => {
    setSelectedDate(getFormattedDate(selectedDate.raw, timeFormat));
  }, [selectedDate.raw, timeFormat]);

  const handleTacCloseModal = (isDisabled) => {
    setIsCheckboxSelected(isDisabled);
    setTacPopUpModalOpen(false);
    setIsTacPopUpModalDisabled(isDisabled);
    storeAsyncStorageData(StorageProperty.TAC_MODAL_DISABLED, `${isDisabled}`);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();

    handleStoreTime(getFormattedDate(date, timeFormat));
    getSleepSoundHourLimit(date);
  };

  const getSleepSoundHourLimit = (selectedTime) => {
    const hoursTilAlarm =
      new Date(selectedTime).getHours() - new Date().getHours();
    const twentyFourHoursInHours =
      hoursTilAlarm < 0 && Math.abs(hoursTilAlarm) * 2;

    const hours = hoursTilAlarm < 0 ? twentyFourHoursInHours : hoursTilAlarm;

    createSleepSoundHourSettings(hours);
  };

  const createSleepSoundHourSettings = (hours) => {
    const sleepSoundTimerSettings = [];
    const hoursTilAlarm = hours < 10 ? hours : 10;

    for (let index = 0; index <= hoursTilAlarm; index++) {
      let setting = {};
      const name = index === 0 ? '0.5' : index.toString();
      const milliseconds = index === 0 ? 1800000 : 3600000 * index;

      setting = {name, milliseconds};
      sleepSoundTimerSettings.push(setting);
    }

    sleepSoundTimerSettings.length === 0 &&
      sleepSoundTimerSettings.push({
        name: '0.5',
        milliseconds: 1800000,
      });

    setSleepSoundHourLimit(sleepSoundTimerSettings);
  };

  const adjustAlarmDate = () => {
    const selectedHour = new Date(alarm.alarm?.raw).getHours();
    const selectedMinutes = new Date(alarm.alarm?.raw).getMinutes();

    const currentHour = nowDate.getHours();
    const currentMinutes = nowDate.getMinutes();

    // We create a new date object and set time on it because `selectedDate` can
    // be a date in the past. We only need the time part to set an alarm.
    const alarmDate = new Date();
    alarmDate.setMilliseconds(0);
    alarmDate.setSeconds(0);
    alarmDate.setHours(selectedHour);
    alarmDate.setMinutes(selectedMinutes);
    const alarmDateInMiliseconds = alarmDate.getTime();
    const twentyFourHoursInMiliseconds = 24 * 60 * 60 * 1000;

    return selectedHour < currentHour ||
      (selectedHour === currentHour && selectedMinutes < currentMinutes)
      ? alarmDateInMiliseconds + twentyFourHoursInMiliseconds
      : alarmDateInMiliseconds;
  };

  const handleCloseModal = (isDisabled) => {
    const adjustedAlarmDateInMiliseconds = adjustAlarmDate();

    setModalOpen(false);
    setIsModalDisabled(isDisabled);
    storeAsyncStorageData(
      StorageProperty.WARNING_MODAL_DISABLED,
      `${isDisabled}`,
    );
    navigation.navigate('UpgradeSleep', {
      adjustedAlarmDateInMiliseconds,
      alarm,
      sleepSoundHourLimit,
    });
  };

  const handleStartAlarm = async () => {
    var uniq = getUniqueQueue();

    if (uniq) {
      await TrackPlayer.add(uniq);
    }

    if (bulbPulseRateEnabled) {
      turnBulbOff();
    }
    const adjustedAlarmDateInMiliseconds = adjustAlarmDate();
    if (isModalDisabled) {
      navigation.navigate('UpgradeSleep', {
        adjustedAlarmDateInMiliseconds,
        alarm,
        sleepSoundHourLimit,
      });
    } else {
      setModalOpen(true);
    }
  };

  const handleStoreTime = async (selectedTime) => {
    await updateAlarmDetails(
      alarm?.alarm.id,
      'raw',
      selectedTime.raw.getTime(),
    );
    setHasUpdated(!hasUpdated);
  };

  function addTrackToQueue(track, type, action) {
    try {
      const {audio, iapable_type, track_url} = track,
        {product_identifier, title} = audio;

      var song = {
        id: product_identifier,
        url: track_url,
        title: title,
        artist: type,
      };

      if (type === 'alarm') {
        if (action === 'push') {
          setQueue((current) => [...current, song]);
        }

        if (action === 'pop') {
          queue.pop();
          setQueue(queue);
          // var filteredQueue = queue.filter(
          //   (item) => item.product_identifier != song.product_identifier,
          // );
          // setQueue(filteredQueue);
        }
      }

      if (type === 'sleep') {
        if (action === 'unshift') {
          setQueue((current) => [song, ...current]);
        }
      }
    } catch (error) {
      console.log(track);
    }
  }

  function getUniqueQueue() {
    if (queue.length > 1) {
      let uniqueTracks = [];

      const uniqueQueues = queue.filter((element) => {
        const isDuplicate = uniqueTracks.includes(element.id);

        if (!isDuplicate) {
          uniqueTracks.push(element.id);

          return true;
        }

        return false;
      });

      return uniqueQueues;
    }
  }

  return (
    <>
      <UpgradeAlarmSettingsScreen
        navigation={navigation}
        selectedDate={selectedDate}
        setDatePickerVisibility={setDatePickerVisibility}
        date={date}
        alarm={alarm}
        isDatePickerVisible={isDatePickerVisible}
        timeFormat={timeFormat}
        handleConfirm={handleConfirm}
        hideDatePicker={hideDatePicker}
        handleStartAlarm={handleStartAlarm}
        hasUpdated={hasUpdated}
        setHasUpdated={setHasUpdated}
        isFocused={isFocused}
        activeBulbs={activeBulbs}
        sleepSoundHourLimit={sleepSoundHourLimit}
        addTrackToQueue={addTrackToQueue}
      />
      {!isModalDisabled && modalOpen && (
        <Modal
          visible={!isModalDisabled && modalOpen}
          onRequestClose={() => handleCloseModal(isCheckboxSelected)}
          transparent={true}
          animationType="fade">
          <Backdrop>
            <ModalBody
              colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
              start={{x: 0.7, y: 0}}>
              <ModalText style={{textAlign: 'justify'}}>
                Light Awake is a different kind of alarm clock. To ensure proper
                alarm clock function: After you set your alarm, the screen will
                dim and go into sleep mode. It is important, if you use another
                app after you set your alarm, you disable/reset the alarm to
                ensure the sleep mode is initiated and the alarm goes off
                properly.
              </ModalText>
              <Spacer />
              <ModalText style={{textAlign: 'justify'}}>
                See our{' '}
                <ModalLink
                  onPress={() =>
                    Linking.openURL('https://lightawake.biz/contact-us/#faq')
                  }>
                  FAQs
                </ModalLink>{' '}
                for more details or{' '}
                <ModalLink
                  onPress={() =>
                    Linking.openURL('https://lightawake.biz/contact-us/')
                  }>
                  contact us
                </ModalLink>{' '}
                with any questions or feedback!
              </ModalText>
              <Spacer />
              <CheckboxContainer>
                <BouncyCheckbox
                  onPress={(isChecked) => setIsCheckboxSelected(isChecked)}
                />
                <CheckboxText>Do not show again</CheckboxText>
              </CheckboxContainer>
              <Spacer />
              <CancelContainer
                onPress={() => handleCloseModal(isCheckboxSelected)}>
                <ExitModalButton>
                  <ModalXIcon
                    style={{alignItems: 'center'}}
                    source={require('../../../../../assets/images/cancel.png')}
                  />
                </ExitModalButton>
              </CancelContainer>
            </ModalBody>
          </Backdrop>
        </Modal>
      )}
      {!isTacPopUpModalDisabled && tacPopUpModalOpen && (
        <Modal
          visible={!isTacPopUpModalDisabled && tacPopUpModalOpen}
          onRequestClose={() => handleTacCloseModal(isTacCheckboxSelected)}
          transparent={true}
          animationType="fade">
          <Backdrop>
            <ModalBody
              colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
              start={{x: 0.7, y: 0}}>
              <ScrollView>
                <Content>
                  <HighLight
                    style={{
                      fontSize: responsiveFontSize(2.7),
                      textAlign: 'center',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}>
                    TERMS AND CONDITIONS
                  </HighLight>
                  <Spacer />
                  <Description>
                    The terms and conditions by and between Light Awake, LLC
                    (“Light Awake”) and you (“You” or “Client”) govern the use
                    of <HighLight>Light Awake</HighLight>, which means more
                    options as to how you want to wake up. an application owned
                    and operated by Light Awake, including base versions of the
                    application as well as enhancements, add-ons, and paid
                    versions, which may be purchased in the application or in an
                    application store (collectively, the “Application”). You can
                    read the full terms and conditions at{' '}
                    <Link href="https://lightawake.biz/terms-conditions/#app">
                      lightawake.biz/terms-conditions
                    </Link>
                    {'\n'}
                  </Description>
                  <Description>
                    Any information Light Awake collects through your use of the
                    Application is subject to the Light Awake Privacy Policy,
                    which is part of these Terms and Conditions and can be found
                    at{' '}
                    <Link href="https://www.lightawake.biz/privacy-policy/">
                      lightawake.biz/privacy-policy
                    </Link>
                    {'\n \n'}
                    By tapping the checkbox, you have read and understand the
                    Terms and Conditions and agree to be bound by the Terms and
                    Conditions and abide by them at all times.
                  </Description>
                  <Spacer />
                  <CheckboxContainer>
                    <BouncyCheckbox
                      onPress={(isChecked) => handleTacCloseModal(isChecked)}
                    />
                    <CheckboxText>
                      Agree to <HighLight>Terms & Conditions</HighLight>
                    </CheckboxText>
                  </CheckboxContainer>
                  <Spacer />
                </Content>
              </ScrollView>
            </ModalBody>
          </Backdrop>
        </Modal>
      )}
    </>
  );
}

const Description = styled.Text`
  font-size: ${responsiveFontSize(2)};
  text-align: justify;
  color: ${(props) => props.theme.colors.white};
`;

const Content = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const HighLight = styled(ModalHeader)`
  font-size: ${responsiveFontSize(2)};
`;

const ModalLink = styled.Text`
  color: ${(props) => props.theme.colors.orange};
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 16px;
  font-weight: 700;
`;

const CheckboxContainer = styled.View`
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
