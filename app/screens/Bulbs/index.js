import React from 'react';

import styled from 'styled-components/native';
import {ScreenContainer as DefaultScreenContainer} from '../../styles/commonStyledComponents';
import {Header} from './header';
import {Body} from './body';
import RNUxcam from 'react-native-ux-cam';

export default function BulbsScreen({navigation, route}) {
  
  RNUxcam.tagScreenName('Bulb List Screen');

  return (
    <ScreenContainer>
      <Header navigation={navigation} />
      <Body navigation={navigation} route={route} />
    </ScreenContainer>
  );
}

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;
