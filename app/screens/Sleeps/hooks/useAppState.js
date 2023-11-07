import React, {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';

export default function useAppState() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      console.log(nextAppState);
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    appStateVisible,
  };
}
