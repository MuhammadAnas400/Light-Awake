/* eslint-disable react-hooks/exhaustive-deps */
import 'react-native-gesture-handler';
import * as React from 'react';
import {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import {withIAPContext} from 'react-native-iap';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FlashMessage from 'react-native-flash-message';
// import {
//   registerAccountWithEmail,
//   getRegisterEmailValidateCode,
//   loginWithEmail,
// } from '@volst/react-native-tuya';
import PushNotification, {Importance} from 'react-native-push-notification';
import RNUxcam from 'react-native-ux-cam';

import {ThemeProvider} from 'styled-components/native';
import {AlarmSoundContextProvider} from 'app/contexts/alarm-sound.context';
import {SleepSoundContextProvider} from 'app/contexts/sleep-sound.context';
import {AlarmTimeContextProvider} from 'app/contexts/alarm-time.context';
import {DeviceBrightnessContextProvider} from 'app/contexts/device-brightness.context';
import {TimeFormatContextProvider} from 'app/contexts/time-format.context';
import {WakeUpContextProvider} from 'app/contexts/wake-up.context';
import {BulbContextProvider} from 'app/contexts/bulb.context';
import About from 'app/screens/About/About';
import Alarms from 'app/screens/Alarms/Alarms';
import FreeAlarm from 'app/screens/Alarms/FreeAlarm/_index';
import FreeAlarmSettings from 'app/screens/Alarms/FreeAlarm/Settings/_index';
import FreeWakeUpInformation from './app/screens/WakeUpInformations/FreeWakeUpInformation/index';
import UpgradeAlarm from 'app/screens/Alarms/UpgradeAlarm/_index';
import UpgradeAlarmSettings from 'app/screens/Alarms/UpgradeAlarm/Settings/_index';
import FreeSleep from 'app/screens/Sleeps/FreeSleep/FreeSleep';
import UpgradeSleep from 'app/screens/Sleeps/UpgradeSleep/UpgradeSleep';
// import UpgradeWakeupArtOption from 'app/screens/Alarms/UpgradeAlarm/Settings/UpgradeWakeupArtOption';
// import UpgradeWakeUpInformation from 'app/screens/Alarms/UpgradeAlarm/UpgradeWakeUpInformation';
import Home from 'app/screens/Home/Home';
import Splash from 'app/screens/Splash/Splash';
import Pair from 'app/screens/Pair/Pair';
import Bulbs from 'app/screens/Bulbs/index';
import Bulb from 'app/screens/Bulb/Bulb';
import Store from 'app/screens/Store/Store';
import Auth from 'app/screens/Auth/index';
import ResetPassword from 'app/screens/ForgotPassword/ResetPassword';
import CheckMail from 'app/screens/ForgotPassword/CheckMail';
import VerifyCodeFromEmail from 'app/screens/ForgotPassword/VerifyCodeFromEmail';
import UpdatePassword from 'app/screens/ForgotPassword/UpdatePassword';
import UserProfileSettings from 'app/screens/User/UserProfileSettings';
import EditUserProfileSettings from 'app/screens/User/EditUserProfileSettings';
import Survey from './app/screens/Survey/index';
import {theme} from 'app/styles/theme';
import {storeAsyncStorageData} from 'app/constants/utils';
import StorageProperty from 'app/constants/storage-property';
import {useTuyaServices} from './app/hooks/useTuyaServices';
import {NetworkInfoProvider} from './app/components/Globals/ConnectionStatus';
import {BulbStatusProvider} from './app/components/Globals/BulbStatus';
import {PurchaseProvider} from './app/components/Globals/PurchaseContext';

const Stack =
  Platform.OS === 'ios' ? createStackNavigator() : createNativeStackNavigator();

const fadeTransition = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const App = () => {
  const {loginTuya} = useTuyaServices();
  // const {checkConnection} =  checkConnectionStatus();

  useEffect(() => {
    function runUXCam() {
      RNUxcam.optIntoSchematicRecordings();
      const configuration = {
        userAppKey: 'hhkjbl4hxt9xyo0',
        enableAutomaticScreenNameTagging: false,
        enableImprovedScreenCapture: true,
      };

      RNUxcam.startWithConfiguration(configuration);
    }

    runUXCam();
  }, []);

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'lightawake-channel',
        channelName: 'LightAwake Channel',
        soundName: 'ping.mp3',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`),
    );
  }, []);

  useEffect(() => {
    loginTuya();
  }, []);

  // useEffect(() => {
  //   1;
  //   async function register() {
  //     var result = await getRegisterEmailValidateCode({
  //       countryCode: '+1',
  //       email: 'lightawaketuya@gmail.com',
  //     });
  //     console.log('====================================');
  //     console.log(result);
  //     console.log('====================================');
  //   }
  //   register();
  //   2;
  //   async function reg() {
  //     var result = await registerAccountWithEmail({
  //       countryCode: '1',
  //       email: 'lightawaketuya@gmail.com',
  //       password: 'Password',
  //       validateCode: '963516',
  //     });
  //     console.log('====================================');
  //     console.log(result);
  //     console.log('====================================');
  //   }
  //   reg();
  // }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    async function getDeviceId() {
      const deviceId = await DeviceInfo.getUniqueId();

      storeAsyncStorageData(StorageProperty.DEVICE_UNIQUE_ID, `${deviceId}`);
    }

    getDeviceId();
  }, []);

  return (
    <>
      <NetworkInfoProvider>
        <StatusBar barStyle="light-content" />
        <ThemeProvider theme={theme}>
          <PurchaseProvider>
            <BulbContextProvider>
              <TimeFormatContextProvider>
                <WakeUpContextProvider>
                  <AlarmSoundContextProvider>
                    <SleepSoundContextProvider>
                      <AlarmTimeContextProvider>
                        <DeviceBrightnessContextProvider>
                          <BulbStatusProvider>
                            <NavigationContainer>
                              <Stack.Navigator
                                screenOptions={{
                                  animationEnabled: true,
                                  headerShown: false,
                                }}>
                                <Stack.Screen
                                  name="Splash"
                                  component={Splash}
                                />
                                <Stack.Screen
                                  name="Home"
                                  component={Home}
                                  options={{
                                    cardStyleInterpolator: fadeTransition,
                                  }}
                                />
                                <Stack.Screen
                                  name="Survey"
                                  component={Survey}
                                />
                                <Stack.Screen name="About" component={About} />
                                <Stack.Screen
                                  name="Alarms"
                                  component={Alarms}
                                />
                                <Stack.Screen
                                  name="FreeAlarm"
                                  component={FreeAlarm}
                                />
                                <Stack.Screen
                                  name="FreeAlarmSettings"
                                  component={FreeAlarmSettings}
                                />
                                <Stack.Screen
                                  name="FreeSleep"
                                  component={FreeSleep}
                                />
                                <Stack.Screen
                                  name="FreeInformation"
                                  component={FreeWakeUpInformation}
                                />
                                <Stack.Screen
                                  name="UpgradeAlarm"
                                  component={UpgradeAlarm}
                                />
                                <Stack.Screen
                                  name="UpgradeAlarmSettings"
                                  component={UpgradeAlarmSettings}
                                />
                                {/* <Stack.Screen
                            name="WakeupArtOption"
                            component={UpgradeWakeupArtOption}
                          /> */}
                                <Stack.Screen
                                  name="UpgradeSleep"
                                  component={UpgradeSleep}
                                />
                                {/* <Stack.Screen
                            name="UpgradeInformation"
                            component={UpgradeWakeUpInformation}
                          /> */}
                                <Stack.Screen name="Pair" component={Pair} />
                                <Stack.Screen name="Bulbs" component={Bulbs} />
                                <Stack.Screen name="Bulb" component={Bulb} />
                                <Stack.Screen name="Auth" component={Auth} />
                                <Stack.Screen
                                  name="ResetPassword"
                                  component={ResetPassword}
                                />
                                <Stack.Screen
                                  name="CheckMail"
                                  component={CheckMail}
                                />
                                <Stack.Screen
                                  name="VerifyCodeFromEmail"
                                  component={VerifyCodeFromEmail}
                                />
                                <Stack.Screen
                                  name="UpdatePassword"
                                  component={UpdatePassword}
                                />
                                <Stack.Screen
                                  name="UserProfileSettings"
                                  component={UserProfileSettings} 
                                />
                                <Stack.Screen
                                  name="EditUserProfileSettings"
                                  component={EditUserProfileSettings}
                                />
                                <Stack.Screen name="Store" component={Store} />
                              </Stack.Navigator>
                            </NavigationContainer>
                          </BulbStatusProvider>
                        </DeviceBrightnessContextProvider>
                      </AlarmTimeContextProvider>
                    </SleepSoundContextProvider>
                  </AlarmSoundContextProvider>
                </WakeUpContextProvider>
              </TimeFormatContextProvider>
            </BulbContextProvider>
          </PurchaseProvider>
        </ThemeProvider>
        <FlashMessage position="top" animated hideOnPress autoHide />
      </NetworkInfoProvider>
    </>
  );
};

export default withIAPContext(App);
