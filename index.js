/**
 * @format
 */

import 'expo-asset';
import {AppRegistry} from 'react-native';
import {registerRootComponent} from 'expo';
import TrackPlayer from 'react-native-track-player';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import App from './App';

AppRegistry.registerComponent('main', () => App);

PushNotification.configure({
  onRegister: function (token) {
    console.log('====================================');
    console.log('TOKEN:', token);
    console.log('====================================');
  },
  onNotification: function (notification) {
    console.log('====================================');
    console.log('NOTIFICATION:', notification);
    console.log('====================================');

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  popInitialNotification: true,
  requestPermissions: true,
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
});

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => require('./service'));
