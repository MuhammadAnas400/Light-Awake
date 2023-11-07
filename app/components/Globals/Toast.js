import {showMessage} from 'react-native-flash-message';
import {theme} from '../../styles/theme';

const titleStyle = {color: theme.colors.white};
const textStyle = {color: theme.colors.white};

export const Toast = (message, description, type, icon, duration = 3000) => {
  return showMessage({
    message,
    description,
    type,
    icon,
    titleStyle,
    textStyle,
    duration,
  });
};
