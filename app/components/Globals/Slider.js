import React, {useRef, useState} from 'react';

import DefaultSlider from '@react-native-community/slider';

import styled from 'styled-components/native';
import {theme} from '../../styles/theme';
import {scaleWidth} from '../../styles/scales';

const MIN_VALUE = 1;

export default function Slider({step: initialStep, onStepChange, labels}) {
  const [step, setStep] = useState(labels.indexOf(initialStep) + 1 || 1);
  const lastValue = useRef(1);

  return (
    <Container>
      <DefaultSlider
        minimumValue={MIN_VALUE}
        maximumValue={labels.length}
        minimumTrackTintColor={theme.colors.robinsEgg}
        maximumTrackTintColor="rgb(20,11,60)"
        tapToSeek={true}
        thumbTintColor={theme.colors.robinsEgg}
        step={1} // - it defines how big the step should be
        value={step}
        onValueChange={(v) => {
          const roundedValue = Math.round(v);
          if (roundedValue !== lastValue) {
            setStep(v);
            onStepChange(labels[v - 1]);
            lastValue.current = roundedValue;
          }
        }}
      />
      <StepsContainer>
        {labels.map((label, index) => {
          return (
            <StepLabel active={step === index + 1} key={label}>
              {label}
            </StepLabel>
          );
        })}
      </StepsContainer>
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
`;

const StepsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StepLabel = styled.Text`
  font-family: ${(props) => props.theme.fonts.default};
  color: ${(props) => (props.active ? 'white' : 'gray')};
  font-size: ${Math.min(scaleWidth(16), 16)}px;
`;
