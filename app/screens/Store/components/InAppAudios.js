/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  Platform,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
} from 'react-native';

import LottieView from 'lottie-react-native';
import CheckBox from '@react-native-community/checkbox';

import {requestPurchase} from 'react-native-iap';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import Carousel from 'react-native-snap-carousel';
import Sound from 'react-native-sound';

import {trackSettings} from '../../../constants/available-settings';

import styled from 'styled-components/native';
import {
  ButtonText,
  SettingContainer,
  SettingHead,
  Row,
} from '../../../styles/commonStyledComponents';
import {scaleWidth} from '../../../styles/scales';
import {theme} from '../../../styles/theme';
import Loader from './Loader';
import {useAlarmAudios} from '../hooks/useAlarmAudios';
import {usePurchaseHandling} from '../../../components/Globals/PurchaseContext';

Sound.setCategory('Playback');
let soundPlayer = new Sound(
  trackSettings[0]?.product_identifier?.slice(3, trackSettings[0]?.length + 3) +
    '.mp3',
);

export default function InAppAudios() {
  const [hasAlarmAudiosPurchased, setHasAlarmAudiosPurchased] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [category, setCategory] = useState('Music');
  const {audios, loader, setLoader} = useAlarmAudios(
    hasAlarmAudiosPurchased,
    category,
  );
  const alarmPreviewTimeout = useRef();
  const [animationLoader, setAnimationLoader] = useState(false);
  const [isPurchasePending, setIsPurchasePending] = useState(false);
  const {audioPurchaseComplete} = usePurchaseHandling();

  useEffect(() => {
    if (audioPurchaseComplete) {
      setHasAlarmAudiosPurchased(!hasAlarmAudiosPurchased);
      setAnimationLoader(false);
    }
  }, [audioPurchaseComplete]);

  function renderCategory(i) {
    const categories = [
      'Music',
      'Poetry',
      'Nature Sounds',
      'Industrial Sounds',
      'Hard of Hearing',
    ];

    return (
      <View style={{marginLeft: 10}}>
        <SectionButton
          style={{
            backgroundColor:
              category === categories[i] ? theme.colors.yellow : null,
          }}
          onPress={() => setCategory(categories[i])}>
          <ButtonText
            style={{
              color:
                category === categories[i] ? theme.colors.lightIndigo : 'white',
            }}>
            {categories[i]}
          </ButtonText>
        </SectionButton>
      </View>
    );
  }

  const handleRequestPurchase = async (item) => {
    console.log('Start');
    console.log(item);
    setAnimationLoader(true);
    if (isPurchasePending) {
      console.log('Purchase request already pending');
      return;
    }
    setIsPurchasePending(true);
    console.log('Purchase request initiated');
    if (Platform.OS === 'ios') {
      console.log('Requesting purchase (iOS)');
      await requestPurchase({sku: item});
    } else {
      console.log('Requesting purchase (Android)');
      await requestPurchase({skus: [item]});
    }
    setIsPurchasePending(false);
  };

  const stopPlayer = () => {
    soundPlayer.release();
    setSoundPlaying(null);
    clearTimeout(alarmPreviewTimeout.current);
  };

  const playSound = (item, soundIndex) => {
    let soundName = /\d/.test(item?.slice(0, 3))
      ? item?.slice(3, item?.length + 3) + '.mp3'
      : item + '.mp3';
    soundName = soundName.toLocaleLowerCase();
    stopPlayer();

    if (soundName) {
      if (soundPlaying === soundIndex) {
        setSoundPlaying(null);
      } else {
        soundPlayer = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          soundPlayer.setNumberOfLoops(-1);
          soundPlayer.play();
          alarmPreviewTimeout.current = setTimeout(stopPlayer, 5000);
        });
        setSoundPlaying(soundIndex);
      }
    } else {
      setSoundPlaying(null);
    }
  };

  const renderedAudios = ({item, index}) => {
    if (item.product_identifier !== 'preset_alarm') {
      return (
        <TouchableWithoutFeedback>
          <SettingContainer
            style={{
              height: responsiveScreenHeight(Platform.OS === 'ios' ? 56 : 55),
            }}
            key={index}>
            <SettingHead
              style={{
                height: responsiveScreenHeight(45),
                flexDirection: 'column',
              }}>
              <Spacer style={{paddingBottom: responsiveScreenHeight(2)}} />
              <BundleImage
                source={require('../../../../assets/musical-note.png')}
              />
              <Spacer style={{paddingBottom: responsiveScreenHeight(3)}} />
              <Row style={{width: '100%'}}>
                <BundleNameTitle style={{width: '78%'}}>
                  {item.title}
                </BundleNameTitle>
                <StyledTouchableOpacity
                  onPress={() => playSound(item.product_identifier, index)}>
                  <Image
                    style={{
                      marginLeft: 'auto',
                    }}
                    source={
                      soundPlaying === index
                        ? require('../../../../assets/pause-icon.png')
                        : require('../../../../assets/play-icon.png')
                    }
                  />
                </StyledTouchableOpacity>
              </Row>
              <Spacer />
              <BundleQuote
                style={{
                  marginRight: 'auto',
                }}>
                {item.description}
              </BundleQuote>
              <Spacer style={{paddingBottom: responsiveScreenHeight(2.5)}} />
              <Row
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  width: responsiveScreenWidth(75),
                }}>
                <BundlePriceTitle>{item.localizedPrice}</BundlePriceTitle>
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
                    {item.is_purchased ? (
                      <CheckBox
                        style={{height: responsiveScreenHeight(4)}}
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
                          handleRequestPurchase(item.product_identifier)
                        }>
                        <ButtonText>Buy</ButtonText>
                      </SetButton>
                    )}
                  </>
                )}
              </Row>
            </SettingHead>
          </SettingContainer>
        </TouchableWithoutFeedback>
      );
    }
  };

  return (
    <>
      <SectionNameContainer>
        <SectionName>Alarm Sounds</SectionName>
      </SectionNameContainer>
      <Spacer style={{paddingBottom: responsiveScreenHeight(1)}} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginLeft: 8}}>
        {renderCategory(0)}
        {renderCategory(1)}
        {renderCategory(2)}
        {renderCategory(3)}
        {renderCategory(4)}
        {renderCategory(5)}
        {renderCategory(6)}
        {renderCategory(7)}
      </ScrollView>
      <Spacer style={{paddingBottom: responsiveScreenHeight(1)}} />
      {loader ? (
        <Loader />
      ) : audios.length > 0 ? (
        <Carousel
          data={audios}
          renderItem={renderedAudios}
          sliderWidth={scaleWidth(380)}
          itemWidth={scaleWidth(350)}
          layout={'stack'}
          layoutCardOffset={18}
          inactiveSlideShift={0}
          inactiveSlideScale={1}
        />
      ) : (
        <SectionNameContainer
          style={{
            alignItems: 'center',
            paddingTop: '50%',
            paddingBottom: '50%',
          }}>
          <EmptyAudiosTitle>{category} coming soon....</EmptyAudiosTitle>
        </SectionNameContainer>
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

const BundleImage = styled.Image`
  width: 60%;
  height: 60%;
`;

const IconImage = styled.Image`
  width: ${responsiveScreenWidth(8)};
  height: ${responsiveScreenHeight(3.4)};
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

const SectionButton = styled(SetButton)`
  width: auto;
  height: ${responsiveScreenHeight(5)};
  align-self: center;
  padding-top: ${responsiveScreenHeight(1)};
  padding-bottom: ${responsiveScreenHeight(1)};
  padding-left: ${responsiveScreenWidth(5)};
  padding-right: ${responsiveScreenWidth(5)};
`;

const EmptyAudiosTitle = styled.Text`
  font-size: ${Math.min(scaleWidth(18), 18)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
`;

const Spacer = styled.View`
  padding-top: ${responsiveScreenHeight(0.5)};
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  width: 20%;
`;
