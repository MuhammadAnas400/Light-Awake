
import React from 'react';

import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {ScrollView} from 'react-native-gesture-handler';

import styled from 'styled-components/native';
import {
  ScreenContainer as DefaultScreenContainer,
  Spacer,
} from '../../../styles/commonStyledComponents';

import Answer from './Answer';

import {theme} from '../../../styles/theme';
import RNUxcam from 'react-native-ux-cam';

export function Answers({
  slide,
  answers,
  answer0,
  answer1,
  answer2,
  answer3,
  answer4,
  setAnswer0,
  setAnswer1,
  setAnswer2,
  setAnswer3,
  setAnswer4,
  setNextButtonShow,
  setDoneButtonShow,
}) {
  RNUxcam.tagScreenName('Survey Screen');
  const handleAnswerTyped = (answer) => {
    if (slide == 1) {
      setAnswer1(answer);
    }
    setNextButtonShow(true);
    
    if (slide == 4) {
      setAnswer4(answer)
    }

  };
  return (
    <ScrollView>
      <AnswersContainer>
        {answers?.map((answer) => (
          <Answer
            slide={slide}
            answer={answer}
            answer0={answer0}
            answer1={answer1}
            answer2={answer2}
            answer3={answer3}
            answer4={answer4}
            setAnswer0={setAnswer0}
            setAnswer1={setAnswer1}
            setAnswer2={setAnswer2}
            setAnswer3={setAnswer3}
            setAnswer4={setAnswer4}
            setNextButtonShow={setNextButtonShow}
            setDoneButtonShow={setDoneButtonShow}
          />
        ))}
      </AnswersContainer>
      <Spacer />
      {slide !== 0 && slide !== 2 && slide !== 1 && (
        <InputTextContainer>
          <InputText
            value={slide == 3 ? answer3 : answer4}
            onChangeText={(value) => handleAnswerTyped(value)}
            placeholder={'Answer'}
            placeholderTextColor={'white'}
          />
        </InputTextContainer>
      )}
    </ScrollView>
  );
}

const AnswersContainer = styled.View`
  width: 85%;
  display: flex;
  padding-left: 3px;
  padding-bottom: 3px;
  flex-direction: column;
  align-items: flex-start;
`;

const InputText = styled.TextInput`
  margin: auto;
  font-size: 18px;
  font-family: ${theme.fonts.regular}
  color: white;
  border-width: 0;
  height: ${responsiveScreenHeight(5)};
  width: 100%
  
  `;

const InputTextContainer = styled.View`
  margin-left: auto;
  margin-right: auto;
  width: 75%;
  border-color: white;
  border-style: solid;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-width: 2px;
`;
