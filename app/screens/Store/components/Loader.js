/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

export default function Loader() {
  return (
    <View
      style={{
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 'auto',
      }}>
      <LottieView
        source={require('../../../../assets/fetch.json')}
        style={{
          width: responsiveScreenWidth(15),
          height: responsiveScreenHeight(40),
        }}
        autoPlay
        loop
      />
    </View>
  );
}
