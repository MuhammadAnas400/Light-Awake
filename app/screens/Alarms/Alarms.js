import React, {useState, useEffect} from 'react';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import Swipeout from 'react-native-swipeout';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import BackButton from '../../components/Globals/BackButton';

import {useTimeFormatContext} from '../../contexts/time-format.context';
import {useAlarmTimeContext} from '../../contexts/alarm-time.context';
import styled from 'styled-components/native';
import {
  BackgroundImage,
  ScreenContent,
  ScreenContainer as DefaultScreenContainer,
  ScreenHead,
  ScreenTitle,
  SettingContainer,
  StackContainer,
  StackChildWrapper,
  ClockBar,
  Clock,
  PeriodContainer,
  PeriodText,
} from '../../styles/commonStyledComponents';
import {scaleWidth, scaleHeight} from '../../styles/scales';
import {theme} from '../../styles/theme';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../network/AxiosRequestHandler';
import useDateTime from './hooks/useDateTime';
import InformUserModal from '../../components/Modals/InformUserModal';
import RNUxcam from 'react-native-ux-cam';

const Alarms = ({navigation, route}) => {

  RNUxcam.tagScreenName('Alarm Screen');

  const {date, getFormattedDate} = useDateTime();

  const [toDeleteAlarm, setToDeleteAlarm] = useState();
  const [alarms, setAlarms] = useState({});

  const [alarmCount, setAlarmCount] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAlarmDeleted, setHasAlarmDeleted] = useState(false);
  const [hasAlarmUpgraded, setHasAlarmUpgraded] = useState(false);
  const [informUserModal, setInformUserModal] = useState(false);

  const {timeFormat} = useTimeFormatContext();
  const {hours, minutes} = useAlarmTimeContext();
  const [selectedDate, setSelectedDate] = useState(() => {
    const loadedDate = new Date();
    loadedDate.setMinutes(minutes);
    loadedDate.setHours(hours);
    return getFormattedDate(loadedDate);
  });

  var swipeoutBtns = [
    {
      component: (
        <DeleteIcon
          source={require('../../../assets/delete.png')}
          style={{
            width: responsiveWidth(6.5),
            height: responsiveHeight(3.5),
          }}
        />
      ),
      backgroundColor: '#E60000',
      onPress: () => {
        deleteAlarm();
      },
    },
  ];

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
        setIsLoggedIn(true);
        return true;
      }
    } catch (error) {
      setIsLoggedIn(false);
      return false;
    }
  }

  async function fetchAlarms() {
    try {
      const params = {
        timeFormat: timeFormat,
      };
      const requestConfig = {
        params: params,
        method: method.get,
        url: `${connectionPath.alarms.getAlarms}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        setHasAlarmUpgraded(response.data.has_alarm_upgraded);
        sortAlarms(response.data?.alarms);
      }
    } catch (error) {
      setHasAlarmUpgraded(false);
    }
  }

  async function addAlarm() {
    let date = new Date();
    try {
      const params = {
        raw: date.getTime(),
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: `${connectionPath.alarms.addAlarm}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        setAlarmCount(alarmCount + 1);
      }
    } catch (error) {
      setHasAlarmUpgraded(false);
    }
  }

  async function deleteAlarm() {
    try {
      const params = {
        id: toDeleteAlarm,
      };
      const requestConfig = {
        params: params,
        method: method.delete,
        url: `${connectionPath.alarms.deleteAlarm}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        setHasAlarmDeleted(!hasAlarmDeleted);
        setAlarmCount(alarmCount - 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function sortAlarms(fetchedAlarms) {
    fetchedAlarms.sort((a, b) => {
      if (new Date(a.raw).getHours() === new Date(b.raw).getHours()) {
        return new Date(a.raw).getMinutes() - new Date(b.raw).getMinutes();
      } else {
        return new Date(a.raw).getHours() - new Date(b.raw).getHours();
      }
    });

    setAlarmCount(fetchedAlarms.length);
    setAlarms(fetchedAlarms ?? {});
  }

  const handleAlarmPress = (id) => {
    navigation.navigate('UpgradeAlarmSettings', {id});
  };

  const handleLastButtonPress = async () => {
    hasAlarmUpgraded
      ? addAlarm()
      : (await verifyUser())
      ? navigation.navigate('Store')
      : setInformUserModal(!informUserModal);
  };

  useEffect(() => {
    let date = route.params.selectedDate?.raw ?? selectedDate.raw;

    setSelectedDate(getFormattedDate(date, timeFormat));
  }, [selectedDate.raw, timeFormat, route.params]);

  useEffect(() => {
    fetchAlarms();
  }, [alarmCount, route.params, hasAlarmDeleted, isLoggedIn]);

  useEffect(() => {
    verifyUser();
  }, []);

  const renderedAlarms = Object.keys(alarms).map((val) => (
    <StackChildWrapper key={alarms[val].id}>
      <Swipeout
        autoClose={true}
        right={swipeoutBtns}
        backgroundColor={'transparent'}
        onOpen={() => setToDeleteAlarm(alarms[val].id)}>
        <TouchableWithoutFeedback
          onPress={() => handleAlarmPress(alarms[val].id)}>
          <SettingContainer>
            <ClockBar
              style={{
                justifyContent: 'flex-start',
                paddingLeft: responsiveWidth(5),
              }}>
              <Clock style={{fontSize: responsiveFontSize(5)}}>
                {date(alarms[val].raw).timeToDisplay}
              </Clock>
              {date(alarms[val].raw).period && (
                <PeriodContainer>
                  <PeriodText
                    active={false}
                    style={{
                      fontSize: responsiveFontSize(3),
                      paddingTop: responsiveHeight(1),
                    }}>
                    {date(alarms[val].raw).period}
                  </PeriodText>
                </PeriodContainer>
              )}
              <EditingIcon
                source={require('../../../assets/next.png')}
                style={{
                  width: responsiveWidth(8),
                  height: responsiveHeight(4),
                  marginLeft: 'auto',
                }}
              />
            </ClockBar>
          </SettingContainer>
        </TouchableWithoutFeedback>
      </Swipeout>
    </StackChildWrapper>
  ));

  const freeAlarm = (
    <StackChildWrapper>
      <TouchableOpacity
        onPress={() => navigation.navigate('FreeAlarmSettings')}>
        <SettingContainer>
          <ClockBar
            style={{
              justifyContent: 'flex-start',
              paddingLeft: responsiveWidth(5),
            }}>
            <Clock style={{fontSize: responsiveFontSize(5)}}>
              {selectedDate.timeToDisplay}
            </Clock>
            {selectedDate.period && (
              <PeriodContainer>
                <PeriodText
                  active={false}
                  style={{
                    fontSize: responsiveFontSize(3),
                    paddingTop: responsiveHeight(1),
                  }}>
                  {selectedDate.period}
                </PeriodText>
              </PeriodContainer>
            )}
            <EditingIcon
              source={require('../../../assets/next.png')}
              style={{
                width: responsiveWidth(8),
                height: responsiveHeight(4),
                marginLeft: 'auto',
              }}
            />
          </ClockBar>
        </SettingContainer>
      </TouchableOpacity>
    </StackChildWrapper>
  );

  return (
    <ScreenContainer>
      <BulbScreenHead>
        <BackButton onPress={() => navigation.navigate('Home')} />
        <ScreenTitle>ALARMS</ScreenTitle>
      </BulbScreenHead>
      <ScreenContent style={{paddingTop: 0}}>
        <BackgroundImage style={{height: '100%'}}>
          <StackContainer>
            {hasAlarmUpgraded || isLoggedIn ? renderedAlarms : freeAlarm}
            {alarmCount != 10 && (
              <StackChildWrapper>
                <TouchableOpacity onPress={handleLastButtonPress}>
                  <SettingContainer style={{height: responsiveHeight(10)}}>
                    <AlarmCustomedRow
                      style={{
                        justifyContent: hasAlarmUpgraded
                          ? 'flex-start'
                          : 'center',
                      }}>
                      <LockIconContainer
                        source={
                          hasAlarmUpgraded
                            ? require('../../../assets/plus.png')
                            : require('../../../assets/lock.png')
                        }
                      />
                      <HasUpgradeAlarmPurchasedDescription>
                        {hasAlarmUpgraded
                          ? 'Add Alarm'
                          : 'Purchase upgrade to add more alarms.'}
                      </HasUpgradeAlarmPurchasedDescription>
                    </AlarmCustomedRow>
                  </SettingContainer>
                </TouchableOpacity>
              </StackChildWrapper>
            )}
            {informUserModal && (
              <InformUserModal
                informUserModal={informUserModal}
                setInformUserModal={setInformUserModal}
                isGuestUser={true}
                greetings={'Welcome'}
                message={
                  'Sign up to access the Store and other premium access?'
                }
                navigation={navigation}
              />
            )}
          </StackContainer>
        </BackgroundImage>
      </ScreenContent>
    </ScreenContainer>
  );
};

const EditingIcon = styled.Image`
  margin-right: ${scaleWidth(15)}px;
`;

const AlarmCustomedRow = styled(ClockBar)`
  margin-top: auto;
  margin-bottom: auto;
  height: ${responsiveHeight(5)};
`;

const HasUpgradeAlarmPurchasedDescriptionContainer = styled.View`
  height: ${responsiveHeight(5)};
`;

const HasUpgradeAlarmPurchasedDescription = styled(Clock)`
  color: ${theme.colors.gray};
  font-size: ${responsiveFontSize(2)};
  font-family: ${theme.fonts.default};
`;

const LockIconContainer = styled(EditingIcon)`
  width: ${responsiveWidth(6)};
  height: ${responsiveHeight(3.5)};
`;

const DeleteIcon = styled.Image`
  margin: auto;
`;

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const BulbScreenHead = styled(ScreenHead)`
  padding-bottom: ${scaleHeight(35)}px;
`;

export default Alarms;
