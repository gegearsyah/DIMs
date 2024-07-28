import FetchService from '@services/FetchService';
import {GetFloodsParams} from '@types';

export const getFloods = async ({lat, long, radius}: GetFloodsParams) => {
  const fetch = FetchService();

  const data = await fetch(`polygons?lat=${lat}&lon=${long}&radius=${radius}`);

  return data;
};
