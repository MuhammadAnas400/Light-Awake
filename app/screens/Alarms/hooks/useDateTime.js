import {useTimeFormatContext} from '../../../contexts/time-format.context';
import {formatTo12hFormat, formatTo24hFormat} from '../../../constants/utils';

const getFormattedDate = (date, timeFormat) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDate =
    timeFormat === '24'
      ? formatTo24hFormat(hours, minutes)
      : formatTo12hFormat(hours, minutes);
  return {...formattedDate, raw: date};
};

export default function useDateTime() {
  const {timeFormat} = useTimeFormatContext();

  function date(data) {
    const {timeToDisplay, period, raw} = getFormattedDate(
      new Date(data),
      timeFormat,
    );

    return {
      timeToDisplay,
      period,
      raw,
    };
  }

  return {
    date,
    getFormattedDate,
  };
}
