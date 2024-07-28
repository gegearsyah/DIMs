import {getMarkers} from '@api/Marker';
import {useQuery} from '@tanstack/react-query';
import {GetFloodsParams} from '@types';

const keys = Object.freeze({
  getFloodsMarker: (params: GetFloodsParams) => ['markers-floods', params],
} as const);

export const useFloodsMarkerQuery = (params: GetFloodsParams) =>
  useQuery({
    queryKey: keys.getFloodsMarker(params),
    queryFn: async () => await getMarkers(params),
  });
