/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {Alert, Animated} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Sound from 'react-native-sound';
import Torch from 'react-native-torch';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import * as Brightness from 'expo-brightness';
import {deactivateKeepAwake, activateKeepAwakeAsync} from 'expo-keep-awake';

import {useTimeFormatContext} from '../../../contexts/time-format.context';
import {useDeviceBrightnessContext} from '../../../contexts/device-brightness.context';

import useTime from '../../../hooks/useTime';
import {useTuyaServices} from '../../../hooks/useTuyaServices';

import UpgradeAlarmScreen from './UpgradeAlarmScreen';

import {
  pulseSettings,
  colorSettings,
} from '../../../constants/available-settings';


export default function UpgradeAlarmContainer({route, navigation}) {
  const {alarm} = route.params;
  const [torchIsFlashing, setTorchIsFlashing] = useState(false);
  const [bulbIsFlashing, setBulbIsFlashing] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const isFocused = useIsFocused();
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const {timeFormat} = useTimeFormatContext();
  const {readyToChangeBrightness} = useDeviceBrightnessContext();

  const {timeToDisplay, period} = useTime(timeFormat);
  const {turnBulbOn, turnBulbOff} = useTuyaServices();

  const chosenColors = colorSettings.find(
    (setting) => setting.backgroundColor === alarm?.alarm?.screen_color,
  );

  useEffect(() => {
    const setMaximumBrightness = async () => {
      // setting brightness after moving app to background on android
      // doesn't work if we didn't get brightness earlier
      await Brightness.getBrightnessAsync();
      await Brightness.setBrightnessAsync(1);
    };

    if (readyToChangeBrightness && isFocused) {
      activateKeepAwakeAsync();
      setMaximumBrightness();
    }
  }, [readyToChangeBrightness, isFocused]);

  useEffect(() => {
    try {
      if (alarm?.alarm?.alarm_sound) {
        const soundPlayer = new Sound(
          alarm.alarm.alarm_sound,
          Sound.MAIN_BUNDLE,
          (error) => {
            if (error) {
              console.log(error);
            }

            soundPlayer.setNumberOfLoops(-1);

            if (alarm?.alarm?.alarm_sound_enabled) {
              soundPlayer.play();
            }
          },
        );

        soundPlayer.setVolume(1);

        return () => {
          soundPlayer.stop();
        };
      } else {
        if (alarm?.alarm?.alarm_sound_enabled) {
          playTrack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    isPlayerReady,
    alarm?.alarm?.alarm_sound,
    alarm?.alarm?.alarm_sound_enabled,
  ]);

  useEffect(() => {
    if (alarm?.alarm?.bulb_pulse_rate_enabled) {
      if (bulbIsFlashing) {
        const turnOffTorchTimeout = setTimeout(() => {
          setBulbIsFlashing(false);
          turnBulbOff();
        }, 1000);
        return () => {
          clearTimeout(turnOffTorchTimeout);
        };
      } else {
        const turnOnTorchTimeout = setTimeout(() => {
          setBulbIsFlashing(true);
          turnBulbOn();
        }, mapPulseSettingToTimeInMiliseconds(alarm?.alarm?.bulb_pulse_rate));
        return () => {
          clearTimeout(turnOnTorchTimeout);
        };
      }
    }
  }, [
    bulbIsFlashing,
    alarm?.alarm?.bulb_pulse_rate,
    alarm?.alarm?.bulb_pulse_rate_enabled,
  ]);

  useEffect(() => {
    if (alarm?.alarm?.flashlight_pulse_rate_enabled) {
      if (torchIsFlashing) {
        const turnOffTorchTimeout = setTimeout(() => {
          setTorchIsFlashing(false);
          Torch.switchState(false);
        }, 1000);
        return () => {
          Torch.switchState(false);
          clearTimeout(turnOffTorchTimeout);
        };
      } else {
        const turnOnTorchTimeout = setTimeout(() => {
          setTorchIsFlashing(true);
          Torch.switchState(true);
        }, mapPulseSettingToTimeInMiliseconds(alarm?.alarm?.flashlight_pulse_rate));
        return () => {
          clearTimeout(turnOnTorchTimeout);
        };
      }
    }
  }, [
    torchIsFlashing,
    alarm?.alarm?.flashlight_pulse_rate,
    alarm?.alarm?.flashlight_pulse_rate_enabled,
  ]);

  useEffect(() => {
    if (alarm?.alarm?.screen_pulse_rate_enabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(screenOpacity, {
            toValue: 0.3,
            duration:
              mapPulseSettingToTimeInMiliseconds(
                alarm?.alarm?.screen_pulse_rate,
              ) / 2,
            useNativeDriver: true,
          }),
          Animated.timing(screenOpacity, {
            toValue: 1,
            duration:
              mapPulseSettingToTimeInMiliseconds(
                alarm?.alarm?.screen_pulse_rate,
              ) / 2,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ]),
      ).start();
    }
  }, [
    screenOpacity,
    alarm?.alarm?.screen_pulse_rate,
    alarm?.alarm?.screen_pulse_rate_enabled,
  ]);

  async function playTrack() {
    try {
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
  }

  const handleTurnOffPress = async () => {
    TrackPlayer.pause();
    await TrackPlayer.reset();
    turnBulbOn();
    deactivateKeepAwake();
    navigation.replace('FreeInformation');
  };

  const handleSnoozeButton = async () => {
    const snoozeTimeInMiliseconds = 300000;
    const sleepSoundHourLimit = [
      {
        name: '1',
        milliseconds: snoozeTimeInMiliseconds,
      },
    ];

    turnBulbOff();

    TrackPlayer.getQueue().then((queue) => {
      if (queue.length > 1) {
        TrackPlayer.skipToPrevious();
      } else {
        TrackPlayer.pause();
      }
    });

    TrackPlayer.pause();

    navigation.replace('UpgradeSleep', {
      adjustedAlarmDateInMiliseconds:
        new Date().getTime() + snoozeTimeInMiliseconds,
      alarm,
      sleepSoundHourLimit,
    });
  };

  return (
    <UpgradeAlarmScreen
      Boolean={Boolean}
      period={period}
      timeToDisplay={timeToDisplay}
      handleTurnOffPress={handleTurnOffPress}
      handleSnoozeButton={handleSnoozeButton}
      chosenColors={chosenColors}
      screenOpacity={screenOpacity}
    />
  );
}

const mapPulseSettingToTimeInMiliseconds = (settingLabel) => {
  const chosenSetting = pulseSettings.find(
    (setting) => setting.name === settingLabel,
  );
  const animatedSequenceTimeInMiliseconds =
    chosenSetting.miliseconds || pulseSettings[0].miliseconds;

  return animatedSequenceTimeInMiliseconds;
};
