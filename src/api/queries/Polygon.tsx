import {getFloods} from '@api/Polygon';
import {useQuery} from '@tanstack/react-query';
import {GetFloodsParams} from '@types';

const keys = Object.freeze({
  getFloodsPolygon: (params: GetFloodsParams) => ['polygon-floods', params],
} as const);

export const useFloodsPolygonQuery = (params: GetFloodsParams) =>
  useQuery({
    queryKey: keys.getFloodsPolygon(params),
    queryFn: async () => await getFloods(params),
  });
