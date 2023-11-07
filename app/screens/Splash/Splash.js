import React, {useCallback, useEffect, useState} from 'react';
import {FullscreenNoFlickerImage} from '../../styles/commonStyledComponents';

const SPLASH_CHANGE_INTERVAL = 500;

const splashSources = [
  require('../../../assets/images/splash/asleep.jpg'),
  require('../../../assets/images/splash/awake.jpg'),
];

const Splash = ({navigation}) => {

  const [splashSourceIndex, setSplashSourceIndex] = useState(0);

  const performDelayedAction = (callback, delay) => {
    setTimeout(callback, delay);
  };

  const validateSplashTimeout = useCallback(() => {
    splashSourceIndex === splashSources.length - 1
      ? performDelayedAction(
          () => navigation.replace('Home'),
          SPLASH_CHANGE_INTERVAL,
        )
      : performDelayedAction(() => {
          setSplashSourceIndex((prev) => prev + 1);
        }, SPLASH_CHANGE_INTERVAL);
  }, [splashSourceIndex, navigation]);

  useEffect(() => {
    validateSplashTimeout();
  }, [validateSplashTimeout]);

  return (
    <FullscreenNoFlickerImage
      source={splashSources[splashSourceIndex]}
      resizeMode="cover"
    />
  );
};

export default Splash;
