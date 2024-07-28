/**
 * @format
 */

import './src/utils/gesture-handler';

import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';

import Mapbox from '@rnmapbox/maps';

Mapbox.setTelemetryEnabled(false);
Mapbox.setAccessToken(
  'pk.eyJ1IjoibGVvbmhhcmt0aCIsImEiOiJjbHozc2F6cmwzcDg1MmlxbHNjdzdtcXIxIn0.oMVSwF1d0tGENq4tYW18fg',
);

LogBox.ignoreLogs(['[Reanimated]']);

AppRegistry.registerComponent(appName, () => App);
