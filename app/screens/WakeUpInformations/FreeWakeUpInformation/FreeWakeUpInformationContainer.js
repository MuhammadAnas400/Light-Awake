import React, {useEffect, useMemo} from 'react';
import {useIsFocused} from '@react-navigation/native';


import useTime from '../../../hooks/useTime';

import {useDeviceBrightnessContext} from '../../../contexts/device-brightness.context';
import {useTimeFormatContext} from '../../../contexts/time-format.context';
import FreeWakeUpInformationScreen from './FreeWakeUpInformationScreen';

const DATA = [
  {
    content: 'Adventure is worthwhile in itself.',
    author: 'Amelia Earhart',
    image: require('../../../../assets/images/wakeup/1.jpg'),
  },
  {
    content:
      'If the ocean can calm itself, so can you. We are both salt water mixed with air.',
    author: 'Nayyirah Wahee',
    image: require('../../../../assets/images/wakeup/2.jpg'),
  },
  {
    content: 'I cannot teach anybody anything. I can only make them think.',
    author: 'Socrates',
    image: require('../../../../assets/images/wakeup/3.jpg'),
  },
  {
    content:
      'Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything.',
    author: 'Plato',
    image: require('../../../../assets/images/wakeup/4.jpg'),
  },
  {
    content:
      'Art enables us to find ourselves and lose ourselves at the same time.',
    author: 'Thomas Merto',
    image: require('../../../../assets/images/wakeup/5.jpg'),
  },
  {
    content: 'Dance is the hidden language of the soul.',
    author: 'Martha Graham',
    image: require('../../../../assets/images/wakeup/6.jpg'),
  },
  {
    content: 'One bad move nullifies forty good ones',
    author: 'Horowitz',
    image: require('../../../../assets/images/wakeup/7.jpg'),
  },
  {
    content:
      'Niobe had six sons and six daughters and boasted of her progenitive superiority to the Titan Leto, who had only two children. As punishment for her pride, Apollo killed all Niobe’s sons and Artemis killed all her daughters. The story of Niobe illustrates the Greek theme that the gods are quick to take vengeance  on human pride and arrogance',
    author: null,
    image: require('../../../../assets/images/wakeup/8.jpg'),
  },
  {
    content:
      'We are flawed creatures, all of us. Some of us think that means we should fix our flaws. But get rid of my flaws and there would be no one left.',
    author: 'Sarah Vowell',
    image: require('../../../../assets/images/wakeup/9.jpg'),
  },
  {
    content:
      'The color of springtime is in the flowers; the color of winter is in the imagination.',
    author: 'Terri Guillemets',
    image: require('../../../../assets/images/wakeup/10.jpg'),
  },
  {
    content:
      'Rome is not like any other city. It’s a big museum, a living room that shall be crossed on one’s toes.',
    author: 'Alberto Sordi',
    image: require('../../../../assets/images/wakeup/11.jpg'),
  },
  {
    content: 'Home is the nicest word there is.',
    author: 'Laura Ingalls Wilder',
    image: require('../../../../assets/images/wakeup/12.jpg'),
  },
  {
    content: 'The sea lives in every one of us.',
    author: 'Robert Wyland',
    image: require('../../../../assets/images/wakeup/13.jpg'),
  },
  {
    content:
      'Being a family means you are a part of something very wonderful. It means you will love and be loved for the rest of your life.',
    author: 'Lisa Weed',
    image: require('../../../../assets/images/wakeup/14.jpg'),
  },
];

export default function FreeWakeUpInformationContainer({navigation}) {
  const {timeFormat} = useTimeFormatContext();
  const {timeToDisplay, period} = useTime(timeFormat);
  const {restoreDeviceBrightnessWhenAppIsReady} = useDeviceBrightnessContext();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      restoreDeviceBrightnessWhenAppIsReady();
    }
  }, [restoreDeviceBrightnessWhenAppIsReady, isFocused]);

  const wakeUpData = useMemo(() => DATA[randomInteger(0, DATA.length - 1)], []);

  return (
    <FreeWakeUpInformationScreen
      timeToDisplay={timeToDisplay}
      period={period}
      wakeUpData={wakeUpData}
      navigation={navigation}
    />
  );
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
