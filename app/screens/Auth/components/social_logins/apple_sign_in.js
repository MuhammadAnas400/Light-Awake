import React from 'react';

import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import DeviceInfo from 'react-native-device-info';

import styled from 'styled-components/native';
import {scaleWidth, scaleHeight} from '../../../../styles/scales';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../../network/AxiosRequestHandler';
import {storeAsyncStorageData} from '../../../../constants/utils';
import StorageProperty from '../../../../constants/storage-property';

import {Toast} from '../../../../components/Globals/Toast';

export function AppleSignIn({isLogin, navigation}) {
  async function onAppleButtonPress() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        login(appleAuthRequestResponse);
      }
    } catch (error) {
      if (error) {
        console.log(error.message);
      }
    }
  }

  async function login(appleAuthRequestResponse) {
    const {user, identityToken, authorizationCode, fullName} =
        appleAuthRequestResponse,
      {givenName, familyName} = fullName;

    const deviceId = await DeviceInfo.getUniqueId();

    try {
      const data = {
        user_identity: user,
        jwt: identityToken,
        code: authorizationCode,
        first_name: givenName,
        last_name: familyName,
        device_id: deviceId,
      };
      const requestConfig = {
        data: data,
        method: method.post,
        url: `${connectionPath.auth.loginWithApple}`,
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
        {appleAuth.isSupported && (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={
              isLogin ? AppleButton.Type.SIGN_IN : AppleButton.Type.SIGN_UP
            }
            style={{
              width: 165,
              height: 40,
              shadowColor: '#555',
              shadowOpacity: 0.5,
              shadowOffset: {
                width: 0,
                height: 3,
              },
            }}
            onPress={onAppleButtonPress}
          />
        )}
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
