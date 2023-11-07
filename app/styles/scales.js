import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

// The "base" width and height (it will count the scaled values from these)
const baseWidth = 414;
const baseHeight = 896;

export const scaleWidth = (size) => (width / baseWidth) * size;
export const scaleHeight = (size) => (height / baseHeight) * size;
