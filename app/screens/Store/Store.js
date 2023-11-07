import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, Platform} from 'react-native';

import {
  flushFailedPurchasesCachedAsPendingAndroid,
  useIAP,
} from 'react-native-iap';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import BackButton from '../../components/Globals/BackButton';
import InAppAlarm from './components/InAppAlarm';
import InAppAudios from './components/InAppAudios';
import InAppSleepAudios from './components/InAppSleepAudios';

import styled from 'styled-components/native';
import {
  ScreenContainer as DefaultScreenContainer,
  ScreenHead,
} from '../../styles/commonStyledComponents';
import {scaleWidth, scaleHeight} from '../../styles/scales';
import Loader from './components/Loader';
import RNUxcam from 'react-native-ux-cam';

const Store = ({navigation}) => {
  
  RNUxcam.tagScreenName('Store Screen');

  const {connected} = useIAP();

  useEffect(() => {
    async function consumeAllItems() {
      if (connected) {
        if (Platform.OS === 'android'){
          try {
            await flushFailedPurchasesCachedAsPendingAndroid();
          } catch (_) {

          }        
        }
      }
    }

    consumeAllItems();
  }, []);

  const handleBackButtonPressed = () => {
    // IAP.endConnection(); // to release the resources when no interations are no longer needed with the library
    navigation.navigate('Home');
  };

  return (
    <ScreenContainer>
      <BackgroundImage platform={Platform.OS}>
      <BulbScreenHead>
        <BackButton onPress={handleBackButtonPressed} />
        <ScreenTitle>STORE</ScreenTitle>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfileSettings')}>
          <IconImage source={require('../../../assets/account.png')} />
        </TouchableOpacity>
      </BulbScreenHead>
      <ScreenContent>
          <Stack>
          <ScrollView>
              <InAppAudios />
              <InAppSleepAudios />
              <InAppAlarm />
            </ScrollView>
          </Stack>
      </ScreenContent>
      </BackgroundImage>
    </ScreenContainer>
  );
};

const Stack = ({children}) => {
  return (
    <StackContainer style={{paddingLeft: 0, paddingRight: 0}}>
      {React.Children.map(children, (child, index) => {
        const isLastChild = index === children.length - 1;
        return isLastChild ? (
          child
        ) : (
          <StackChildWrapper>{child}</StackChildWrapper>
        );
      })}
    </StackContainer>
  );
};

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const StackContainer = styled.View`
  width: 100%;
  height: 100%;
  padding: 0 ${scaleWidth(16)}px;
  margin-bottom: ${scaleHeight(16)}px;
`;

const StackChildWrapper = styled.View`
  width: 100%;
  margin-bottom: ${scaleHeight(10)}px;
`;

const SettingTitle = styled.Text`
  font-size: ${Math.min(scaleWidth(18), 18)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
`;

const BackgroundImage = styled.ImageBackground`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  ${({ platform }) => (platform === "ios"
        ? `top: 50px;`
        : `top: 0;`
    )};
`;

const BulbScreenHead = styled(ScreenHead)`
  padding-bottom: ${scaleHeight(35)}px;
  width: 100%;
`;

const IconImage = styled.Image`
  width: ${responsiveScreenWidth(10)};
  height: ${responsiveScreenHeight(5)};
`;

const ScreenTitle = styled.Text`
  width: 75%;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${scaleWidth(24)}px;
  text-align: center;
`;

const ScreenContent = styled.View`
  display: flex;
  height: 90%;
  align-items: center;
`;

export default Store;
