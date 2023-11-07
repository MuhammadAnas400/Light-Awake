import React, {useState, useEffect, useRef} from 'react';
import {Image, TouchableOpacity, Text} from 'react-native';

import Sound from 'react-native-sound';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../../../styles/commonStyledComponents.js';
import {scaleWidth} from '../../../../../styles/scales';

import Switch from '../../../../../components/Globals/Switch';

import {useAlarmSoundContext} from '../../../../../contexts/alarm-sound.context';

import {soundSettings} from '../../../../../constants/available-settings';
import InformUserModal from '../../../../../components/Modals/InformUserModal.js';

const PREVIEW_TIME = 10000;

Sound.setCategory('Playback');
let soundPlayer = new Sound(soundSettings[0]?.track);

export default function AlarmSoundPicker({isScreenFocused, navigation}) {
  const alarmPreviewTimeout = useRef();
  const [soundPlaying, setSoundPlaying] = useState(false);
  const {alarmSound, setAlarmSound, alarmSoundEnabled, setAlarmSoundEnabled} =
    useAlarmSoundContext();
  const [informUserModal, setInformUserModal] = useState(false);

  const stopPlayer = () => {
    soundPlayer.release();
    setSoundPlaying(null);
    clearTimeout(alarmPreviewTimeout.current);
  };

  useEffect(() => {
    if (!isScreenFocused) {
      stopPlayer();
    }
  }, [isScreenFocused]);

  const playSound = (soundName, soundIndex) => {
    stopPlayer();

    if (soundName) {
      if (soundPlaying === soundIndex) {
        setSoundPlaying(null);
      } else {
        soundPlayer = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          soundPlayer.setNumberOfLoops(-1);
          soundPlayer.play();
          alarmPreviewTimeout.current = setTimeout(stopPlayer, PREVIEW_TIME);
        });
        setSoundPlaying(soundIndex);
      }
    } else {
      setSoundPlaying(null);
    }
  };

  const handleSwitch = (value) => {
    setAlarmSoundEnabled(value);

    if (!value) {
      playSound(null);
    }
  };

  function handleSetAlarm(track) {
    setAlarmSound(track);
  }

  const handlePurchaseClicked = () => {
    setInformUserModal(!informUserModal);
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
          value={alarmSoundEnabled}
          onValueChange={(v) => handleSwitch(v)}
        />
      </SettingHead>
      {alarmSoundEnabled && (
        <SettingBody>
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
                    alarmSound === sound.track
                      ? setAlarmSound(null)
                      : handleSetAlarm(sound.track)
                  }>
                  <Image
                    source={
                      alarmSound === sound.track
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
      {informUserModal && (
        <InformUserModal
          informUserModal={informUserModal}
          setInformUserModal={setInformUserModal}
          greetings={'Welcome'}
          message={'Sign up to access the Store and other premium access.'}
          isGuestUser={true}
          navigation={navigation}
        />
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
