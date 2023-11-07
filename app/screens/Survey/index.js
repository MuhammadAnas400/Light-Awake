
import React from 'react';
import {Questions} from './components/Questions';
import RNUxcam from 'react-native-ux-cam';

export default function Survey({navigation}) {
  RNUxcam.tagScreenName('Survey Screen');
  return <Questions navigation={navigation} />;
}
