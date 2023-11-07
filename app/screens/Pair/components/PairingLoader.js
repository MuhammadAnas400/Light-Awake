import React from 'react';
import {Platform} from 'react-native';

import AnimatedLoader from 'react-native-animated-loader';
import FadingSlides from 'react-native-fading-slides';

import styled from 'styled-components/native';
import {
  ButtonText,
  SetButton,
  ScreenContainer as DefaultScreenContainer,
} from '../../../styles/commonStyledComponents';
import {scaleHeight, scaleWidth} from '../../../styles/scales';

export function PairingLoader({
  isPairing,
  responsiveWidth,
  responsiveHeight,
  instructionSlides,
  handleStopPair,
}) {
  return (
    <PairFormContainer>
      <PairFormChildWrapper>
        <AnimatedLoader
          visible={isPairing}
          source={require('../../../../assets/loader.json')}
          animationStyle={{
            width: responsiveWidth(20),
            height: responsiveHeight(35),
            marginTop:
              Platform.OS === 'ios'
                ? responsiveHeight(13)
                : responsiveHeight(17),
          }}>
          <FadingSlides
            slides={instructionSlides}
            fadeDuration={1200}
            stillDuration={2000}
            height={10}
            startAnimation={true}
          />
          <SetButton
            style={{
              marginBottom:
                Platform.OS === 'ios'
                  ? responsiveHeight(13)
                  : responsiveHeight(16),
            }}
            onPress={handleStopPair}>
            <ButtonText>STOP</ButtonText>
          </SetButton>
        </AnimatedLoader>
      </PairFormChildWrapper>
    </PairFormContainer>
  );
}

const PairFormChildWrapper = styled.View`
  padding: 4.5% 4.9%;
  border-radius: 5px;
  width: 100%;
`;

const PairFormContainer = styled.View`
  position: relative;
  width: 100%;
  padding: 0 ${scaleWidth(30)}px;
  margin-top: ${scaleHeight(80)}px;
`;
