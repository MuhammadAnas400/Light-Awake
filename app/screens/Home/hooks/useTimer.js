import {useEffect, useState} from 'react';
import {
  getAsyncStorageData,
  storeAsyncStorageData,
} from '../../../constants/utils';
import StorageProperty from '../../../constants/storage-property';

export const useTimer = () => {
  const [timer, setTimer] = useState('');
  const [startTime, setStartTime] = useState('');
  const [hasAnsweredSurvey, setHasAnsweredSurvey] = useState('');

  useEffect(() => {
    async function getStartTime() {
      const promptStartTime = await getAsyncStorageData(
        StorageProperty.PROMPTSTARTTIME,
      );

      if (promptStartTime) {
        setStartTime(+promptStartTime);
      } else {
        const nowDate = '' + new Date().getTime();

        setStartTime(+nowDate);
        storeAsyncStorageData(StorageProperty.PROMPTSTARTTIME, nowDate);
      }
    }

    getStartTime();
  }, []);

  useEffect(() => {
    async function setSurveyAnswered() {
      const result = await getAsyncStorageData(StorageProperty.SURVEYANSWERED);

      setHasAnsweredSurvey(result);
    }

    setSurveyAnswered();
  }, []);

  useEffect(() => {
    setDaysForPromptToShow(startTime);
  }, [startTime]);

  async function setDaysForPromptToShow(startTime) {
    const today = new Date().getDate();
    const startDay = new Date(startTime);
    const twoDaysFromStartDay = new Date(
      startDay.setDate(startDay.getDate() + 2),
    ).getDate();
    const sevenDaysFromStartDay = new Date(
      startDay.setDate(startDay.getDate() + 7),
    ).getDate();
    const fourteenDaysFromStartDay = new Date(
      startDay.setDate(startDay.getDate() + 14),
    ).getDate();

    if (today == sevenDaysFromStartDay) {
      setTimer(fourteenDaysFromStartDay);
    } else if (today == twoDaysFromStartDay) {
      setTimer(sevenDaysFromStartDay);
    } else if (startTime) {
      setTimer(twoDaysFromStartDay);
    }
  }

  return {
    timer,
    hasAnsweredSurvey,
  };
};
