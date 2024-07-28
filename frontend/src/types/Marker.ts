export type PostCreateMarkerParams = {
  lat: number;
  long: number;
  markerType: 'flood' | 'medicine' | 'food' | 'safe_house' | 'emergency';
  phone_number: string;
  waterOn?: number;
  electricOn?: number;
  isSanitation?: number;
  imageUrl?: string;
  Description?: string;
};

export type PostCreateMarkerBody = {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    markerType: 'flood' | 'medicine' | 'food' | 'safe_house' | 'emergency';
    attribute: {
      phone_number: string;
      waterOn?: number;
      electricOn?: number;
      isSanitation?: number;
      imageUrl?: string;
      Description?: string;
    };
  };
};
