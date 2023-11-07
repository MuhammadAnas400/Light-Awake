import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../../network/AxiosRequestHandler';

export default async function updateAlarmDetails(id, detail, data) {
  try {
    const params = {
      id: id,
      detail: detail,
      data: data,
    };
    const requestConfig = {
      params: params,
      method: method.put,
      url: `${connectionPath.alarms.updateAlarm}`,
    };
    console.log('Alarm Params: ', params)
    const response = await AxiosRequestHandler(requestConfig);

    if (response) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
