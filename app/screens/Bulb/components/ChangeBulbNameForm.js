import React, {useState} from 'react';
import {Modal, Platform} from 'react-native';

import {responsiveHeight} from 'react-native-responsive-dimensions';
import {renameDevice} from '@volst/react-native-tuya';
import styled from 'styled-components/native';
import {scaleHeight, scaleWidth} from '../../../styles/scales';
import {theme} from '../../../styles/theme';
import {
  ButtonText,
  InputText,
  InputTitle,
  SetButton,
  ScreenContainer as DefaultScreenContainer,
  Spacer,
  ModalBody,
  Backdrop,
  CloseButtonContainer,
  ExitModalButton,
  ModalXIcon,
} from '../../../styles/commonStyledComponents';
import {Toast} from '../../../components/Globals/Toast';

const ChangeBulbNameForm = ({device, formShow, setFormShow, navigation}) => {
  const [name, setName] = useState(device.name);

  async function setBulbName() {
    if (name == '') {
      return Toast('Error', 'Name must not be empty.', 'danger', 'danger');
    }

    try {
      await renameDevice({
        devId: device.devId,
        name: name,
      }).then(() => {
        setFormShow(false);

        setTimeout(() => {
          navigation.navigate('Bulbs', {status: 'configured'});
        }, 500);
      });
    } catch (error) {
      Toast('Error', error, 'danger', 'danger');
    }
  }

  return (
    <Modal visible={formShow} transparent={true} animationType="fade">
      <Backdrop>
        <ModalBody
          style={{width: `85%`}}
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{x: 0.7, y: 0}}>
          <CloseButtonContainer onPress={() => setFormShow(false)}>
            <ExitModalButton>
              <ModalXIcon
                source={require('../../../../assets/images/cancel.png')}
              />
            </ExitModalButton>
          </CloseButtonContainer>
          <FormContainer
            style={{
              marginTop: Platform.OS === 'ios' ? 0 : responsiveHeight(2),
            }}>
            <InputTitle>Change Bulb Name:</InputTitle>
            <InputText value={name} onChangeText={(name) => setName(name)} />
            <Spacer />
            <SetButton onPress={() => setBulbName()}>
              <ButtonText>Confirm</ButtonText>
            </SetButton>
            <SetCancelButton onPress={() => setFormShow(!formShow)}>
              <ButtonText style={{color: 'white'}}>Cancel</ButtonText>
            </SetCancelButton>
          </FormContainer>
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

export default ChangeBulbNameForm;

const FormContainer = styled.View`
  width: 100%;
  height: ${responsiveHeight(28)};
  align-items: center;
  padding: 4.5% 4.9%;
  border-radius: 5px;
`;

const InputFormContainer = styled.View`
  display: flex;
  height: ${responsiveHeight(45)};
  align-items: center;
`;

const SetCancelButton = styled.TouchableOpacity`
  width: ${scaleWidth(140)}px;
  height: ${scaleHeight(48)}px;
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;
