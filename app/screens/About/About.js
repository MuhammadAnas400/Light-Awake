import React, {useCallback, useEffect, useState} from 'react';
import {Linking, TouchableWithoutFeedback} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import BackButton from '../../components/Globals/BackButton';

import styled from 'styled-components/native';
import {ScreenContainer, ScreenHead} from '../../styles/commonStyledComponents';
import {scaleWidth} from '../../styles/scales';
import {getAsyncStorageData} from '../../constants/utils';
import StorageProperty from '../../constants/storage-property';
import AxiosRequestHandler, { connectionPath, method } from '../../network/AxiosRequestHandler';
import RNUxcam from 'react-native-ux-cam';


const Link = ({href, children}) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(href);
    if (supported) {
      await Linking.openURL(href);
    } else {
      throw new Error(`Don't know how to open this href: ${href}`);
    }
  }, [href]);

  return <TouchableWithoutFeedback onPress={handlePress}>{children}</TouchableWithoutFeedback>;
};

const About = ({navigation}) => {
  RNUxcam.tagScreenName('About Screen');
  const [hasAnsweredSurvey, setHasAnsweredSurvey] = useState(false);

  useEffect(() => {
    async function checkIfUserHasAnsweredSurvey() {
      try {
        const data = {
          device_id: await DeviceInfo.getUniqueId()
        }
        const requestConfig = {
          data: data,
          method: method.post,
          url: connectionPath.users.validateUserSurvey,
        }

        const response = await AxiosRequestHandler(requestConfig, true, true)

        setHasAnsweredSurvey(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    checkIfUserHasAnsweredSurvey();
  }, []);


  return (
    <Container>
      <ScreenHead single>
        <BackButton onPress={() => navigation.goBack()} />
      </ScreenHead>
      <Content>
        <Title>About</Title>
        <Description>
          <Bold>
            Light Awake uses pulsating light to gently rouse you from sleep.
          </Bold>{' '}
          Its flashing light is designed to stimulate your circadian system and
          comfortably move your mind from slumber to consciousness.{' '}
          <Bold>
            This is the only wakeup system that is based on the physiology of
            our eyes and brain.
          </Bold>
        </Description>

        <Inline>
          <Description>To learn more please go to </Description>

          <Link href="https://www.lightawake.biz">
            <Bold>
              <Description>lightawake.biz</Description>
            </Bold>
          </Link>
        </Inline>
        {!hasAnsweredSurvey && (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('Survey');
          }}>
          <Inline>
            <Bold>
              <Description>Take our survey?</Description>
            </Bold>
          </Inline>
        </TouchableWithoutFeedback>
        )}
        <Inline>
          <Link href="https://lightawake.biz/terms-conditions/#app">
            <Bold>
              <StyledDescription>Terms and Conditions</StyledDescription>
            </Bold>
          </Link>
        </Inline>
      </Content>
    </Container>
  );
};

const Container = styled(ScreenContainer)`
  background-color: ${(props) => props.theme.colors.darkIndigoThree};
  padding: 0;
  align-items: flex-start;
`;

const Content = styled.View`
  display: flex;
  width: 85%;
  height: 85%;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${Math.max(scaleWidth(40), 40)}px;
  color: ${(props) => props.theme.colors.white};
  padding-bottom: 5%;
`;

const Description = styled.Text`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${Math.max(scaleWidth(18), 18)}px;
  line-height: ${scaleWidth(30)}px;
  color: ${(props) => props.theme.colors.white};
  padding: 5% 0;
`;

const StyledDescription = styled(Description)`
  color: ${(props) => props.theme.colors.yellow};
`;

const Bold = styled(Description)`
  font-weight: 700;
`;

const Inline = styled.View`
  flex-direction: row;
`;

export default About;
