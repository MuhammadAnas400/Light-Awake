import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

import styled from 'styled-components/native';
import {scaleWidth, scaleHeight} from '../../styles/scales';

export default function BackButton({onPress}) {
  return (
    <ScreenIcon>
      <TouchableOpacity style={{height: '100%'}} onPress={onPress}>
        <Image source={require('../../../assets/back.png')} />
      </TouchableOpacity>
    </ScreenIcon>
  );
}

const ScreenIcon = styled.View`
  position: absolute;
  width: ${Math.max(scaleWidth(80), 74)}px;
  height: ${Math.max(scaleWidth(80), 74)}px;
  left: ${scaleWidth(25)}px;
  top: ${scaleHeight(32)}px;
  z-index: 99;
`;
