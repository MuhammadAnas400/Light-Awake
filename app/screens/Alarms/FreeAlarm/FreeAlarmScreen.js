/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Animated} from 'react-native';
import styled from 'styled-components/native';
import {ClockBar} from '../../../styles/commonStyledComponents';
import {theme} from '../../../styles/theme';

export default function FreeAlarmScreen({
  Boolean,
  period,
  timeToDisplay,
  chosenColors,
  handleTurnOffPress,
  handleSnoozeButton,
  screenOpacity,
}) {
  return (
    <BlackBackground>
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: theme.colors[chosenColors.backgroundColor],
          opacity: screenOpacity,
        }}
      />
      <Container>
        <ClockContainer>
          <ClockBar>
            <Clock
              chosenColor={chosenColors.color}
              periodExist={Boolean(period)}>
              {timeToDisplay}
            </Clock>
            {period && (
              <PeriodContainer>
                <PeriodText
                  chosenColor={chosenColors.color}
                  active={period === 'AM'}>
                  AM
                </PeriodText>
                <PeriodText
                  chosenColor={chosenColors.color}
                  active={period === 'PM'}>
                  PM
                </PeriodText>
              </PeriodContainer>
            )}
          </ClockBar>
        </ClockContainer>
        <TurnOffContainer>
          <TurnOffButton
            chosenColor={chosenColors.color}
            onPress={handleTurnOffPress}>
            <TurnOffText chosenColor={chosenColors.backgroundColor}>
              Turn off
            </TurnOffText>
          </TurnOffButton>
          <SnoozeButton
            chosenColor={chosenColors.color}
            onPress={handleSnoozeButton}>
            <SnoozeButtonText chosenColor={chosenColors.color}>
              Snooze
            </SnoozeButtonText>
          </SnoozeButton>
        </TurnOffContainer>
      </Container>
    </BlackBackground>
  );
}

const BlackBackground = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.black};
`;

const Container = styled.SafeAreaView`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClockContainer = styled.View`
  width: 100%;
  padding-bottom: 30%;
  display: flex;
`;

const Clock = styled.Text`
  color: ${(props) => props.theme.colors[props.chosenColor]};
  font-family: ${(props) => props.theme.fonts.black};
  font-size: ${(props) => (props.periodExist ? 90 : 100)}px;
`;

const PeriodContainer = styled.View`
  display: flex;
  margin-left: 16px;
`;

const PeriodText = styled.Text`
  color: ${(props) => props.theme.colors[props.chosenColor]};
  font-family: ${(props) => props.theme.fonts.black};
  font-size: 26px;
  opacity: ${(props) => (props.active ? 1 : 0.3)};
`;

const TurnOffContainer = styled.View`
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 3;
`;

const TurnOffButton = styled.TouchableOpacity`
  width: 265px;
  height: 80px;
  margin: auto;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 52px;
  background-color: ${(props) => props.theme.colors[props.chosenColor]};
`;

const TurnOffText = styled.Text`
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 30px;
  color: ${(props) => props.theme.colors[props.chosenColor]};
`;

const SnoozeButton = styled.TouchableOpacity`
  width: 265px;
  height: 80px;
  margin: auto;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 52px;
  border: solid 2px ${(props) => props.theme.colors[props.chosenColor]};
`;

const SnoozeButtonText = styled.Text`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 30px;
  color: ${(props) => props.theme.colors[props.chosenColor]};
`;
