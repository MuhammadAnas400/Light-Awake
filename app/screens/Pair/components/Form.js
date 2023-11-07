import React, {useEffect, useState} from 'react';
import {Platform, ScrollView} from 'react-native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {stopConfig} from '@volst/react-native-tuya';

import styled from 'styled-components/native';
import {
  ButtonText,
  InputText,
  SetButton,
  ScreenContainer as DefaultScreenContainer,
} from '../../../styles/commonStyledComponents';
import {scaleHeight, scaleWidth} from '../../../styles/scales';

import {PairingLoader} from './PairingLoader';
import {Toast} from '../../../components/Globals/Toast';

import {useTuyaServices} from '../../../hooks/useTuyaServices';
import {IosWifiInput} from './IosWifiInput';
import {AndroidWifiInput} from './AndroidWifiInput';
import {useWifi} from '../hooks/useWifi';

const Form = ({isPairing, setIsPairing, navigation}) => {
  const [selectedWifiSsid, setSelectedWifiSsid] = useState();
  const [wifiPw, setWifiPw] = useState('');
  const {pair, turnBulbOff} = useTuyaServices();
  const {
    wifiSsids,
    wifiSsid,
    getIosWifi,
    getAndroidWifi,
    handleSetWifi,
    setWifiSsid,
  } = useWifi();
  const instructionSlides = [
    {
      subtitle: 'Keep the network stable.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Ensure that the Wi-Fi signal is good.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Power on the device.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Verify Wi-Fi password.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Check if it is 2.4GHz Wi-Fi.',
      subtitleColor: '#fff',
    },
  ];

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getIosWifi();
    }

    if (Platform.OS === 'android') {
      getAndroidWifi();
    }
  }, []);

  async function handleStartPair() {
    if (!((selectedWifiSsid ?? wifiSsid) && wifiPw)) {
      return Toast(
        'Error',
        'Complete the form to continue pairing.',
        'danger',
        'danger',
      );
    }

    setIsPairing(true);

    pair(selectedWifiSsid ?? wifiSsid, wifiPw)
      .catch((error) => {
        Toast('Error', JSON.stringify(error.message), 'danger', 'danger', 3000);
        setIsPairing(false);
      })
      .then(async () => {
        turnBulbOff('inactive');
      })
      .finally(() => {
        setIsPairing(false);

        Toast(
          'Success',
          'Successfully connected bulb/s to LightAwake!',
          'success',
          'success',
        );
        navigation.navigate('Home');
      });
  }

  const handleStopPair = () => {
    stopConfig();
    setIsPairing(false);
  };

  if (isPairing) {
    return (
      <PairingLoader
        isPairing={isPairing}
        responsiveWidth={responsiveWidth}
        responsiveHeight={responsiveHeight}
        instructionSlides={instructionSlides}
        handleStopPair={handleStopPair}
      />
    );
  }

  return (
    <PairFormContainer>
      <ScrollView>
        <PairFormChildWrapper>
          {Platform.OS === 'ios' ? (
            <IosWifiInput wifiSsid={wifiSsid} handleSetWifi={handleSetWifi} />
          ) : (
            <AndroidWifiInput
              wifiSsids={wifiSsids}
              wifiSsid={wifiSsid}
              setWifiSsid={setWifiSsid}
              handleSetWifi={handleSetWifi}
              setSelectedWifiSsid={setSelectedWifiSsid}
            />
          )}
        </PairFormChildWrapper>
        <PairFormChildWrapper>
          <InputText
            style={{
              height: responsiveScreenHeight(6),
            }}
            value={wifiPw}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            onChangeText={(wifiPw) => setWifiPw(wifiPw)}
            onSubmitEditing={() =>
              setTimeout(() => {
                handleStartPair();
              }, 800)
            }
          />
        </PairFormChildWrapper>
        <PairFormChildWrapper
          style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10}}>
          <SetButton
            onPress={() =>
              setTimeout(() => {
                handleStartPair();
              }, 800)
            }>
            <ButtonText>PAIR</ButtonText>
          </SetButton>
        </PairFormChildWrapper>
      </ScrollView>
    </PairFormContainer>
  );
};

export default Form;

const PairFormChildWrapper = styled.View`
  border-radius: 5px;
  width: ${responsiveScreenWidth(80)};
`;

const PairFormContainer = styled.View`
  position: relative;
  width: 100%;
  padding: 0 ${scaleWidth(5)}px;
  margin-top: ${scaleHeight(10)}px;
`;
