
import React from 'react';
import BackButton from '../../components/Globals/BackButton';
import styled from 'styled-components/native';
import {scaleHeight} from '../../styles/scales';
import {
  ScreenContainer as DefaultScreenContainer,
  ScreenHead,
  ScreenTitle,
} from '../../styles/commonStyledComponents';

export function Header({navigation}) {
  return (
    <BulbScreenHead>
      <BackButton onPress={() => navigation.navigate('Home')} />
      <ScreenTitle>BULBS</ScreenTitle>
    </BulbScreenHead>
  );
}

const BulbScreenHead = styled(ScreenHead)`
  padding-bottom: ${scaleHeight(35)}px;
`;
