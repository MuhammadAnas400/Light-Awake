import React, {useEffect, useState} from 'react';
import {Platform, TouchableWithoutFeedback, View} from 'react-native';


import LottieView from 'lottie-react-native';
import CheckBox from '@react-native-community/checkbox';
import IAP from 'react-native-iap';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
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
import {useWakeupArts} from '../hooks/useWakeupArt';
import {Toast} from '../../../components/Globals/Toast';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

let purchaseUpdatedListener;

const InAppWakeupExperience = () => {
  const [hasWakeupArtPurchased, setHasWakeupArtPurchased] = useState(false);
  const getWakeupArts = useWakeupArts(hasWakeupArtPurchased),
    {wakeupArts} = getWakeupArts;
  const [loader, setLoader] = useState(false);

  const wakeupArtsImages = [
    {
      image: require('../../../../assets/wakeup_arts/01_wakeup_art.png'),
    },
    {
      image: require('../../../../assets/wakeup_arts/02_wakeup_art.png'),
    },
    {
      image: require('../../../../assets/wakeup_arts/03_wakeup_art.png'),
    },
    {
      image: require('../../../../assets/wakeup_arts/04_wakeup_art.png'),
    },
    {
      image: require('../../../../assets/wakeup_arts/05_wakeup_art.png'),
    },
    {
      image: require('../../../../assets/wakeup_arts/06_wakeup_art.png'),
    },
    {
      image: require('../../../../assets/wakeup_arts/07_wakeup_art.png'),
    },
  ];

  useEffect(() => {
    purchaseUpdatedListener = IAP.purchaseUpdatedListener((purchase) => {
      try {
        setLoader(true);
      } catch (error) {
        setLoader(false);
        Toast('Error', error.message, 'danger', 'danger');
      }
    });
  }, [hasWakeupArtPurchased]);

  const handleRequestPurchase = (item) => {
    setLoader(true);
    IAP.requestPurchase(item)
      .then((result) => {
        purchaseWakeupArt(result);
      })
      .catch((error) => {
        Toast('Error', error.message, 'danger', 'danger');
        setLoader(false);
      });
  };

  async function purchaseWakeupArt(purchase) {
    try {
      const data = {
        receipt: purchase['transactionReceipt'],
        product_identifier: purchase['productId'],
        iap_type: 'WakeupExperience',
      };
      const requestConfig = {
        data: data,
        method: method.post,
        url: connectionPath.iaps.purchaseProduct,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        Toast('Success', 'Purchase Successful', 'success', 'success');
        setLoader(false);
        setHasWakeupArtPurchased(true);
      }
    } catch (error) {
      Toast('Error', error.message, 'danger', 'danger');
    }
  }

  const renderedWakeupExperience = ({item, index}) => {
    return (
      <TouchableWithoutFeedback>
        <SettingContainer
          style={{height: responsiveHeight(Platform.OS === 'ios' ? 58 : 56)}}
          key={index}>
          <BundleImage source={wakeupArtsImages[index].image} />
          <Spacer style={{paddingTop: responsiveHeight(2)}} />
          <SettingHead
            style={{
              height: responsiveHeight(19),
              flexDirection: 'column',
            }}>
            <View
              style={{
                marginRight: 'auto',
              }}>
              <BundleNameTitle>{item['author']}</BundleNameTitle>
              <Spacer />
              <BundleQuote>"{item['content']}"</BundleQuote>
            </View>
            <Row
              style={{
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                width: responsiveWidth(75),
              }}>
              <BundlePriceTitle>{item['localizedPrice']}</BundlePriceTitle>
              {item['is_purchased'] ? (
                <CheckBox
                  value={true}
                  onFillColor={'#f3d449'}
                  onTintColor={'#f3d449'}
                  onCheckColor={'#1d0f57'}
                  tintColors={{true: '#f3d449'}}
                  disabled={true}
                />
              ) : loader ? (
                <View>
                  <LottieView
                    source={require('../../../../assets/downloader.json')}
                    style={{
                      width: responsiveWidth(6),
                      height: responsiveHeight(6),
                    }}
                    autoPlay
                    loop
                  />
                </View>
              ) : (
                <SetButton
                  onPress={() =>
                    handleRequestPurchase(item['product_identifier'])
                  }>
                  <ButtonText>Buy</ButtonText>
                </SetButton>
              )}
            </Row>
          </SettingHead>
        </SettingContainer>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <SectionNameContainer>
        <SectionName>Wakeup Art</SectionName>
      </SectionNameContainer>
      <Spacer style={{paddingBottom: responsiveHeight(1)}} />
      <Carousel
        data={wakeupArts}
        renderItem={renderedWakeupExperience}
        sliderWidth={scaleWidth(380)}
        itemWidth={scaleWidth(350)}
        layout={'stack'}
        layoutCardOffset={18}
      />
      <Spacer style={{paddingBottom: responsiveHeight(5)}} />
    </>
  );
};

const BundleNameTitle = styled.Text`
  font-size: ${responsiveFontSize(2.3)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
  font-weight: bold;
  margin-right: ${responsiveWidth(2)}px;
`;

const BundlePriceTitle = styled.Text`
  color: ${(props) => props.theme.colors.yellow};
  font-size: ${responsiveFontSize(3.3)}px;
  font-family: ${(props) => props.theme.fonts.default};
  font-weight: bold;
  margin-left: ${responsiveWidth(2)}px;
`;

const BundleQuote = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: ${responsiveFontSize(1.8)}px;
  font-family: ${(props) => props.theme.fonts.default};
  margin-left: ${responsiveWidth(2)}px;
`;

const BundleImage = styled.Image`
  width: 100%;
  height: 60%;
`;

const SectionNameContainer = styled.View`
  padding-left: ${responsiveWidth(4)};
`;

const SectionName = styled(BundleNameTitle)`
  font-size: ${responsiveFontSize(3)}px;
`;

const SetButton = styled.TouchableOpacity`
  width: ${responsiveWidth(20)};
  height: ${responsiveHeight(5)};
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${responsiveWidth(3)};
`;

// const LottieView = styled(LottieView)`
//   border-radius: ${responsiveWidth(10)};
//   width: ${responsiveWidth(11)};
// `;

const Spacer = styled.View`
  padding-top: ${responsiveHeight(0.5)};
`;

export default InAppWakeupExperience;
