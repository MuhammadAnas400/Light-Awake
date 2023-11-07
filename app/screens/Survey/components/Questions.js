import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import AppIntoSlider from 'react-native-app-intro-slider';

import styled from 'styled-components/native';

import {
  ScreenContainer as DefaultScreenContainer,
  SettingContainer,
  SettingHead,
  SettingTitle,
  Row,
  Spacer,
} from '../../../styles/commonStyledComponents';

import {theme} from '../../../styles/theme';
import {Toast} from '../../../components/Globals/Toast';

import StorageProperty from '../../../constants/storage-property';
import {storeAsyncStorageData} from '../../../constants/utils';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';
import {Answers} from './Answers';
import RNUxcam from 'react-native-ux-cam';

export function Questions({navigation}) {

  RNUxcam.tagScreenName('Survey Screen');

  const slider = useRef();
  const [nextButtonShow, setNextButtonShow] = useState(false);
  const [doneButtonShow, setDoneButtonShow] = useState(false);
  const [answer0, setAnswer0] = useState([]);
  const [answer1, setAnswer1] = useState([]);
  const [answer2, setAnswer2] = useState([]);
  const [answer3, setAnswer3] = useState([]);
  const [answer4, setAnswer4] = useState([]);
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      key: 0,
      question: 'Why did you download the Light Awake app?',
      answers: [
        'Have trouble waking up.',
        'Oversleeps alarm clock, hits snooze multiple times.',
        'Want to try a new alarm clock.',
        'Unhappy with current wake up experience.',
        'Are hard of hearing.',
        'Interested in pairing Smart bulb with alarm clock.',
        'Have insomnia',
        'Have anxity',
        'Other'
      ],
    },
    {
      key: 1,
      question:
        'Are you interested in audio to help you go to sleep?',
      answers: ['Yes', 'No'],
    },
    {
      key: 2,
      question: 'Describe yourself. Check all that apply:',
      answers: [
        'Student',
        'Parent',
        'Work full time',
        'Married',
        'Single',
        'Hard of hearing',
        'Fitness enthusiast',
        'Live in close quarters',
        'Outdoors enthusiast',
        'College educated',
        'Have trouble falling asleep',
        'Retired',
        'Grandparent',
      ],
    },
    {
      key: 3,
      question: 'What is your current alarm clock',
      answers: [
        'Built in Iphone',
        'Built in Android phone',
        'Alarm clock app',
        'Radio alarm clock',
        'Fitbit',
        'Other'
      ],
    },
    {
      key: 4,
      question: 'What features would you like in an alarm clock?',
      answers: [],
    },
  ];

  const surveyResult = [
    {
      question1: 'Why did you download the Light Awake app?',
      answer: [],
    },
    {
      question2: 'Are you interested in audio to help you go to sleep?',
      answer: [],
    },
    {
      question3: 'Describe your self. Check all that apply:',
      answer: [],
    },
    {
      question4: 'What is your current alarm clock',
      answer: [],
    },
    {
      question5: 'What features would you like in an alarm clock?',
      answer: [],
    },
  ];

  const handleSliderChanged = (index) => {
    setSlide(index);
  };

  const handleSubmit = async () => {
    const userExists = await verifyUser();
    completeSurveyResult();

    if (userExists) {
      sendSurveyResult();
    } else {
      createGuestUser();
    }
  };

  function completeSurveyResult() {
    // reset data
    surveyResult[0].answer = [];
    surveyResult[1].answer = [];
    surveyResult[2].answer = [];
    surveyResult[3].answer = [];
    surveyResult[4].answer = [];

    answer0.map((answer) => {
      surveyResult[0].answer.push(answer);
    });

    surveyResult[1].answer.push(answer1);

    answer2.map((answer) => {
      surveyResult[2].answer.push(answer);
    });

    surveyResult[3].answer.push(answer3);
    
    surveyResult[4].answer.push(answer4);
  }

  async function verifyUser() {
    try {
      const params = {
        device_id: await DeviceInfo.getUniqueId(),
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: `${connectionPath.users.checkGuestUserExists}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async function createGuestUser() {
    try {
      const params = {
        device_id: await DeviceInfo.getUniqueId(),
      };

      const requestConfig = {
        params: params,
        method: method.post,
        url: `${connectionPath.auth.loginAsGuest}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        const authToken = {
          client: response.headers['client'],
          uid: response.headers['uid'],
          'access-token': response.headers['access-token'],
        };

        console.log(authToken);
        sendSurveyResult();
      }
    } catch (error) {
      if (error.response) {
        Toast('Error', error.response.data.message, 'danger', 'danger');
      }
    }
  }

  async function sendSurveyResult() {
    try {
      const params = {
        device_id: await DeviceInfo.getUniqueId(),
        survey: JSON.stringify(surveyResult),
      };
      const requestConfig = {
        params: params,
        method: method.post,
        url: connectionPath.users.submitSurveyAnswers,
      };

      console.log(surveyResult);
      
      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        storeAsyncStorageData(StorageProperty.SURVEYANSWERED, 'true');

        Toast('Success', 'Survey completed!', 'success', 'success');
        setTimeout(() => {
          navigation.navigate('Home', {hasAnswered: true});
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderQuestions = ({item}) => {
    const {answers, question} = item;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <QuestionContainer>
          <Spacer style={{paddingTop: responsiveScreenHeight(10)}} />
          <SettingTitle
            style={{
              fontSize: responsiveScreenFontSize(2),
              color: theme.colors.gray,
            }}>
            Select an answer
          </SettingTitle>
          <SettingHead
            style={{
              height: responsiveScreenHeight(9),
              paddingTop: responsiveScreenHeight(5),
              paddingBottom: responsiveScreenHeight(5),
            }}>
            <Row
              style={{
                height: responsiveScreenHeight(10),
              }}>
              <SettingTitle
                style={{
                  fontSize: responsiveScreenFontSize(2.5),
                }}>
                {question}
              </SettingTitle>
            </Row>
          </SettingHead>
          <Answers
            slide={slide}
            answers={answers}
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
        </QuestionContainer>
      </KeyboardAvoidingView>
    );
  };

  useEffect(() => {
    if ((answer0.length && answer1.length && answer2.length && answer3.length && answer4.length) != 0) {
      setDoneButtonShow(true);
    } else {
      setDoneButtonShow(false);
    }
  }, [answer0, answer1, answer2, answer3, answer4]);

  return (
    <AppIntoSlider
      bottomButton={true}
      data={slides}
      dotClickEnabled={false}
      onDone={handleSubmit}
      onSlideChange={(index) => handleSliderChanged(index)}
      ref={(ref) => (slider.current = ref)}
      renderItem={renderQuestions}
      showDoneButton={doneButtonShow}
      showNextButton={nextButtonShow}
    />
  );
}

const QuestionContainer = styled(SettingContainer)`
  height: 100%;
  padding-bottom: 30%;
`;
