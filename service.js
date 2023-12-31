import TrackPlayer, {Event} from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.destroy();
  });
};
