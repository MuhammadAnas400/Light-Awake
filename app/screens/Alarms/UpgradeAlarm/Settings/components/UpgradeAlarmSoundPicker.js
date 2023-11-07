/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import Sound from 'react-native-sound';
import LottieView from 'lottie-react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import Switch from '../../../../../components/Globals/Switch';

import {soundSettings} from '../../../../../constants/available-settings';
import StorageProperty from '../../../../../constants/storage-property';
import {
  getAsyncStorageData,
  removeAsyncStorageData,
  storeAsyncStorageData,
} from '../../../../../constants/utils';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../../../styles/commonStyledComponents.js';
import {scaleWidth} from '../../../../../styles/scales';

import {useTrackSettings} from '../../../hooks/useTrackSettings';
import updateAlarmDetails from '../../helper/updateAlarmDetails';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {usePurchaseHandling} from '../../../../../components/Globals/PurchaseContext';

const PREVIEW_TIME = 5000;

Sound.setCategory('Playback');
let soundPlayer = new Sound(soundSettings[0]?.track);

async function checkAudioExistence(track_url) {
  const exist = await ReactNativeBlobUtil.fs.exists(track_url);
  return {exist};
}

export default function UpgradeAlarmSoundPicker({
  alarm,
  isScreenFocused,
  hasUpdated,
  setHasUpdated,
  addTrackToQueue,
  navigation,
}) {
  const alarmPreviewTimeout = useRef();
  const {trackSettings} = useTrackSettings('alarm_sound', hasUpdated);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [trackPlaying, setTrackPlaying] = useState(false);
  const [informUserModal, setInformUserModal] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [loaderArray, setLoaderArray] = useState(
    new Array(tracks.length).fill(false),
  );
  const [lastDownloadedIndex, setLastDownloadedIndex] = useState(null);
  const [soundAlarm, setSoundAlarm] = useState(); // alarm sound fetched from api
  const [soundAlarmEnabled, setSoundAlarmEnabled] = useState(
    alarm?.alarm_sound_enabled,
  ); // alarm sound enabled fetched from api
  const [soundPlayer, setSoundPlayer] = useState(null);
  const [trackPlayer, setTrackPlayer] = useState(null);
  const {redownloadPurchasedTrack} = usePurchaseHandling();
  const [isDownloading, setIsDownloading] = useState(false);

  const stopPlayer = () => {
    if (soundPlayer) {
      soundPlayer.stop();
      soundPlayer.release();
    }
    if (trackPlayer) {
      trackPlayer.stop();
      trackPlayer.release();
    }
    setSoundPlaying(null);
    setTrackPlayer(null);
    clearTimeout(alarmPreviewTimeout.current);
  };

  useEffect(() => {
    // Create the soundPlayer instance only once
    const player = new Sound('', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
      }
    });
    setSoundPlayer(player);

    return () => {
      // Release the soundPlayer instance when the component is unmounted
      player.release();
    };
  }, []);

  useEffect(() => {
    // Create the trackPlayer instance only once
    const player = new Sound('', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
      }
    });
    setTrackPlayer(player);

    return () => {
      // Release the trackPlayer instance when the component is unmounted
      player.release();
    };
  }, []);

  useEffect(() => {
    async function getTrack() {
      const track = JSON.parse(
        await getAsyncStorageData(StorageProperty.ALARM_TRACK),
      );
      try {
        const {audio} = track,
          {product_identifier} = audio;

        addTrackToQueue(track, 'alarm', 'push');
        setSoundAlarm(product_identifier + '.mp3');
      } catch (error) {
        // workaround to set the first purchased alarm sound be highlighted first
        setSoundAlarm(alarm?.alarm_sound);
        console.log(alarm);
      }
    }

    getTrack();
    setSoundAlarmEnabled(alarm?.alarm_sound_enabled);
  }, [alarm]);

  async function sortAudio() {
    const updatedTracks = [];
    for (let index = 0; index < trackSettings.length; index++) {
      const element = trackSettings[index];
      const {exist} = await checkAudioExistence(element.track_url);
      element.track_exist = exist;
      updatedTracks[index] = element;
    }
    setTracks(updatedTracks);
  }

  useEffect(() => {
    sortAudio();
  }, [trackSettings]);

  useEffect(() => {
    if (!isScreenFocused) {
      stopPlayer();
    }
  }, [isScreenFocused]);

  const playSound = (soundName, soundIndex) => {
    console.log('Preview Default Track Playing...');
    stopPlayer();
    if (soundName) {
      if (soundPlaying === soundIndex) {
        setSoundPlaying(null);
      } else {
        const player = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          player.setNumberOfLoops(-1);
          player.play((success) => {
            if (success) {
              setSoundPlaying(null);
            }
          });
          setSoundPlayer(player);
          setSoundPlaying(soundIndex);
          alarmPreviewTimeout.current = setTimeout(() => {
            player.stop();
            player.release();
            setSoundPlaying(null);
          }, PREVIEW_TIME);
        });
      }
    } else {
      setSoundPlaying(null);
    }
  };
  const playTrack = (item, trackIndex) => {
    console.log('Preview Purchased Track Playing...');
    if (item !== 'the_london_symphony_orchestra') {
      let soundName = /\d/.test(item?.slice(0, 3)) && item?.slice(3) + '.mp3';
      soundName = soundName.toLocaleLowerCase();
      stopPlayer();
      if (soundName) {
        if (trackPlaying === trackIndex) {
          setTrackPlaying(null);
        } else {
          const player = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('Failed to load the sound', error);
              return;
            }
            player.setNumberOfLoops(-1);
            player.play();
            setTrackPlayer(player);
            setTrackPlaying(trackIndex);
            alarmPreviewTimeout.current = setTimeout(() => {
              player.stop();
              player.release();
              setTrackPlaying(null);
            }, PREVIEW_TIME);
          });
        }
      } else {
        setTrackPlaying(null);
      }
    }
    if (item === 'the_london_symphony_orchestra') {
      let soundName = 'the_london_symphony_orchestra.mp3';
      stopPlayer();

      if (trackPlaying === trackIndex) {
        setTrackPlaying(null);
      } else {
        const player = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          player.setNumberOfLoops(-1);
          player.play();
          setTrackPlayer(player);
          setTrackPlaying(trackIndex);
          alarmPreviewTimeout.current = setTimeout(() => {
            player.stop();
            player.release();
            setTrackPlaying(null);
          }, PREVIEW_TIME);
        });
      }
    }
  };

  async function handleReDownloadAudio(track, index) {
    setIsDownloading(true);
    let newArray = [...loaderArray];
    newArray[index] = true;
    setLoaderArray(newArray);

    await redownloadPurchasedTrack(track.audio);

    newArray[index] = false;
    setLoaderArray(newArray);
    setSoundAlarm(track.audio.product_identifier + '.mp3');
    setLastDownloadedIndex(index);

    setTimeout(async () => {
      const {exist} = await checkAudioExistence(track.track_url);
      const newTracks = [...tracks];
      newTracks[index].track_exist = exist;
      setTracks(newTracks);
      setHasUpdated(!hasUpdated);
      setIsDownloading(false);
    }, 500);
  }

  async function handleSwitch(value) {
    updateAlarmDetails(alarm?.id, 'alarm_sound_enabled', value).then(() => {
      setSoundAlarmEnabled(!soundAlarmEnabled);
      setHasUpdated(!hasUpdated);
    });

    if (!value) {
      playSound(null);
    }
  }

  function handleSetAlarm(type, track) {
    async function setTrack() {
      await updateAlarmDetails(alarm?.id, 'alarm_sound', null);

      addTrackToQueue(track, 'alarm', 'push');

      // store the purchased track to async storage as the api only stores text and it is an object containing the details of the track
      var storeSoundAlarm = setSoundAlarm(
        track.audio.product_identifier + '.mp3',
      );

      var storeToAsyncStorageData = await storeAsyncStorageData(
        StorageProperty.ALARM_TRACK,
        `${JSON.stringify(track)}`,
        console.log(JSON.stringify(track)),
      );

      return storeSoundAlarm, storeToAsyncStorageData;
    }

    async function setSound() {
      // store the free audios to api since it is a text containing the name of the audio
      await updateAlarmDetails(alarm?.id, 'alarm_sound', track);

      addTrackToQueue(track, 'alarm', 'pop');

      var removeToAsyncStorageData = await removeAsyncStorageData(
        StorageProperty.ALARM_TRACK,
      );

      return setHasUpdated(!hasUpdated), removeToAsyncStorageData;
    }

    var alarms = {
      track: setTrack,
      sound: setSound,
    };

    alarms[type]();
  }

  const handlePurchaseClicked = () => {
    navigation.navigate('Store');
  };

  return (
    <SettingContainer>
      <SettingHead>
        <Row>
          <SettingIcon
            source={require('../../../../../../assets/alarm-sound-icon.png')}
          />
          <SettingTitle>Sound Option</SettingTitle>
        </Row>
        <Switch
          value={soundAlarmEnabled}
          onValueChange={(v) => handleSwitch(v)}
        />
      </SettingHead>
      {soundAlarmEnabled && (
        <SettingBody>
          {tracks.map((track, index) => (
            <SoundRow key={index}>
              <StyledSoundName>{track.audio.title}</StyledSoundName>
              <IconRow>
                <StyledTouchableOpacity
                  onPress={() =>
                    playTrack(track.audio.product_identifier, index)
                  }>
                  <Image
                    source={
                      trackPlaying === index
                        ? require('../../../../../../assets/pause-icon.png')
                        : require('../../../../../../assets/play-icon.png')
                    }
                  />
                </StyledTouchableOpacity>
                {track.track_exist ? (
                  <StyledTouchableOpacity
                    onPress={() => handleSetAlarm('track', track)}>
                    <Image
                      source={
                        soundAlarm === track.audio.product_identifier + '.mp3'
                          ? require('../../../../../../assets/selected-icon.png')
                          : require('../../../../../../assets/not-selected-icon.png')
                      }
                    />
                  </StyledTouchableOpacity>
                ) : loaderArray[index] ? (
                  <StyledTouchableOpacity>
                    <LottieView
                      source={require('../../../../../../assets/fetch.json')}
                      style={{
                        marginLeft: responsiveScreenWidth(1),
                        height: responsiveScreenHeight(4),
                      }}
                      autoPlay
                      loop
                    />
                  </StyledTouchableOpacity>
                ) : (
                  <StyledTouchableOpacity
                    onPress={() => handleReDownloadAudio(track, index)}>
                    <Image
                      source={require('../../../../../../assets/downloading.png')}
                      style={{
                        width: responsiveScreenWidth(5.5),
                        height: responsiveScreenHeight(2.5),
                      }}
                    />
                  </StyledTouchableOpacity>
                )}
              </IconRow>
            </SoundRow>
          ))}
          {soundSettings.map((sound, index) => (
            <SoundRow key={sound.name}>
              <StyledSoundName>{sound.name}</StyledSoundName>
              <IconRow>
                <StyledTouchableOpacity
                  onPress={() => playSound(sound.track, index)}>
                  <Image
                    source={
                      soundPlaying === index
                        ? require('../../../../../../assets/pause-icon.png')
                        : require('../../../../../../assets/play-icon.png')
                    }
                  />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  onPress={() =>
                    soundAlarm === sound.track
                      ? setSoundAlarm(null)
                      : handleSetAlarm('sound', sound.track)
                  }>
                  <Image
                    source={
                      soundAlarm === sound.track
                        ? require('../../../../../../assets/selected-icon.png')
                        : require('../../../../../../assets/not-selected-icon.png')
                    }
                  />
                </StyledTouchableOpacity>
              </IconRow>
            </SoundRow>
          ))}
          <SoundRow>
            <TouchableOpacity onPress={handlePurchaseClicked}>
              <StyledSoundName>Tap here for more Alarm sounds</StyledSoundName>
            </TouchableOpacity>
          </SoundRow>
        </SettingBody>
      )}
    </SettingContainer>
  );
}

const SettingBody = styled.View`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.darkIndigoFour};
  padding: 0 10px;
  border-radius: 11px;
`;

const SoundRow = styled(Row)`
  justify-content: space-between;
`;

const StyledSoundName = styled.Text`
  font-size: ${Math.min(scaleWidth(16), 16)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  padding: 2px;
`;

const IconRow = styled(Row)`
  margin: 4px 0;
  justify-content: space-between;
  width: ${Math.min(scaleWidth(64), 64)}px;
`;
