/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Platform, TouchableWithoutFeedback, View} from 'react-native';

import LottieView from 'lottie-react-native';
import CheckBox from '@react-native-community/checkbox';
import {requestPurchase} from 'react-native-iap';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import Carousel from 'react-native-snap-carousel';

import styled from 'styled-components/native';
import {
  ButtonText,
  SettingContainer,
  SettingHead,
  Row,
} from '../../../styles/commonStyledComponents';
import {scaleWidth} from '../../../styles/scales';
import {useAlarms} from '../hooks/useAlarms';
import Loader from './Loader';
import {usePurchaseHandling} from '../../../components/Globals/PurchaseContext';

export default function InAppAlarm() {
  const [hasAlarmPurchased, setHasAlarmPurchased] = useState(false);
  const {alarm, loader, setLoader} = useAlarms(hasAlarmPurchased);
  const [animationLoader, setAnimationLoader] = useState(false);
  const [isPurchasePending, setIsPurchasePending] = useState(false);
  const {alarmPurchaseComplete} = usePurchaseHandling();

  useEffect(() => {
    if (alarmPurchaseComplete) {
      setHasAlarmPurchased(!hasAlarmPurchased);
      setAnimationLoader(false);
    }
  }, [alarmPurchaseComplete]);

  const handleRequestPurchase = async (item) => {
    if (isPurchasePending) {
      console.log('Purchase request already pending');
      return;
    }
    setAnimationLoader(true);
    setIsPurchasePending(true);
    console.log('Purchase request initiated');
    try {
      if (Platform.OS === 'ios') {
        console.log('Requesting purchase (iOS)');
        await requestPurchase({sku: item});
      } else {
        console.log('Requesting purchase (Android)');
        await requestPurchase({skus: [item]});
      }
      setIsPurchasePending(false);
    } catch (error) {
      console.error('Purchase Pending', error);
      setIsPurchasePending(false);
    }
  };

  const renderedAlarm = ({item, index}) => {
    return (
      <TouchableWithoutFeedback>
        <SettingContainer
          style={{
            height: responsiveScreenHeight(Platform.OS === 'ios' ? 51 : 52),
          }}
          key={index}>
          <SettingHead
            style={{
              height: responsiveScreenHeight(45),
              flexDirection: 'column',
            }}>
            <Spacer style={{paddingBottom: responsiveScreenHeight(2)}} />
            <Cover source={require('../../../../assets/clock.png')} />
            <Spacer style={{paddingBottom: responsiveScreenHeight(3)}} />
            <View
              style={{
                marginRight: 'auto',
              }}>
              <BundleNameTitle>{item?.title}</BundleNameTitle>
              <Spacer />
              <BundleQuote>{item?.description}</BundleQuote>
              <Spacer style={{paddingBottom: responsiveScreenHeight(2.5)}} />
              <Row
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  width: responsiveScreenWidth(75),
                }}>
                <BundlePriceTitle>{item?.localizedPrice}</BundlePriceTitle>
                {animationLoader ? (
                  <View>
                    <LottieView
                      source={require('../../../../assets/downloader.json')}
                      style={{
                        width: responsiveScreenWidth(6),
                        height: responsiveScreenHeight(6),
                      }}
                      autoPlay
                      loop
                    />
                  </View>
                ) : (
                  <>
                    {item?.is_purchased ? (
                      <CheckBox
                        value={true}
                        onFillColor={'#f3d449'}
                        onTintColor={'#f3d449'}
                        onCheckColor={'#1d0f57'}
                        tintColors={{true: '#f3d449'}}
                        disabled={true}
                      />
                    ) : (
                      <SetButton
                        onPress={() =>
                          handleRequestPurchase(item?.product_identifier)
                        }>
                        <ButtonText>Buy</ButtonText>
                      </SetButton>
                    )}
                  </>
                )}
              </Row>
            </View>
          </SettingHead>
        </SettingContainer>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <SectionNameContainer>
        <SectionName>Alarm</SectionName>
      </SectionNameContainer>
      <Spacer style={{paddingBottom: responsiveScreenHeight(1)}} />
      {loader ? (
        <Loader />
      ) : (
        <Carousel
          data={[alarm]}
          renderItem={renderedAlarm}
          sliderWidth={scaleWidth(380)}
          itemWidth={scaleWidth(350)}
          layout={'stack'}
          layoutCardOffset={18}
        />
      )}
      <Spacer style={{paddingBottom: responsiveScreenHeight(5)}} />
    </>
  );
}

const BundleNameTitle = styled.Text`
  font-size: ${responsiveScreenFontSize(2.3)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
  font-weight: bold;
  margin-right: ${responsiveScreenWidth(2)}px;
`;

const BundlePriceTitle = styled.Text`
  color: ${(props) => props.theme.colors.yellow};
  font-size: ${responsiveScreenFontSize(3.3)}px;
  font-family: ${(props) => props.theme.fonts.default};
  font-weight: bold;
  margin-left: ${responsiveScreenWidth(2)}px;
`;

const BundleQuote = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: ${responsiveScreenFontSize(1.8)}px;
  font-family: ${(props) => props.theme.fonts.default};
  margin-left: ${responsiveScreenWidth(2)}px;
`;

const Cover = styled.Image`
  width: 65%;
  height: 50%;
  border-radius: ${responsiveScreenWidth(5)};
`;

const SectionNameContainer = styled.View`
  padding-left: ${responsiveScreenWidth(4)};
`;

const SectionName = styled(BundleNameTitle)`
  font-size: ${responsiveScreenFontSize(3)}px;
`;

const SetButton = styled.TouchableOpacity`
  width: ${responsiveScreenWidth(20)};
  height: ${responsiveScreenHeight(5)};
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${responsiveScreenWidth(3)};
`;

const Spacer = styled.View`
  padding-top: ${responsiveScreenHeight(0.5)};
`;
