import React, {useEffect} from 'react';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import DeviceInfo from 'react-native-device-info';

import {ANDROID_CLIENT_ID, WEB_CLIENT_ID} from '../../../../constants';

import styled from 'styled-components/native';
import {scaleWidth, scaleHeight} from '../../../../styles/scales';

import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../../network/AxiosRequestHandler';
import {storeAsyncStorageData} from '../../../../constants/utils';
import StorageProperty from '../../../../constants/storage-property';
import {Toast} from '../../../../components/Globals/Toast';

export function GoogleSignIn({navigation}) {
  useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: WEB_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID,
      scopes: ['profile', 'email'],
      forceCodeForRefreshToken: true,
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const userInfo = await GoogleSignin.signIn();
      const {idToken, user} = userInfo,
        {givenName, familyName} = user;

      login(idToken, givenName, familyName);
    } catch (error) {
      Toast('Error', error.message, 'danger', 'danger');
    }
  }

  async function login(identity_token, first_name, last_name) {
    const deviceId = await DeviceInfo.getUniqueId()

    try {
      const data = {
        google_id: identity_token,
        first_name: first_name,
        last_name: last_name,
        device_id: deviceId,
      };
      const requestConfig = {
        data: data,
        method: method.post,
        url: `${connectionPath.auth.loginWithGoogle}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        const authToken = {
          client: response.headers['client'],
          uid: response.headers['uid'],
          'access-token': response.headers['access-token'],
        };

        storeAsyncStorageData(
          StorageProperty.USER_TOKEN,
          JSON.stringify(authToken),
        );

        Toast('Success', 'Successfully logged in!', 'success', 'success');

        setTimeout(() => {
          navigation.navigate('Store');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        Toast('Error', error.response.data.message, 'danger', 'danger');
      }
    }
  }

  return (
    <SocialButtonsContainer>
      <SocialButtonChildrenWrapper>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={onGoogleButtonPress}
        />
      </SocialButtonChildrenWrapper>
    </SocialButtonsContainer>
  );
}

const SocialButtonChildrenWrapper = styled.View`
  width: 100%;
  padding: 2% 2.5%;
  border-radius: 5px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SocialButtonsContainer = styled.View`
  width: 100%;
  padding: ${scaleHeight(10)}px ${scaleWidth(30)}px 0;
  margin: auto;
`;
