import React, {useState, useEffect, useCallback} from 'react';
import {Modal, Linking, ScrollView, Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {scaleWidth} from '../../../../styles/scales';

import {useTimeFormatContext} from '../../../../contexts/time-format.context';
import {useDeviceBrightnessContext} from '../../../../contexts/device-brightness.context';
import {useAlarmTimeContext} from '../../../../contexts/alarm-time.context';
import {useWakeUpContext} from '../../../../contexts/wake-up.context';

import useTime from '../../../../hooks/useTime';
import {useActiveBulbs} from '../../../../hooks/useActiveBulbs';

import StorageProperty from '../../../../constants/storage-property';
import {theme} from '../../../../styles/theme';
import {
  formatTo12hFormat,
  formatTo24hFormat,
  getAsyncStorageData,
  storeAsyncStorageData,
} from '../../../../constants/utils';

import styled from 'styled-components/native';
import {
  Backdrop,
  CancelContainer,
  ExitModalButton,
  ScreenContainer as DefaultScreenContainer,
  Spacer,
  ModalBody,
  ModalText,
  ModalXIcon,
  ModalHeader,
} from '../../../../styles/commonStyledComponents';
import FreeAlarmSettingsScreen from './FreeAlarmSettingsScreen';
import {useTuyaServices} from '../../../../hooks/useTuyaServices';

export default function FreeAlarmSettingsContainer({navigation, route}) {
  const {bulbPulseRateEnabled} = useWakeUpContext();
  const {timeFormat} = useTimeFormatContext();
  const {restoreDeviceBrightnessWhenAppIsReady} = useDeviceBrightnessContext();
  const {hours, setHours, minutes, setMinutes} = useAlarmTimeContext();
  const {nowDate} = useTime(timeFormat);
  const [activeBulbs, {getActivatedDevices}] = useActiveBulbs();
  const {turnBulbOff} = useTuyaServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [isModalDisabled, setIsModalDisabled] = useState(true);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const loadedDate = new Date();
    loadedDate.setMinutes(minutes);
    loadedDate.setHours(hours);
    return getFormattedDate(loadedDate);
  });
  const isFocused = useIsFocused();
  const [tacPopUpModalOpen, setTacPopUpModalOpen] = useState(false);
  const [isTacCheckboxSelected, setIsTacCheckboxSelected] = useState(false);
  const [isTacPopUpModalDisabled, setIsTacPopUpModalDisabled] = useState(true);

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
    if (isFocused) {
      restoreDeviceBrightnessWhenAppIsReady();
    }
  }, [restoreDeviceBrightnessWhenAppIsReady, isFocused]);

  useEffect(() => {
    setSelectedDate(getFormattedDate(selectedDate.raw, timeFormat));
  }, [selectedDate.raw, timeFormat]);

  useEffect(() => {
    async function checkUserModalPreference() {
      const disableWarningModal = await getAsyncStorageData(
        StorageProperty.WARNING_MODAL_DISABLED,
      );

      setIsModalDisabled(disableWarningModal === 'true');
    }

    checkUserModalPreference();
  }, []);

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
    setSelectedDate(getFormattedDate(date, timeFormat));
    setHours(date.getHours());
    setMinutes(date.getMinutes());
    storeAsyncStorageData(
      StorageProperty.ALARM_TIME,
      `${JSON.stringify(getFormattedDate(date, timeFormat))}`,
    );
  };

  const adjustAlarmDate = () => {
    const selectedHour = selectedDate.raw.getHours();
    const selectedMinutes = selectedDate.raw.getMinutes();

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
    navigation.navigate('FreeSleep', {
      adjustedAlarmDateInMiliseconds,
    });
  };

  const handleStartAlarm = () => {
    if (bulbPulseRateEnabled) {
      console.log('Bulb turning off....');
      turnBulbOff();
    }

    const adjustedAlarmDateInMiliseconds = adjustAlarmDate();

    if (isModalDisabled) {
      navigation.navigate('FreeSleep', {
        adjustedAlarmDateInMiliseconds,
      });
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <FreeAlarmSettingsScreen
        setDatePickerVisibility={setDatePickerVisibility}
        isDatePickerVisible={isDatePickerVisible}
        timeFormat={timeFormat}
        handleConfirm={handleConfirm}
        hideDatePicker={hideDatePicker}
        handleStartAlarm={handleStartAlarm}
        scaleWidth={scaleWidth}
        isFocused={isFocused}
        activeBulbs={activeBulbs}
        navigation={navigation}
        selectedDate={selectedDate}
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
              start={{
                x: 0.7,
                y: 0,
              }}>
              <ModalText
                style={{
                  textAlign: 'justify',
                }}>
                Light Awake is a different kind of alarm clock. To ensure proper
                alarm clock function: After you set your alarm, the screen will
                dim and go into sleep mode. It is important, if you use another
                app after you set your alarm, you disable/reset the alarm to
                ensure the sleep mode is initiated and the alarm goes off
                properly.
              </ModalText>
              <Spacer />
              <ModalText
                style={{
                  textAlign: 'justify',
                }}>
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
                    style={{
                      alignItems: 'center',
                    }}
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
              start={{
                x: 0.7,
                y: 0,
              }}>
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

const getFormattedDate = (date, timeFormat) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate =
    timeFormat === '24'
      ? formatTo24hFormat(hours, minutes)
      : formatTo12hFormat(hours, minutes);
  return {...formattedDate, raw: date};
};

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
