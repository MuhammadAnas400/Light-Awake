import React from 'react';

import {Platform} from 'react-native';
import {Picker as SelectPicker} from '@react-native-picker/picker';

import styled from 'styled-components/native';
import {
  InputText,
  ScreenContainer as DefaultScreenContainer,
} from '../../../styles/commonStyledComponents';
import {scaleHeight} from '../../../styles/scales';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

export function AndroidWifiInput({
  wifiSsids,
  wifiSsid,
  setWifiSsid,
  setSelectedWifiSsid,
}) {
  const renderedWifiSSIDs = Object.keys(wifiSsids ?? []).map((val) => (
    <SelectPicker.Item label={wifiSsids[val].SSID} value={wifiSsids[val].SSID} />
  ));

  function getWifiInput() {
    function onInput() {
      return (
        <InputText
          style={{
            height: responsiveScreenHeight(6),
          }}
          onChangeText={(selectedWifiSsid) =>
            setSelectedWifiSsid(selectedWifiSsid)
          }
        />
      );
    }

    

    function onPicker() {
      return (
        <PickerContainer style={{width: '100%'}}>
          <PickerChildWrapper>
            <SelectPicker
              style={{height: 55, margin: 'auto'}}
              selectedValue={wifiSsid}
              onValueChange={(itemValue) => setWifiSsid(itemValue)}>
              {renderedWifiSSIDs}
              <SelectPicker.Item label="Input WiFi SSID" value="ssid" />
            </SelectPicker>
          </PickerChildWrapper>
        </PickerContainer>
      );
    }

    return wifiSsid == 'ssid' ? onInput() : onPicker();
  }

  return getWifiInput();
}

const PickerContainer = styled.View`
  margin: ${scaleHeight(12)}px;
  height: ${responsiveScreenHeight(6)};
`;

const PickerChildWrapper = styled.View`
  background-color: #fff;
  border-width: 1px;
  border-radius: 5px;
  width: 100%;
`;
