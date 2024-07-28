import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: {id: number} | undefined;
  Login: {id: number} | undefined;
  Register: {id: number} | undefined;
};

export type RootStack = StackNavigationProp<RootStackParamList>;
