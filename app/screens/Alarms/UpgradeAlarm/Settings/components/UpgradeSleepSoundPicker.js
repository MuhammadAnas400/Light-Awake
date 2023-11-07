/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {Image, View, TouchableOpacity} from 'react-native';

import LottieView from 'lottie-react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Sound from 'react-native-sound';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
  Spacer,
} from '../../../../../styles/commonStyledComponents.js';
import {scaleWidth} from '../../../../../styles/scales';

import {useSleepSoundContext} from '../../../../../contexts/sleep-sound.context';

import Switch from '../../../../../components/Globals/Switch';
import Slider from '../../../../../components/Globals/Slider.js';
import {
  sleepSoundSettings,
  sleepSoundTimerSettings,
  volumeSettings,
} from '../../../../../constants/available-settings';
import StorageProperty from '../../../../../constants/storage-property';
import {
  getAsyncStorageData,
  storeAsyncStorageData,
} from '../../../../../constants/utils';

import {useTrackSettings} from '../../../hooks/useTrackSettings.js';
import updateAlarmDetails from '../../helper/updateAlarmDetails.js';
import {usePurchaseHandling} from '../../../../../components/Globals/PurchaseContext';

const PREVIEW_TIME = 5000;

Sound.setCategory('Playback');
let soundPlayer = new Sound(sleepSoundSettings[0]?.track);

async function checkAudioExistence(track_url) {
  const exist = await ReactNativeBlobUtil.fs.exists(track_url);
  return {exist};
}

export default function UpgradeSleepSoundPicker({
  isScreenFocused,
  alarm,
  hasUpdated,
  setHasUpdated,
  sleepSoundHourLimit,
  addTrackToQueue,
  navigation,
}) {
  const alarmPreviewTimeout = useRef();
  const {trackSettings} = useTrackSettings('sleep_sound', hasUpdated);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [trackPlaying, setTrackPlaying] = useState(false);
  const [informUserModal, setInformUserModal] = useState(false);
  const {
    sleepSoundVolume,
    setSleepSoundVolume,
    sleepSoundTimer,
    setSleepSoundTimer,
  } = useSleepSoundContext();
  const [tracks, setTracks] = useState([]);
  const [pinkNoiseAudios, setPinkNoiseAudios] = useState([]);
  const [whiteNoiseAudios, setWhiteNoiseAudios] = useState([]);
  const [brownNoiseAudios, setBrownNoiseAudios] = useState([]);
  const [shortStories, setShortStories] = useState([]);
  const [loaderArray, setLoaderArray] = useState([]);
  const [lastDownloadedIndex, setLastDownloadedIndex] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [soundSleep, setSoundSleep] = useState(); // sleep sound fetched from api
  const [soundSleepEnabled, setSoundSleepEnabled] = useState(false); // sleep sound enabled fetched from api
  const {redownloadPurchasedTrack} = usePurchaseHandling();

  const stopPlayer = () => {
    soundPlayer.release();
    setSoundPlaying(null);
    clearTimeout(alarmPreviewTimeout.current);
  };

  useEffect(() => {
    async function getTrack() {
      const track = JSON.parse(
        await getAsyncStorageData(StorageProperty.SLEEP_TRACK),
      );

      try {
        const {audio} = track,
          {product_identifier} = audio;

        addTrackToQueue(track, 'sleep', 'unshift');

        setSoundSleep(product_identifier + '.mp3');
      } catch (error) {
        // workaround to set the first purchased sleep sound be highlighted first
        setSoundSleep(tracks[0]?.audio.product_identifier + '.mp3');

        addTrackToQueue(tracks[0], 'sleep', 'unshift');

        storeAsyncStorageData(
          StorageProperty.SLEEP_TRACK,
          `${JSON.stringify(tracks[0])}`,
        );
      }
    }

    getTrack();
    sortAudios(tracks);
    setSoundSleepEnabled(alarm?.sleep_sound_enabled);
  }, [alarm, tracks]);

  useEffect(() => {
    setLoaderArray(
      new Array(4).fill([]).map(() => new Array(tracks.length).fill(false)),
    );
  }, [tracks]);

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

  function sortAudios(audios) {
    const pinkNoise = audios.filter(
      (element) => element.audio.audio_type_color === 'pink_noise',
    );
    const brownNoise = audios.filter(
      (element) => element.audio.audio_type_color === 'brown_noise',
    );
    const whiteNoise = audios.filter(
      (element) => element.audio.audio_type_color === 'white_noise',
    );
    const shortStory = audios.filter(
      (element) => element.audio.audio_type_color === 'short_story',
    );

    setPinkNoiseAudios(pinkNoise);
    setBrownNoiseAudios(brownNoise);
    setWhiteNoiseAudios(whiteNoise);
    setShortStories(shortStory);
  }

  const playTrack = (item, trackIndex) => {
    let soundName;
    if (/\d/.test(item?.slice(0, 3))) {
      soundName =
        item?.slice(3, item?.length + 3) === 'rain_white_noise'
          ? item?.slice(3, item?.length + 3) + '.wav'
          : item?.slice(3, item?.length + 3) + '.mp3';
    } else {
      soundName = item + '.mp3';
    }

    if (soundName === '3hz_delta_white_noise.mp3') {
      soundName = 'threehz_delta_white_noise.mp3';
    } else if (soundName === '2hz_delta_white_noise.mp3') {
      soundName = 'twohz_delta_white_noise.mp3';
    } // workaround for audio names starting with number

    stopPlayer();

    if (soundName) {
      if (trackPlaying === trackIndex) {
        setTrackPlaying(null);
      } else {
        soundPlayer = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          soundPlayer.setNumberOfLoops(-1);
          soundPlayer.play();
          alarmPreviewTimeout.current = setTimeout(() => {
            stopPlayer();
            setTrackPlaying(null);
          }, PREVIEW_TIME);
        });
        setTrackPlaying(trackIndex);
      }
    } else {
      setTrackPlaying(null);
    }
  };

  const handleSwitch = (value) => {
    updateAlarmDetails(alarm?.id, 'sleep_sound_enabled', value).then(() => {
      setSoundSleepEnabled(!soundSleepEnabled);
      setHasUpdated(!hasUpdated);
    });

    if (!value) {
      playTrack(null);
    }
  };

  async function handleReDownloadAudio(track, categoryIndex, trackIndex) {
    setIsDownloading(true);
    let newArray = [...loaderArray];
    newArray[categoryIndex][trackIndex] = true;
    setLoaderArray(newArray);

    await redownloadPurchasedTrack(track.audio);

    newArray[categoryIndex][trackIndex] = false;
    setLoaderArray(newArray);

    setLastDownloadedIndex({categoryIndex, trackIndex});

    setTimeout(async () => {
      const {exist} = await checkAudioExistence(track.track_url);
      const newTracks = [...tracks];

      // Initialize newTracks[categoryIndex] if it's undefined
      if (!newTracks[categoryIndex]) {
        newTracks[categoryIndex] = [];
      }

      const updatedTrack = {...newTracks[categoryIndex][trackIndex]};
      updatedTrack.track_exist = exist;
      newTracks[categoryIndex][trackIndex] = updatedTrack;
      setTracks(newTracks);
      setHasUpdated(!hasUpdated);
      setIsDownloading(false);
    }, 500);
  }

  async function handleSetAlarm(track) {
    setSoundSleep(track.audio.product_identifier + '.mp3');
    setHasUpdated(!hasUpdated);

    addTrackToQueue(track, 'sleep', 'unshift');

    storeAsyncStorageData(
      StorageProperty.SLEEP_TRACK,
      `${JSON.stringify(track)}`,
    );
  }

  const handleVolumeSliderValueChange = (value) => {
    setSleepSoundVolume(value);
  };

  const handleTimerSliderValueChange = (value) => {
    setSleepSoundTimer(value);
  };

  const handlePurchaseClicked = () => {
    navigation.navigate('Store');
  };

  function displayAudios(audios, title, categoryIndex) {
    return (
      <View>
        <Row>
          <SettingIcon
            style={{
              height: responsiveScreenHeight(3),
              marginRight: 0,
            }}
          />
          <AudioSectionTitle>{title}</AudioSectionTitle>
        </Row>
        {audios.length != 0 ? (
          audios.map((track, index) => (
            <SoundRow key={track.audio.id}>
              <StyledSoundName>{track.audio.title}</StyledSoundName>
              <IconRow>
                <StyledTouchableOpacity
                  onPress={() =>
                    playTrack(track.audio.product_identifier, track.audio.id)
                  }>
                  <Image
                    source={
                      trackPlaying === track.audio.id
                        ? require('../../../../../../assets/pause-icon.png')
                        : require('../../../../../../assets/play-icon.png')
                    }
                  />
                </StyledTouchableOpacity>
                {track.track_exist ? (
                  <StyledTouchableOpacity onPress={() => handleSetAlarm(track)}>
                    <Image
                      source={
                        soundSleep === track.audio.product_identifier + '.mp3'
                          ? require('../../../../../../assets/selected-icon.png')
                          : require('../../../../../../assets/not-selected-icon.png')
                      }
                    />
                  </StyledTouchableOpacity>
                ) : loaderArray[categoryIndex][index] ? (
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
                    onPress={() =>
                      handleReDownloadAudio(track, categoryIndex, index)
                    }>
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
          ))
        ) : (
          <SoundRow>
            <TouchableOpacity onPress={handlePurchaseClicked}>
              <StyledSoundName>Tap here for more {title}.</StyledSoundName>
            </TouchableOpacity>
          </SoundRow>
        )}
      </View>
    );
  }

  return (
    <SettingContainer>
      <SettingHead>
        <Row>
          <SettingIcon
            style={{
              height: responsiveScreenHeight(3),
              width: responsiveScreenWidth(6),
            }}
            source={require('../../../../../../assets/sleep.png')}
          />
          <SettingTitle>Sleep Sound Option</SettingTitle>
        </Row>
        <Switch
          value={soundSleepEnabled}
          onValueChange={(v) => handleSwitch(v)}
        />
      </SettingHead>
      {soundSleepEnabled && (
        <SettingBody>
          <Spacer />
          <StyledSoundName>Set Volume</StyledSoundName>
          <Slider
            step={sleepSoundVolume || volumeSettings[0].name}
            onStepChange={(v) => handleVolumeSliderValueChange(v)}
            labels={volumeSettings.map((setting) => setting.name)}
          />
          <Spacer />
          <StyledSoundName>Set Play Timer (hour)</StyledSoundName>
          <Slider
            step={
              sleepSoundTimer ||
              (sleepSoundHourLimit.length === 0
                ? sleepSoundTimerSettings
                : sleepSoundHourLimit)[0].timer
            }
            onStepChange={(v) => handleTimerSliderValueChange(v)}
            labels={(sleepSoundHourLimit.length === 0
              ? sleepSoundTimerSettings
              : sleepSoundHourLimit
            ).map((setting) => setting.name)}
          />
          <Spacer />
          {displayAudios(pinkNoiseAudios, 'Pink Noise', 0)}
          <Spacer />
          {displayAudios(whiteNoiseAudios, 'White Noise', 1)}
          <Spacer />
          {displayAudios(brownNoiseAudios, 'Brown Noise', 2)}
          <Spacer />
          {displayAudios(shortStories, 'Short Story', 3)}
        </SettingBody>
      )}
    </SettingContainer>
  );
}

const AudioSectionTitle = styled(SettingTitle)`
  font-weight: bold;
`;

const SettingBody = styled.View`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.darkIndigoFour};
  padding: 0 10px;
  border-radius: 11px;
`;

const SoundRow = styled(Row)`
  justify-content: space-between;
  margin-left: ${responsiveScreenWidth(2)};
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
