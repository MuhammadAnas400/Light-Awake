/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Sound from 'react-native-sound';
import Torch from 'react-native-torch';
import * as Brightness from 'expo-brightness';
import {deactivateKeepAwake, activateKeepAwake} from 'expo-keep-awake';

import {
  pulseSettings,
  colorSettings,
} from '../../../constants/available-settings';
import {useTimeFormatContext} from '../../../contexts/time-format.context';
import {useWakeUpContext} from '../../../contexts/wake-up.context';
import {useAlarmSoundContext} from '../../../contexts/alarm-sound.context';
import {useDeviceBrightnessContext} from '../../../contexts/device-brightness.context';

import useTime from '../../../hooks/useTime';
import {useTuyaServices} from '../../../hooks/useTuyaServices';
import FreeAlarmScreen from './FreeAlarmScreen';

export default function FreeAlarmContainer({navigation}) {
  const [torchIsFlashing, setTorchIsFlashing] = useState(false);
  const [bulbIsFlashing, setBulbIsFlashing] = useState(false);
  const {timeFormat} = useTimeFormatContext();
  const {timeToDisplay, period} = useTime(timeFormat);
  const {
    bulbPulseRate,
    bulbPulseRateEnabled,
    flashlightPulseRate,
    flashlightPulseRateEnabled,
    screenColor,
    screenPulseRate,
    screenPulseRateEnabled,
  } = useWakeUpContext();
  const {alarmSound, alarmSoundEnabled} = useAlarmSoundContext();
  const {readyToChangeBrightness} = useDeviceBrightnessContext();
  const isFocused = useIsFocused();

  const screenOpacity = useRef(new Animated.Value(1)).current;
  const {turnBulbOn, turnBulbOff} = useTuyaServices();
  const chosenColors = colorSettings.find(
    (setting) => setting.backgroundColor === screenColor,
  );

  useEffect(() => {
    const setMaximumBrightness = async () => {
      // setting brightness after moving app to background on android
      // doesn't work if we didn't get brightness earlier
      await Brightness.getBrightnessAsync();
      await Brightness.setBrightnessAsync(1);
    };

    if (readyToChangeBrightness && isFocused) {
      activateKeepAwake();
      setMaximumBrightness();
    }
  }, [readyToChangeBrightness, isFocused]);

  useEffect(() => {
    const soundPlayer = new Sound(alarmSound, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        playTrack();
      }
      soundPlayer.setNumberOfLoops(-1);
      if (alarmSoundEnabled) {
        soundPlayer.play();
      }
    });

    soundPlayer.setVolume(1);

    return () => {
      soundPlayer.stop();
    };
  }, [alarmSound, alarmSoundEnabled]);

  useEffect(() => {
    if (bulbPulseRateEnabled) {
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
        }, mapPulseSettingToTimeInMiliseconds(bulbPulseRate));
        return () => {
          clearTimeout(turnOnTorchTimeout);
        };
      }
    }
  }, [bulbPulseRateEnabled, bulbPulseRate, bulbIsFlashing]);

  useEffect(() => {
    if (flashlightPulseRateEnabled) {
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
        }, mapPulseSettingToTimeInMiliseconds(flashlightPulseRate));
        return () => {
          clearTimeout(turnOnTorchTimeout);
        };
      }
    }
  }, [flashlightPulseRateEnabled, flashlightPulseRate, torchIsFlashing]);

  useEffect(() => {
    if (screenPulseRateEnabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(screenOpacity, {
            toValue: 0.3,
            duration: mapPulseSettingToTimeInMiliseconds(screenPulseRate) / 2,
            useNativeDriver: true,
          }),
          Animated.timing(screenOpacity, {
            toValue: 1,
            duration: mapPulseSettingToTimeInMiliseconds(screenPulseRate) / 2,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ]),
      ).start();
    }
  }, [screenOpacity, screenPulseRate, screenPulseRateEnabled]);

  const handleTurnOffPress = () => {
    turnBulbOn();
    deactivateKeepAwake();
    navigation.replace('FreeInformation');
  };

  const handleSnoozeButton = () => {
    const snoozeTimeInMiliseconds = 300000;
    const sleepSoundHourLimit = [
      {
        name: '1',
        milliseconds: snoozeTimeInMiliseconds,
      },
    ];

    turnBulbOff();

    navigation.replace('FreeSleep', {
      adjustedAlarmDateInMiliseconds:
        new Date().getTime() + snoozeTimeInMiliseconds,
      sleepSoundHourLimit,
    });
  };

  return (
    <FreeAlarmScreen
      Boolean={Boolean}
      period={period}
      timeToDisplay={timeToDisplay}
      chosenColors={chosenColors}
      handleTurnOffPress={handleTurnOffPress}
      handleSnoozeButton={handleSnoozeButton}
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
