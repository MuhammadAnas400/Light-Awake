import React from 'react';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {InputText} from '../../../styles/commonStyledComponents';

export function IosWifiInput({wifiSsid, handleSetWifi}) {
  return (
    <InputText
      style={{
        height: responsiveScreenHeight(6),
      }}
      value={wifiSsid}
      onChangeText={(wifiSsid) => handleSetWifi(wifiSsid)}
    />
  );
}