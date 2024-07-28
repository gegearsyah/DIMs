import {getCenter} from 'geolib';

export * from './transform';
export * from './geolocation';

const DEFAULT_ZOOM = 14 as const;
const DEFAULT_RADIUS = 3000 as const;

export function calculateRadius(zoomLevel: number = DEFAULT_ZOOM) {
  // Factor to control the rate of change
  const factor = 0.6;

  // Calculate the radius using an exponential function
  const radius = DEFAULT_RADIUS * Math.pow(factor, zoomLevel - DEFAULT_ZOOM);

  return Math.min(radius, 50000);
}

export function calculateCentroid(
  collection: GeoJSON.FeatureCollection<GeoJSON.Point>,
) {
  const coordinates = collection.features.flatMap(({geometry}) => {
    const [longitude, latitude] = geometry.coordinates;
    return {longitude, latitude};
  });

  const centroid = getCenter(coordinates);
  return centroid;
}
