import {BadRequestError} from '@errors';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

export const getCurrentPosition = (
  options: {
    timeout?: number;
    maximumAge?: number;
    enableHighAccuracy?: boolean;
  } = {},
) => {
  return new Promise<GeolocationResponse>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      resolve,
      err => {
        const error = new BadRequestError(err.message, {cause: err});
        error.name = 'GeolocationError';
        reject(error);
      },
      options,
    );
  });
};
