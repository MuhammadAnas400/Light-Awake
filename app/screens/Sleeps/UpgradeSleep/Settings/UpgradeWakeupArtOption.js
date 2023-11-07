import React, {useEffect, useMemo, useState} from 'react';

import LottieView from 'lottie-react-native';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import CheckBox from '@react-native-community/checkbox';
import Carousel from 'react-native-snap-carousel';

import useTime from '../../../../hooks/useTime';

import {useTimeFormatContext} from '../../../../contexts/time-format.context';

import styled from 'styled-components/native';
import {
  Clock as DefaultClock,
  ClockBarContainer,
  PeriodContainer,
  PeriodText,
  ScreenContainer as DefaultScreenContainer,
  ScreenContainer,
  ScreenHead,
  ScreenTitle,
} from '../../../../styles/commonStyledComponents';
import {scaleHeight, scaleWidth} from '../../../../styles/scales';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import BackButton from '../../../../components/Globals/BackButton';
import {useWakeupArts} from '../../hooks/useWakeupArts';
import {theme} from '../../../../styles/theme';
import updateAlarmDetails from '../../../Alarms/UpgradeAlarm/helper/updateAlarmDetails';
import {useAlarm} from '../../../Alarms/hooks/useAlarm';
import {Platform} from 'react-native';

const UpgradeWakeupArtOption = ({route, navigation}) => {
  const {timeFormat} = useTimeFormatContext();
  const {id} = route.params;
  const [hasUpdated, setHasUpdated] = useState(false);
  const {alarm} = useAlarm(id, hasUpdated, timeFormat);
  const {timeToDisplay, period} = useTime(timeFormat);
  const {wakeupArts} = useWakeupArts();
  const [arts, setArts] = useState([]);
  const [loader, setLoader] = useState(true);

  const DATA = [
    {
      content: 'Adventure is worthwhile in itself.',
      author: 'Amelia Earhart',
      image: require('../../../../../assets/images/wakeup/1.jpg'),
    },
    {
      content:
        'If the ocean can calm itself, so can you. We are both salt water mixed with air.',
      author: 'Nayyirah Wahee',
      image: require('../../../../../assets/images/wakeup/2.jpg'),
    },
    {
      content: 'I cannot teach anybody anything. I can only make them think.',
      author: 'Socrates',
      image: require('../../../../../assets/images/wakeup/3.jpg'),
    },
    {
      content:
        'Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything.',
      author: 'Plato',
      image: require('../../../../../assets/images/wakeup/4.jpg'),
    },
    {
      content:
        'Art enables us to find ourselves and lose ourselves at the same time.',
      author: 'Thomas Merto',
      image: require('../../../../../assets/images/wakeup/5.jpg'),
    },
    {
      content: 'Dance is the hidden language of the soul.',
      author: 'Martha Graham',
      image: require('../../../../../assets/images/wakeup/6.jpg'),
    },
    {
      content: 'One bad move nullifies forty good ones',
      author: 'Horowitz',
      image: require('../../../../../assets/images/wakeup/7.jpg'),
    },
    {
      content:
        'Niobe had six sons and six daughters and boasted of her progenitive superiority to the Titan Leto, who had only two children. As punishment for her pride, Apollo killed all Niobe’s sons and Artemis killed all her daughters. The story of Niobe illustrates the Greek theme that the gods are quick to take vengeance  on human pride and arrogance',
      author: 'Anonymous',
      image: require('../../../../../assets/images/wakeup/8.jpg'),
    },
    {
      content:
        'We are flawed creatures, all of us. Some of us think that means we should fix our flaws. But get rid of my flaws and there would be no one left.',
      author: 'Sarah Vowell',
      image: require('../../../../../assets/images/wakeup/9.jpg'),
    },
    {
      content:
        'The color of springtime is in the flowers; the color of winter is in the imagination.',
      author: 'Terri Guillemets',
      image: require('../../../../../assets/images/wakeup/10.jpg'),
    },
    {
      content:
        'Rome is not like any other city. It’s a big museum, a living room that shall be crossed on one’s toes.',
      author: 'Alberto Sordi',
      image: require('../../../../../assets/images/wakeup/11.jpg'),
    },
    {
      content: 'Home is the nicest word there is.',
      author: 'Laura Ingalls Wilder',
      image: require('../../../../../assets/images/wakeup/12.jpg'),
    },
    {
      content: 'The sea lives in every one of us.',
      author: 'Robert Wyland',
      image: require('../../../../../assets/images/wakeup/13.jpg'),
    },
    {
      content:
        'Being a family means you are a part of something very wonderful. It means you will love and be loved for the rest of your life.',
      author: 'Lisa Weed',
      image: require('../../../../../assets/images/wakeup/14.jpg'),
    },
  ];

  useEffect(() => {
    if (wakeupArts.length == 0) {
      setArts(DATA);
    } else {
      wakeupArts.forEach((element) => {
        const art = {
          content: element.art.content,
          author: element.art.author,
          image: getImage(element.product_identifier),
        };
        DATA.push(art);
        console.log(DATA);
        setArts(DATA);
      });
    }
    setTimeout(() => {
      setLoader(false);
    }, 2500);
  }, [wakeupArts]);

  function getImage(id) {
    const wakeupImage = {
      '01_wakeup_art': require('../../../../../assets/wakeup_arts/01_wakeup_art.png'),
      '02_wakeup_art': require('../../../../../assets/wakeup_arts/02_wakeup_art.png'),
      '03_wakeup_art': require('../../../../../assets/wakeup_arts/03_wakeup_art.png'),
      '04_wakeup_art': require('../../../../../assets/wakeup_arts/04_wakeup_art.png'),
      '05_wakeup_art': require('../../../../../assets/wakeup_arts/05_wakeup_art.png'),
      '06_wakeup_art': require('../../../../../assets/wakeup_arts/06_wakeup_art.png'),
      '07_wakeup_art': require('../../../../../assets/wakeup_arts/07_wakeup_art.png'),
    };

    return wakeupImage[id];
  }

  const handleCheckboxClicked = (art) => {
    updateAlarmDetails(alarm.alarm?.id, 'image', art.image);
    setHasUpdated(!hasUpdated);
  };

  const renderArtOptions = ({item, index}) => {
    return (
      <Container>
        <BundleImage
          style={{
            height: responsiveScreenHeight(Platform.OS === 'ios' ? 70 : 68),
            key: index,
          }}
          source={item.image}
          resizeMode="cover">
          <Container>
            <ClockBarContainer
            // style={{
            //   backgroundColor: theme.colors.quoteContainer,
            //   borderRadius: responsiveScreenWidth(5),
            //   padding: 10,
            // }}
            >
              <Clock>{timeToDisplay}</Clock>
              {period ? (
                <PeriodContainer>
                  <PeriodText active={period === 'AM'}>AM</PeriodText>
                  <PeriodText active={period === 'PM'}>PM</PeriodText>
                </PeriodContainer>
              ) : null}
            </ClockBarContainer>
            <QuoteContainer>
              <QuoteText>"{item.content}"</QuoteText>
              <QuoteAuthor>{item.author}</QuoteAuthor>
            </QuoteContainer>
            <CloseButton>
              <CloseButtonText>Close</CloseButtonText>
            </CloseButton>
          </Container>
        </BundleImage>
        <Spacer style={{paddingBottom: responsiveScreenHeight(1)}} />
        {Platform.OS === 'ios' ? (
          <CheckboxContainer>
            <CheckBox
              value={item.image === alarm?.alarm.image}
              onValueChange={() => handleCheckboxClicked(item)}
              tintColor={'FFFFFF'}
              onCheckColor={'#4025b5'}
              onFillColor={'#f3d449'}
              onTintColor={'#f3d449'}
            />
            <CheckboxText>Set as Wakeup Art</CheckboxText>
          </CheckboxContainer>
        ) : (
          <CheckboxContainer>
            <CheckBox
              value={item.image === alarm?.alarm.image}
              onValueChange={() => handleCheckboxClicked(item)}
              tintColors={{true: '#f3d449', false: '#FFFFFF'}}
            />
            <CheckboxText>Set as Wakeup Art</CheckboxText>
          </CheckboxContainer>
        )}
      </Container>
    );
  };
  return (
    <ScreenContainer>
      <ScreenHead>
        <BackButton onPress={() => navigation.goBack()} />
        <ScreenTitle>
          <SectionName>Wakeup Art Options</SectionName>
        </ScreenTitle>
      </ScreenHead>
      <Spacer style={{paddingBottom: responsiveScreenHeight(2)}} />
      {loader ? (
        <Container>
          <LottieView
            source={require('../../../../../assets/downloader.json')}
            style={{
              width: responsiveScreenWidth(25),
              height: responsiveScreenHeight(20),
            }}
            autoPlay
            loop
          />
        </Container>
      ) : (
        <Carousel
          data={arts}
          renderItem={renderArtOptions}
          sliderWidth={scaleWidth(380)}
          itemWidth={scaleWidth(350)}
          layout={'stack'}
          layoutCardOffset={18}
        />
      )}
      <Spacer style={{paddingBottom: responsiveScreenHeight(5)}} />
    </ScreenContainer>
  );
};

const BundleImage = styled.ImageBackground`
  width: 100%;
  height: 100%;
`;

const CheckboxText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 16px;
  margin-left: ${responsiveScreenHeight(1)};
`;

const CheckboxContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin-top: ${responsiveScreenHeight(2)};
`;

const Container = styled(ScreenContainer)`
  align-items: center;
  justify-content: space-around;
  background-color: undefined;
`;

const Clock = styled(DefaultClock)`
  font-size: ${responsiveScreenFontSize(10)};
  margin: auto;
`;

const QuoteContainer = styled.View`
  width: ${responsiveScreenWidth(75)};
  background-color: ${(props) => props.theme.colors.quoteContainer};
  padding: ${scaleHeight(54)}px ${scaleWidth(19)}px;
  border-radius: ${scaleWidth(34)}px;
`;

const QuoteText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-size: ${responsiveScreenFontSize(2.3)};
  text-align: center;
`;

const QuoteAuthor = styled(QuoteText)`
  margin-top: 3%;
`;

const CloseButton = styled.TouchableOpacity`
  width: ${responsiveScreenWidth(75)};
  height: ${responsiveScreenHeight(8)};
  border-radius: ${scaleWidth(52)}px;
  border: 3px solid ${(props) => props.theme.colors.white};
`;

const CloseButtonText = styled.Text`
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${scaleWidth(30)}px;
  margin: auto;
`;

const BundleNameTitle = styled.Text`
  font-size: ${responsiveScreenFontSize(2.3)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
  font-weight: bold;
  margin-right: ${responsiveScreenWidth(2)}px;
`;

const SectionNameContainer = styled.View`
  padding-left: ${responsiveScreenWidth(4)};
`;

const SectionName = styled(BundleNameTitle)`
  font-size: ${responsiveScreenFontSize(3)}px;
`;

const Spacer = styled.View`
  padding-top: ${responsiveScreenHeight(0.5)};
`;

export default UpgradeWakeupArtOption;
