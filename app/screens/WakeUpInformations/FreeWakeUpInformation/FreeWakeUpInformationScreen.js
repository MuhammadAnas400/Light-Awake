
import React from 'react';

import styled from 'styled-components/native';
import {
  Clock as DefaultClock,
  ClockBarContainer,
  PeriodContainer,
  PeriodText,
  ScreenContainer,
} from '../../../styles/commonStyledComponents';
import {scaleHeight, scaleWidth} from '../../../styles/scales';
import RNUxcam from 'react-native-ux-cam';

export default function FreeWakeUpInformationScreen({
  timeToDisplay,
  period,
  wakeUpData,
  navigation,
}) {
  RNUxcam.tagScreenName('Wake-up Screen');
  return (
    <BackgroundImage source={wakeUpData.image} resizeMode="cover">
      <Container>
        <ClockBarContainer>
          <Clock>{timeToDisplay}</Clock>
          {period ? (
            <PeriodContainer>
              <PeriodText active={period === 'AM'}>AM</PeriodText>
              <PeriodText active={period === 'PM'}>PM</PeriodText>
            </PeriodContainer>
          ) : null}
        </ClockBarContainer>
        <QuoteContainer>
          <QuoteText>{wakeUpData.content}</QuoteText>
          <QuoteAuthor>{wakeUpData.author || 'Anonymous'}</QuoteAuthor>
        </QuoteContainer>
        <CloseButton onPress={() => navigation.navigate('Home')}>
          <CloseButtonText>Close</CloseButtonText>
        </CloseButton>
      </Container>
    </BackgroundImage>
  );
}

const BackgroundImage = styled.ImageBackground`
  width: 100%;
  height: 100%;
`;

const Container = styled(ScreenContainer)`
  align-items: center;
  justify-content: space-around;
  padding: 0 ${scaleWidth(16)}px;
  background-color: undefined;
`;

const Clock = styled(DefaultClock)`
  font-size: ${scaleWidth(100)}px;
`;

const QuoteContainer = styled.View`
  width: ${scaleWidth(353)}px;
  background-color: ${(props) => props.theme.colors.quoteContainer};
  padding: ${scaleHeight(54)}px ${scaleWidth(19)}px;
  border-radius: ${scaleWidth(34)}px;
`;

const QuoteText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-size: ${scaleWidth(23)}px;
  text-align: center;
`;

const QuoteAuthor = styled(QuoteText)`
  margin-top: 3%;
`;

const CloseButton = styled.TouchableOpacity`
  width: ${scaleWidth(353)}px;
  height: ${scaleHeight(104)}px;
  border-radius: ${scaleWidth(52)}px;
  border: 3px solid ${(props) => props.theme.colors.white};
`;

const CloseButtonText = styled.Text`
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${scaleWidth(30)}px;
  margin: auto;
`;
