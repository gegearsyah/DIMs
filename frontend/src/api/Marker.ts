import FetchService from '@services/FetchService';
import {
  GetFloodsParams,
  PostCreateMarkerBody,
  PostCreateMarkerParams,
} from '@types';

export const getMarkers = async ({lat, long, radius}: GetFloodsParams) => {
  const fetch = FetchService();

  const data = await fetch(`markers?lat=${lat}&lon=${long}&radius=${radius}`);

  return data;
};

export const postCreateMarker = async (params: PostCreateMarkerParams) => {
  const fetch = FetchService();

  const body: PostCreateMarkerBody = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [params.long, params.lat],
    },
    properties: {
      markerType: params.markerType,
      attribute: {
        electricOn: params.electricOn,
        waterOn: params.waterOn,
        isSanitation: params.isSanitation,
        imageUrl: params.imageUrl,
        phone_number: params.phone_number,
        Description: params.Description,
      },
    },
  };

  const result = await fetch('markers/create', {
    method: 'POST',
    body: body as unknown as BodyInit_,
  });

  return result;
};
