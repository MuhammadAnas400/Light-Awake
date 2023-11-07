import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';

import ColorPicker from 'react-native-wheel-color-picker';
import {send} from '@volst/react-native-tuya';
import {responsiveHeight} from 'react-native-responsive-dimensions';

import {
  ModalBody,
  Backdrop,
  ButtonText,
  CloseButtonContainer,
  ExitModalButton,
  ModalXIcon,
  ScreenTitle,
  Spacer,
} from '../../../styles/commonStyledComponents';
import styled from 'styled-components/native';
import {scaleHeight, scaleWidth} from '../../../styles/scales';
import {theme} from '../../../styles/theme';

import {
  storeAsyncStorageData,
  getAsyncStorageData,
} from '../../../constants/utils';
import StorageProperty from '../../../constants/storage-property';

const PALETTE = [
  '#ffffff',
  '#ed1c24',
  '#d11cd5',
  '#1633e6',
  '#00c85d',
  '#ffde17',
];

const ChangeBulbColorForm = ({colorWheelShow, setColorWheelShow, device}) => {
  const [wheelColor, setWheelColor] = useState('');
  const [pickedColor, setPickedColor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getActiveDeviceColor() {
      const deviceColor = await getAsyncStorageData(
        StorageProperty.ACTIVE_DEVICE_COLOR,
      );

      setWheelColor(deviceColor ?? 'ffffff');
      setLoading(false);
    }

    getActiveDeviceColor();
  }, []);

  async function setActiveDeviceColor(color) {
    await storeAsyncStorageData(
      StorageProperty.ACTIVE_DEVICE_COLOR,
      color,
    ).then(() => {
      setColorWheelShow(false);
    });
  }

  async function setColor(color) {
    var colorPicked = colorConvert(color);

    try {
      await send({
        devId: device.devId,
        command: {
          21: color === '#ffffff' ? 'white' : 'colour',
          24: colorPicked,
        },
      }).catch(() => {
        setColor(color);
      });
    } catch (error) {
      setError(error);
      setStatusModalOpen(true);
    }

    setPickedColor(color);
  }

  const colorConvert = (color) => {
    var colorsys = require('colorsys');
    var hsv = colorsys.hex2Hsv(color);

    var hue = hsv.h.toString(16);
    var sat = (hsv.s * 10).toString(16);
    var val = (hsv.v * 10).toString(16);

    var h = (hue.length === 3 ? '0' : hue.length === 2 ? '00' : '000') + hue;
    var s = (sat.length === 3 ? '0' : sat.length === 2 ? '00' : '000') + sat;
    var v = (val.length === 3 ? '0' : val.length === 2 ? '00' : '000') + val;

    return h + s + v;
  };

  return (
    <Modal visible={colorWheelShow} transparent={true} animationType="fade">
      <Backdrop>
        <ModalBody
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          <CloseButtonContainer onPress={() => setColorWheelShow(false)}>
            <ExitModalButton>
              <ModalXIcon
                source={require('../../../../assets/images/cancel.png')}
              />
            </ExitModalButton>
          </CloseButtonContainer>
          <BulbColorPickerContainer>
            <ColorWheelContainer>
              <ScreenTitle style={{paddingBottom: responsiveHeight(3)}}>
                Set Color and Brightness
              </ScreenTitle>
              {!loading && (
                <ColorPicker
                  color={wheelColor}
                  onColorChangeComplete={(color) => setColor(color)}
                  swatchesLast={false}
                  sliderSize={25}
                  thumbSize={30}
                  discrete={false}
                  palette={PALETTE}
                  row={true}
                />
              )}
            </ColorWheelContainer>
            <Spacer />
            <ButtonContainer>
              <SetChangeButton
                onPress={() => setActiveDeviceColor(pickedColor)}>
                <ButtonText>Confirm</ButtonText>
              </SetChangeButton>
            </ButtonContainer>
          </BulbColorPickerContainer>
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default ChangeBulbColorForm;

const ButtonContainer = styled.View`
  width: 100%;
  margin: auto;
  border-radius: 5px;
`;

const BulbColorPickerContainer = styled.View`
  width: 100%;
  padding: 4.5% 4.9%;
  height: ${responsiveHeight(55)};
  align-items: center;
`;

const ColorWheelContainer = styled.View`
  display: flex;
  height: ${responsiveHeight(45)};
  align-items: center;
`;

const SetChangeButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;
