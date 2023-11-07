import {useState, useEffect} from 'react';
import {formatTo24hFormat, formatTo12hFormat} from '../constants/utils';

export default function useTime(timeFormat) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setNow(new Date());
    }, 5000);
    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const timeData =
    timeFormat === '12'
      ? formatTo12hFormat(hours, minutes)
      : formatTo24hFormat(hours, minutes);

  return {
    ...timeData,
    nowDateInMiliseconds: now.getTime(),
    nowDate: now,
  };
}
