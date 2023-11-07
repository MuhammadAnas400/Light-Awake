import {getAsyncStorageData} from '../constants/utils';
import axios from 'axios';
import StorageProperty from '../constants/storage-property';

export const LIGHTAWAKE_BASE_URL = 'http://159.89.94.80';
// export const LIGHTAWAKE_BASE_URL = 'http://192.168.0.180:3001';

export const connectionPath = {
  auth: {
    updatePassword: '/auth/password',
    editPassword: '/auth/password/edit',
    sendEmailInstructions: '/api/v1/users/request_password_reset',
    loginWithEmail: '/auth/sign_in',
    loginWithApple: '/api/v1/user/apple_auth',
    loginWithGoogle: '/api/v1/user/google_auth',
    loginAsGuest: '/api/v1/user/guest_auth',
    logout: '/auth/sign_out',
    signUp: '/auth',
    verifyUser: '/api/v1/users/verifyUser',
    checkGuestUserExists: '/api/v1/users/checkGuestUserExists',
    verifyCode: '/api/v1/users/verifyCode',
  },
  users: {
    getAudios: '/api/v1/users/audios',
    getArts: '/api/v1/users/arts',
    getUser: '/api/v1/users/show',
    updateUser: '/api/v1/users/update',
    deleteUser: '/api/v1/users/destroy',
    submitSurveyAnswers: '/api/v1/users/survey',
    checkGuestUserExists: '/api/v1/users/survey/checkGuestUserExists',
    validateUserSurvey: '/api/v1/users/validate_user_survey',
  },
  alarms: {
    addAlarm: '/api/v1/iaps/alarms/add_alarm',
    getAlarms: '/api/v1/iaps/alarms/alarms',
    showAlarm: '/api/v1/iaps/alarms/show_alarm',
    updateAlarm: '/api/v1/iaps/alarms/update_alarm',
    deleteAlarm: '/api/v1/iaps/alarms/delete_alarm',
    importAlarms: '/api/v1/iaps/alarms/import_iap_alarm',
  },
  audios: {
    getAudios: '/api/v1/iaps/audios/audios',
    getAudio: '/api/v1/iaps/audios/audio',
  },
  arts: {
    getWakeupArts: '/api/v1/iaps/wakeup_experiences/wakeup_experiences',
  },
  iaps: {
    purchaseProduct: '/api/v1/iaps/purchase',
    receiveFreeGift: '/api/v1/iaps/receive_free_gift',
    updateUrl: '/api/v1/iaps/update_url',
  },
};

export const method = {
  post: 'post',
  get: 'get',
  put: 'put',
  delete: 'delete',
};

const apiClient = axios.create({
  baseURL: LIGHTAWAKE_BASE_URL,
});

const AxiosRequestHandler = async (requestConfig) => {
  const token = await getAsyncStorageData(StorageProperty.USER_TOKEN);
  if (token) {
    const {client, uid, 'access-token': accessToken} = JSON.parse(token);
    console.log(client, uid, accessToken);
    apiClient.defaults.headers.common['client'] = client;
    apiClient.defaults.headers.common['uid'] = uid;
    apiClient.defaults.headers.common['access-token'] = accessToken;
  }
  try {
    const response = await apiClient.request(requestConfig);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default AxiosRequestHandler;
