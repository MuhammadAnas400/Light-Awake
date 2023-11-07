import React from 'react';

import {Switch as RNSwitch} from 'react-native-switch-warning-patch';

import {scaleWidth, scaleHeight} from '../../styles/scales';
import {theme} from '../../styles/theme';

export default function Switch({value, onValueChange}) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      circleSize={scaleWidth(34)}
      barHeight={scaleHeight(20)}
      backgroundActive={theme.colors.darkestIndigo}
      backgroundInactive={theme.colors.darkestIndigo}
      circleActiveColor={theme.colors.robinsEgg}
      circleInActiveColor={theme.colors.bluePurple}
      renderActiveText={false}
      renderInActiveText={false}
      switchWidthMultiplier={2}
      switchBorderRadius={scaleWidth(30)}
    />
  );
}
