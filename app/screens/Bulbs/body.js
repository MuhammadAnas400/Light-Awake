import React, {useState, useEffect} from 'react';

import AnimatedLoader from 'react-native-animated-loader';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import AdPopupModal from './modals/AdPopupModal';
import AddBulbButton from './components/addBulbButton';
import BulbsList from './components/bulbsList';

import StorageProperty from '../../constants/storage-property';
import {getAsyncStorageData} from '../../constants/utils';
import styled from 'styled-components/native';
import {
  BackgroundImage,
  ScreenContent,
  ScreenContainer as DefaultScreenContainer,
  ScreenTitle,
  SettingTitle,
  Spacer,
  StackContainer,
  StackChildWrapper,
} from '../../styles/commonStyledComponents';

import {useDevices} from './hooks/useDevices';
import useActivator from './hooks/useActivator';
import {useActiveBulbs} from '../../hooks/useActiveBulbs';
import {View} from 'react-native';
import RNUxcam from 'react-native-ux-cam';

export function Body({navigation, route}) {

  RNUxcam.tagScreenName('Bulb List Screen');

  const [adPopUpModalOpen, setAdPopUpModalOpen] = useState(false);
  const [isAdPopUpModalDisabled, setIsAdPopUpModalDisabled] = useState(true);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [toActivateDevice, setToActivateDevice] = useState(false);
  const {devices, loading} = useDevices(isRefresh, setIsRefresh, route);
  const [activeBulbs, {getActivatedDevices}] = useActiveBulbs();
  const [{activateDevice, deactivateDevice}] = useActivator();

  useEffect(() => {
    getActivatedDevices();
  }, [toActivateDevice]);

  useEffect(() => {
    async function checkUserAdPopUpModalPreference() {
      const disableAdModal = await getAsyncStorageData(
        StorageProperty.AD_MODAL_DISABLED,
      );
      setIsAdPopUpModalDisabled(disableAdModal === 'true');
    }

    checkUserAdPopUpModalPreference();
    setAdPopUpModalOpen(true);
    getActivatedDevices();
  }, []);

  function check(device) {
    if (activeBulbs == null) {
      return false;
    }

    var found = activeBulbs.find((bulb) => bulb.devId === device.devId);
    return found ? true : false;
  }

  const handlePairingPress = () => {
    navigation.navigate('Pair');
  };

  const handleRefreshPress = () => {
    setIsRefresh(true);
  };

  const handleCheckboxPress = (device) => {
    if (check(device)) {
      deactivateDevice(device);
      setToActivateDevice(false);
    } else {
      activateDevice(device);
      setToActivateDevice(true);
    }
  };

  const handleSettingsIconPress = (device) => {
    navigation.navigate('Bulb', {device: device, status: 'configure'});
  };

  if (loading) {
    return (
      <ScreenContent style={{paddingTop: 0}}>
        <BackgroundImage style={{height: '100%'}}>
          <View style={{marginTop: 'auto', marginBottom: 'auto'}}>
            <AnimatedLoader
              visible={true}
              source={require('../../../assets/fetch.json')}
              animationStyle={{
                width: responsiveWidth(20),
                height: responsiveHeight(35),
              }}>
              <SettingTitle style={{fontSize: responsiveFontSize(3)}}>
                Fetching devices...
              </SettingTitle>
            </AnimatedLoader>
          </View>
        </BackgroundImage>
      </ScreenContent>
    );
  }

  return (
    <ScreenContent style={{paddingTop: 0}}>
      <BackgroundImage style={{height: '100%'}}>
        {!isAdPopUpModalDisabled && adPopUpModalOpen && (
          <AdPopupModal
            adPopUpModalOpen={adPopUpModalOpen}
            setAdPopUpModalOpen={setAdPopUpModalOpen}
            isAdPopUpModalDisabled={isAdPopUpModalDisabled}
            setIsAdPopUpModalDisabled={setIsAdPopUpModalDisabled}
            isCheckboxSelected={isCheckboxSelected}
            setIsCheckboxSelected={setIsCheckboxSelected}
          />
        )}
        <Stack>
          <BulbsList
            devices={devices}
            check={check}
            handleCheckboxPress={handleCheckboxPress}
            handleSettingsIconPress={handleSettingsIconPress}
          />
          <Spacer />
          <AddBulbButton handlePairingPress={handlePairingPress} />
          <RefreshButton onPress={handleRefreshPress}>Refresh</RefreshButton>
        </Stack>
      </BackgroundImage>
    </ScreenContent>
  );
}

const Stack = ({children}) => {
  return (
    <StackContainer>
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

const RefreshButton = styled(ScreenTitle)`
  font-size: ${responsiveFontSize(2)};
  color: ${(props) => props.theme.colors.yellow};
`;
