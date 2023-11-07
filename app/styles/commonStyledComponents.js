import {NoFlickerImage} from 'react-native-no-flicker-image';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {scaleHeight, scaleWidth} from './scales';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const Backdrop = styled.View`
  width: 100%;
  height: 100%;
  background-color: #00000080;
`;

export const BackgroundImage = styled.ImageBackground`
  position: absolute;
  width: ${responsiveWidth(100)};
  height: ${responsiveHeight(62)};
  bottom: 0;
`;

export const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  margin: auto;
`;

export const CancelContainer = styled.TouchableOpacity`
  display: flex;
  align-items: center;
`;

export const Clock = styled.Text`
  font-size: ${scaleWidth(70)}px;
  font-family: ${(props) => props.theme.fonts.black};
  color: ${(props) => props.theme.colors.white};
`;

export const Row = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ClockBarContainer = styled(Row)`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

export const CloseButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;

export const ExitModalButton = styled.View`
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

export const InputTitle = styled.Text`
  width: 100%;
  color: ${(props) => props.theme.colors.white};
  font-size: ${scaleWidth(18)}px;
`;

export const InputText = styled.TextInput`
  width: 100%;
  margin: ${scaleHeight(12)}px;
  font-size: 18px;
  background-color: white;
  border-color: white;
  border-width: 1px;
  height: ${scaleHeight(60)}px;
  padding: 10px;
  border-radius: ${scaleWidth(5)}px;
`;

export const IconImage = styled.Image`
  width: ${scaleHeight(135)}px;
  height: ${scaleHeight(135)}px;
`;

export const IconImageHolder = styled.View`
  height: ${Platform.OS === 'ios'
    ? responsiveHeight(23)
    : responsiveHeight(26)};
  width: ${responsiveWidth(49)};
  border-radius: ${responsiveWidth(100)};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.yellow};
`;

export const ModalBody = styled(LinearGradient)`
  elevation: 7;
  shadow-opacity: 0.9;
  shadow-radius: 20px;
  shadow-offset: 0px 2px;
  shadow-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 20px;
  border-radius: 20px;
  z-index: 100;
  max-width: 90%;
`;

export const ModalButtonContainer = styled.View`
  width: ${scaleWidth(125)}px;
  height: ${scaleHeight(40)}px;
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;

export const ModalHeader = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 24px;
  text-align: left;
  margin-right: auto;
`;

export const ModalText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 16px;
  text-align: left;
`;

export const ModalXIcon = styled.Image`
  width: 12px;
  height: 12px;
  align-items: flex-end;
`;

export const SetButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;

export const SettingContainer = styled.View`
  background-color: ${(props) => props.theme.colors.darkIndigo};
  padding: 5% 4.9%;
  border-radius: 5px;
  width: 100%;
`;

export const SettingHead = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${scaleHeight(50)}px;
  justify-content: space-between;
`;

export const SettingTitle = styled.Text`
  font-size: ${Math.min(scaleWidth(18), 18)}px;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.default};
`;

export const SettingIcon = styled.Image`
  margin-right: ${scaleWidth(15)}px;
`;

export const ScreenContainer = styled.SafeAreaView`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${scaleWidth(16)}px;
  background-color: ${(props) => props.theme.colors.lightIndigo};
`;

export const ScreenHead = styled(Row)`
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: ${scaleHeight(35)}px;
  z-index: 99;
`;

export const ScreenContent = styled.View`
  padding-top: 30px;
  display: flex;
  height: 100%;
  align-items: center;
`;

export const ScreenTitle = styled.Text`
  width: 100%;
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.white};
  font-size: ${scaleWidth(24)}px;
  text-align: center;
`;

export const Spacer = styled.View`
  padding-top: ${responsiveHeight(1.5)};
`;

export const StackContainer = styled.ScrollView`
  width: 100%;
  height: 100%;
  padding: 0 ${scaleWidth(16)}px;
  margin-bottom: ${scaleHeight(16)}px;
  z-index: 1;
`;

export const StackChildWrapper = styled.View`
  width: 100%;
  margin-bottom: ${scaleHeight(10)}px;
`;

export const PeriodContainer = styled.View`
  display: flex;
  margin-left: ${scaleWidth(12)}px;
`;

export const PeriodText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.black};
  font-size: ${scaleWidth(20)}px;
  opacity: ${(props) => (props.active ? 1 : 0.3)};
`;

export const IllustratedBackgroundImage = styled.ImageBackground`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.darkestIndigo};
`;

export const FullscreenNoFlickerImage = styled(NoFlickerImage)`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.darkestIndigo};
`;

export const ClockBar = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
