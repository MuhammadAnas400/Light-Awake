import {getAsyncStorageData} from '../constants/utils';
import StorageProperty from '../constants/storage-property';

export async function getActiveDevicesApi() {
  return JSON.parse(await getAsyncStorageData(StorageProperty.ACTIVE_DEVICE));
}
