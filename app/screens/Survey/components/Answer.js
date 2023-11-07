import React, {useEffect} from 'react';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import styled from 'styled-components/native';
import {SettingTitle} from '../../../styles/commonStyledComponents';
import RNUxcam from 'react-native-ux-cam';

export default function Answer({
  slide,
  answer,
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
  const handleAnswerPicked = (answer, value) => {
    // workaround so user can choose a new answer again
    if (value) {
      if (slide == 0) {
        const newAnswer0 = [...answer0, answer];
        setAnswer0(newAnswer0);
      }
    } else {
      if (slide == 0) {
        const index = answer0.indexOf(answer);

        if (index > -1) {
          //remove only if array is not empty
          answer0.splice(index, 1);
          if (answer0.length == 0) {
            setDoneButtonShow(false);
          }
        }
      }
    }

    // workaround so user can choose a new answer again
    if (slide == 1) {
      setAnswer1(answer);
    }

    if (value) {
      if (slide == 2) {
        const newAnswer2 = [...answer2, answer];
        setAnswer2(newAnswer2);
      }
    } else {
      if (slide == 2) {
        const index = answer2.indexOf(answer);

        if (index > -1) {
          //remove only if array is not empty
          answer2.splice(index, 1);
          if (answer2.length == 0) {
            setDoneButtonShow(false);
          }
        }
      }
    }

    if (slide == 3) {
      setAnswer3(answer);
    }

    if (slide == 4) {
      setAnswer4(answer);
    }

    setNextButtonShow(true);
  };

  return (
    <AnswerContainer>
      <CheckBoxContainer>
        {slide == 1 || slide == 3 ? (
          <BouncyCheckbox
            onPress={() => handleAnswerPicked(answer)}
            fillColor="#f3d449"
            size={25}
            isChecked={
              (slide == 1 && answer1 == answer) ||
              (slide == 3 && answer3 == answer)
            }
            disableBuiltInState
          />
        ) : (
          <BouncyCheckbox
            onPress={(value) => handleAnswerPicked(answer, value)}
            fillColor="#f3d449"
            size={25}
          />
        )}
      </CheckBoxContainer>
      <ScreenTitleContainer>
        <SettingTitle style={{width: `85%`}}>{answer}</SettingTitle>
      </ScreenTitleContainer>
    </AnswerContainer>
  );
}

const AnswerContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding-top: ${responsiveScreenHeight(2)};
`;

const CheckBoxContainer = styled.View`
  margin-top: auto;
  margin-bottom: auto;
  width: 35px;
`;

const ScreenTitleContainer = styled.View`
  width: 100%;
  margin-right: 10%;
`;
