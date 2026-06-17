import { Dimensions } from 'react-native';

let { width, height } = Dimensions.get('window');

export const DIMENSIONS = {
  WIDTH: width,
  HEIGHT: height,
};
