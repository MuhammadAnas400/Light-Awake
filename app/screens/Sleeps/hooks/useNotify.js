import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default function useNotify() {
  function notify() {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'lightawake-channel',
      /* iOS and Android properties */
      title: 'Warning!',
      message: 'You are away from alarm. Tap here to return.',
      soundName: Platform.OS === 'ios' ? 'default' : 'ping.mp3',
    });
  }

  return {notify};
}
