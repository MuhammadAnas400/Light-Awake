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
  responsiveFontSize,
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
import {useSleepAudios} from '../hooks/useSleepAudios';
import {usePurchaseHandling} from '../../../components/Globals/PurchaseContext';

Sound.setCategory('Playback');
let soundPlayer = new Sound(
  trackSettings[0]?.product_identifier?.slice(3, trackSettings[0]?.length + 3) +
    '.mp3',
);

export default function InAppSleepAudios({}) {
  const [hasSleepAudiosPurchased, setHasSleepAudiosPurchased] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [category, setCategory] = useState('All');
  const alarmPreviewTimeout = useRef();
  const {sleepAudios, loader, setLoader} = useSleepAudios(
    hasSleepAudiosPurchased,
  );
  const [toDisplayAudios, setToDisplayAudios] = useState([]);
  const [animationLoader, setAnimationLoader] = useState(false);
  const [isPurchasePending, setIsPurchasePending] = useState(false);
  const {audioPurchaseComplete} = usePurchaseHandling();

  useEffect(() => {
    setLoader(true);
    displayAudio();
  }, [category, sleepAudios]);

  useEffect(() => {
    if (audioPurchaseComplete) {
      setHasSleepAudiosPurchased(!hasSleepAudiosPurchased);
      setAnimationLoader(false);
    }
  }, [audioPurchaseComplete]);

  function renderCategory(i) {
    const categories = [
      'All',
      'Brown Noise',
      'Pink Noise',
      'White Noise',
      'Short Stories',
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

  function displayAudio() {
    function setToDisplayAllAudio() {
      setTimeout(() => {
        setLoader(false);
      }, 1000);
      return setToDisplayAudios(sleepAudios);
    }

    function setToDisplayBrownNoise() {
      const brownNoiseAudios = sleepAudios.filter(
        (element) => element.audio_type_color === 'brown_noise',
      );

      setTimeout(() => {
        setLoader(false);
      }, 1000);

      return setToDisplayAudios(brownNoiseAudios);
    }

    function setToDisplayPinkNoise() {
      const pinkNoiseAudios = sleepAudios.filter(
        (element) => element.audio_type_color === 'pink_noise',
      );

      setTimeout(() => {
        setLoader(false);
      }, 1000);

      return setToDisplayAudios(pinkNoiseAudios);
    }

    function setToDisplayWhiteNoise() {
      const whiteNoiseAudios = sleepAudios.filter(
        (element) => element.audio_type_color === 'white_noise',
      );

      setTimeout(() => {
        setLoader(false);
      }, 1000);

      return setToDisplayAudios(whiteNoiseAudios);
    }

    function setToDisplayShortStory() {
      const shorStories = sleepAudios.filter(
        (element) => element.audio_type_color === 'short_story',
      );

      setTimeout(() => {
        setLoader(false);
      }, 1000);

      return setToDisplayAudios(shorStories);
    }

    var type = {
      All: setToDisplayAllAudio,
      'Brown Noise': setToDisplayBrownNoise,
      'Pink Noise': setToDisplayPinkNoise,
      'White Noise': setToDisplayWhiteNoise,
      'Short Stories': setToDisplayShortStory,
    };

    return type[category]();
  }

  const handleRequestPurchase = (item) => {
    setAnimationLoader(true);
    if (isPurchasePending) {
      console.log('Purchase request already pending');
      return;
    }
    setIsPurchasePending(true);
    console.log('Purchase request initiated');
    if (Platform.OS === 'ios') {
      console.log('Requesting purchase (iOS)');
      requestPurchase({sku: item});
    } else {
      console.log('Requesting purchase (Android)');
      requestPurchase({skus: [item]});
    }
    setIsPurchasePending(false);
  };

  const stopPlayer = () => {
    soundPlayer.release();
    setSoundPlaying(null);
    clearTimeout(alarmPreviewTimeout.current);
  };

  const playSound = (item, soundIndex) => {
    let soundName;
    if (/\d/.test(item?.slice(0, 3))) {
      soundName =
        item?.slice(3, item?.length + 3) === 'rain_white_noise'
          ? item?.slice(3, item?.length + 3) + '.wav'
          : item?.slice(3, item?.length + 3) + '.mp3';
    } else {
      soundName = item + '.mp3';
    }

    if (soundName === '3hz_delta_white_noise.mp3') {
      soundName = 'threehz_delta_white_noise.mp3';
    } else if (soundName === '2hz_delta_white_noise.mp3') {
      soundName = 'twohz_delta_white_noise.mp3';
    } // workaround for audio names starting with number

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
    return (
      <TouchableWithoutFeedback>
        <SettingContainer
          style={{
            height: responsiveScreenHeight(Platform.OS === 'ios' ? 53 : 55),
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
  };

  return (
    <>
      <SectionNameContainer>
        <SectionName>Sleep Sounds</SectionName>
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
      </ScrollView>
      <Spacer style={{paddingBottom: responsiveScreenHeight(1)}} />
      {loader ? (
        <Loader />
      ) : (
        <Carousel
          data={toDisplayAudios}
          renderItem={renderedAudios}
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
  font-size: ${responsiveFontSize(2.3)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
  font-weight: bold;
  margin-right: ${responsiveScreenWidth(2)}px;
`;

const BundlePriceTitle = styled.Text`
  color: ${(props) => props.theme.colors.yellow};
  font-size: ${responsiveFontSize(3.3)}px;
  font-family: ${(props) => props.theme.fonts.default};
  font-weight: bold;
  margin-left: ${responsiveScreenWidth(2)}px;
`;

const BundleQuote = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: ${responsiveFontSize(1.8)}px;
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
  font-size: ${responsiveFontSize(3)}px;
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

const Spacer = styled.View`
  padding-top: ${responsiveScreenHeight(0.5)};
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  width: 20%;
`;
