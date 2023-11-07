import React, {useState} from 'react';

import {TouchableOpacity} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import InformUserModal from '../../../../../components/Modals/InformUserModal.js';

import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../../../styles/commonStyledComponents.js';

export default function SleepSoundPicker({navigation}) {
  const [informUserModal, setInformUserModal] = useState(false);

  const handlePurchaseClicked = () => {
    setInformUserModal(!informUserModal);
  };

  return (
    <TouchableOpacity onPress={handlePurchaseClicked}>
      <SettingContainer>
        <SettingHead style={{height: responsiveHeight(9)}}>
          <Row style={{width: responsiveWidth(60)}}>
            <SettingIcon
              style={{height: responsiveHeight(3.5), width: responsiveWidth(6)}}
              source={require('../../../../../../assets/sleep.png')}
            />
            <SettingTitle style={{fontSize: responsiveFontSize(2)}}>
              Want sounds while you sleep? Tap here to purchase.
            </SettingTitle>
          </Row>
        </SettingHead>
      </SettingContainer>
      {informUserModal && (
        <InformUserModal
          informUserModal={informUserModal}
          setInformUserModal={setInformUserModal}
          greetings={'Welcome'}
          message={'Sign up to access the Store and other premium access.'}
          isGuestUser={true}
          navigation={navigation}
        />
      )}
    </TouchableOpacity>
  );
}
