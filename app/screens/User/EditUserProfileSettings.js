import React, {useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
} from 'react-native';

import AnimatedLoader from 'react-native-animated-loader';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import BackButton from '../../components/Globals/BackButton';

import styled from 'styled-components/native';
import {scaleWidth, scaleHeight} from '../../styles/scales';
import {
  SettingTitle,
  ScreenContainer as DefaultScreenContainer,
  ScreenContent,
  ScreenHead,
  ScreenTitle,
  Spacer,
  StackContainer,
  StackChildWrapper,
} from '../../styles/commonStyledComponents';
import {theme} from '../../styles/theme';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../network/AxiosRequestHandler';
import {Toast} from '../../components/Globals/Toast';
import RNUxcam from 'react-native-ux-cam';

export default function EditUserProfileSettings({navigation, route}) {

  RNUxcam.tagScreenName('Edit User Screen');

  const [hasUpdated, setHasUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [warningModal, setWarningModal] = useState(false);
  const [user, setUser] = useState([]);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  useEffect(() => {
    async function fetchUser() {
      try {
        const params = {};
        const requestConfig = {
          params: params,
          method: method.get,
          url: `${connectionPath.users.getUser}`,
        };

        var response = await AxiosRequestHandler(requestConfig);

        if (response) {
          var {user} = response.data;
          setUser(user);
          setLoading(false);
        }
      } catch (error) {
        return error;
      }
    }

    fetchUser();
  }, [hasUpdated]);

  const handleSaveProfileSettings = () => {
    if (firstName == '') {
      return Toast(
        'Error',
        'First name should not be empty.',
        'danger',
        'danger',
      );
    }

    if (lastName == '') {
      return Toast(
        'Error',
        'Last name should not be empty.',
        'danger',
        'danger',
      );
    }

    if (validateName(firstName)) {
      return Toast(
        'Error',
        'Please remove unnecessary characters on First name.',
        'danger',
        'danger',
      );
    }

    if (validateName(lastName)) {
      return Toast(
        'Error',
        'Please remove unnecessary characters on Last name.',
        'danger',
        'danger',
      );
    }

    editUserProfile();
  };

  async function editUserProfile() {
    try {
      const params = {
        first_name: firstName ?? user.first_name,
        last_name: lastName ?? user.last_name,
      };
      const requestConfig = {
        params: params,
        method: method.put,
        url: `${connectionPath.users.updateUser}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        Toast('Success', 'Details updated!', 'success', 'success');
        setTimeout(() => {
          setHasUpdated(!hasUpdated);
        }, 1000);
        navigation.navigate('UserProfileSettings', {
          status: 'hasUpdated',
        });
      }
    } catch (error) {
      Toast('Error', 'An error occurred. Try again.', 'danger', 'danger');
    }
  }

  async function deleteUser() {
    setWarningModal(false);

    try {
      const params = {};
      const requestConfig = {
        params: params,
        method: method.delete,
        url: `${connectionPath.users.deleteUser}`,
      };

      await AxiosRequestHandler(requestConfig);
    } catch (error) {
      // workaround for error message when deleting user
      Toast('Success', 'User removed!', 'success', 'success');
      setTimeout(() => {
        navigation.navigate('Home');
      }, 1000);
    }
  }

  const handleCloseModal = () => {
    setWarningModal(false);
  };

  const validateName = (name) => {
    var re = /[^a-zA-Z\s]/gi;
    return re.test(name);
  };

  function renderDisplay() {
    function isLoading() {
      return (
        <View style={{marginTop: 'auto', marginBottom: 'auto'}}>
          <AnimatedLoader
            visible={true}
            source={require('../../../assets/fetch.json')}
            animationStyle={{
              width: responsiveScreenWidth(20),
              height: responsiveScreenHeight(35),
            }}>
            <SettingTitle style={{fontSize: responsiveScreenFontSize(3)}}>
              Loading...
            </SettingTitle>
          </AnimatedLoader>
        </View>
      );
    }

    function isIdle() {
      return (
        <>
          <ScreenHead>
            <BackButton
              onPress={() =>
                navigation.navigate('UserProfileSettings', {
                  status: 'hasUpdated',
                })
              }
            />
            <ScreenTitle>Edit Profile</ScreenTitle>
          </ScreenHead>
          <Spacer />
          <ScreenContent style={{width: responsiveScreenWidth(90)}}>
            <View>
              <IconImage source={require('../../../assets/user-profile.png')} />
            </View>
            <Spacer />
            <ScreenTitleContainer>
              <NameContainer>
                {(user.first_name ?? '') + ' ' + (user.last_name ?? '')}
              </NameContainer>
            </ScreenTitleContainer>
            <Spacer style={{marginBottom: responsiveScreenHeight(3)}} />
            <StackContainer>
              <StackChildWrapper>
                <ScreenSubTitle>Email Address</ScreenSubTitle>
                <InputText
                  style={{
                    fontFamily: theme.fonts.bold,
                    color: theme.colors.yellow,
                  }}
                  value={user.email}
                  editable={false}
                />
              </StackChildWrapper>
              <Spacer />
              <StackChildWrapper>
                <ScreenSubTitle>First Name</ScreenSubTitle>
                <InputTextContainer>
                  <InputText
                    value={firstName ?? user.first_name}
                    onChangeText={(firstName) => setFirstName(firstName)}
                    placeholderTextColor={'white'}
                  />
                </InputTextContainer>
              </StackChildWrapper>
              <Spacer />
              <StackChildWrapper>
                <ScreenSubTitle>Last Name</ScreenSubTitle>
                <InputTextContainer>
                  <InputText
                    value={lastName ?? user.last_name}
                    onChangeText={(lastName) => setLastName(lastName)}
                    placeholderTextColor={'white'}
                  />
                </InputTextContainer>
              </StackChildWrapper>
              <Spacer style={{marginTop: responsiveScreenHeight(2)}} />
              <StackChildWrapper>
                <SendButtonContainer onPress={handleSaveProfileSettings}>
                  <ButtonText>Save</ButtonText>
                </SendButtonContainer>
              </StackChildWrapper>
              <Spacer />
              <ScreenContainer>
                <TouchableOpacity onPress={() => setWarningModal(true)}>
                  <DeleteUserButton>Delete User</DeleteUserButton>
                </TouchableOpacity>
              </ScreenContainer>
            </StackContainer>
          </ScreenContent>
          {warningModal && (
            <Modal
              visible={warningModal}
              transparent={true}
              animationType="fade">
              <Backdrop>
                <ModalBody
                  colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
                  start={{x: 0.7, y: 0}}>
                  <CancelContainer onPress={() => handleCloseModal()}>
                    <ExitModalButton>
                      <ModalXIcon
                        source={require('../../../assets/images/cancel.png')}
                      />
                    </ExitModalButton>
                  </CancelContainer>
                  <BulbColorPickerContainer>
                    <LottieView
                      source={require('../../../assets/warning.json')}
                      style={{
                        width: responsiveScreenWidth(15),
                        height: responsiveScreenHeight(15),
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                      autoPlay
                      loop
                    />

                    <IconHolder>
                      <ScreenTitle
                        style={{
                          textAlign: 'center',
                          fontSize: responsiveScreenFontSize(4),
                          fontFamily: theme.fonts.bold,
                          color: '#f2453d',
                        }}>
                        Warning!
                      </ScreenTitle>
                    </IconHolder>
                    <ScreenTitle
                      style={{
                        textAlign: 'center',
                        fontFamily: theme.fonts.default,
                        fontSize: responsiveScreenFontSize(2.2),
                      }}>
                      Deleting your account will remove all of your information
                      from our database. This cannot be undone.
                    </ScreenTitle>
                    <ButtonContainer>
                      <SetChangeButton onPress={() => deleteUser()}>
                        <ButtonText>Continue?</ButtonText>
                      </SetChangeButton>
                    </ButtonContainer>
                  </BulbColorPickerContainer>
                </ModalBody>
              </Backdrop>
            </Modal>
          )}
        </>
      );
    }

    var status = {
      true: isLoading,
      false: isIdle,
    };

    return status[loading]();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: '#24146C'}}>
      <ScreenContainer>{renderDisplay()}</ScreenContainer>
    </KeyboardAvoidingView>
  );
}

// const Spacer = styled.View``;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  margin: auto;
`;

const IconImage = styled.Image`
  width: ${responsiveScreenWidth(32.5)};
  height: ${responsiveScreenHeight(15)};
  margin-right: ${responsiveScreenHeight(2)};
`;

const InputText = styled.TextInput`
  margin: auto;
  font-size: 18px;
  font-family: ${theme.fonts.bold}
  color: white;
  border-width: 0;
  height: ${responsiveScreenHeight(5)};
  width: 100%
  `;

const InputTextContainer = styled.View`
  border-color: ${theme.colors.yellow};
  border-style: solid;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-width: 2px;
`;

const SendButtonContainer = styled.TouchableOpacity`
  width: 95%;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(5)}px;
  margin: auto;
`;

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const DeleteUserButton = styled.Text`
  font-size: ${responsiveScreenFontSize(2.5)};
  font-family: ${(props) => props.theme.fonts.bold};
  color: #f2453d;
  margin: auto;
`;

const NameContainer = styled(ScreenTitle)`
  width: 100%;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${responsiveScreenFontSize(3.8)}px;
  text-align: center;
`;

const ScreenSubTitle = styled(ScreenTitle)`
  font-size: ${responsiveScreenFontSize(2)};
  font-family: ${(props) => props.theme.fonts.default};
  text-align: left;
  color: ${(props) => props.theme.colors.gray};
`;

const ScreenTitleContainer = styled(StackChildWrapper)``;

const ButtonContainer = styled.View`
  width: 100%;
  border-radius: 5px;
  padding-top: ${responsiveScreenHeight(2)};
`;

const BulbColorPickerContainer = styled.View`
  width: 100%;
  padding: 4.5% 4.9%;
  height: ${responsiveScreenHeight(65)};
  align-items: center;
`;

const Backdrop = styled.View`
  width: 100%;
  height: 100%;
  background-color: #00000080;
`;

const CancelContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;

const ExitModalButton = styled.View`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
  background-color: ${(props) => props.theme.colors.white};
`;

const IconHolder = styled.View`
  border-radius: ${responsiveScreenWidth(10)};
  padding-bottom: ${responsiveScreenHeight(2)}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBody = styled(LinearGradient)`
  elevation: 7;
  shadow-opacity: 0.9;
  shadow-radius: 20px;
  shadow-offset: 0px 2px;
  shadow-color: #000;
  display: flex;
  align-items: center;
  margin: auto;
  padding: 20px;
  border-radius: 20px;
  z-index: 100;
  max-width: 90%;
  height: ${responsiveScreenHeight(55)};
  width: 85%;
`;

const ModalXIcon = styled.Image`
  width: 12px;
  height: 12px;
  align-items: flex-end;
`;

const SetChangeButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;
