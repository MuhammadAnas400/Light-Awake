import {useState, useEffect} from 'react';
import {AppState} from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState);

  function handleAppStateChange(nextAppState) {
    setAppState(nextAppState);
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  return appState;
}
