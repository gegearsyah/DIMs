import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  FillLayer,
  Images,
  MapState,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import {Position} from '@rnmapbox/maps/lib/typescript/src/types/Position';
import {GetFloodsParams, PostCreateMarkerParams, RootStack} from '@types';
import {useFloodsMarkerQuery, useFloodsPolygonQuery} from '@api/queries';
import {debounce, throttle} from 'underscore';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {
  AskLoginBottomSheet,
  CreateFloodBottomSheet,
  FloodInformationBottomSheet,
  FoodDetailBottomSheet,
  MarkerSelectorBottomSheet,
} from './components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuthContext} from '@contexts';
import {calculateCentroid, calculateRadius, getCurrentPosition} from '@utils';
import {useNavigation} from '@react-navigation/native';
import {LoadingService} from '@services';
import {postCreateMarker} from '@api/Marker';
import Geolocation from '@react-native-community/geolocation';
import {MARKER_VALUES} from '@enums/Marker';

const DEFAULT_ZOOM = 14 as const;
const DEFAULT_RADIUS = 3000 as const;
const DEFAULT_BUTTON_THROTTLE = 1000 as const;
const DEFAULT_CENTER = Object.freeze([106.826941, -6.175355] as const);
const DEFAULT_POINT = Object.freeze({
  long: DEFAULT_CENTER[0],
  lat: DEFAULT_CENTER[1],
  radius: DEFAULT_RADIUS,
} as const);

const Home: React.FC<{}> = () => {
  const navigation = useNavigation<RootStack>();
  const insets = useSafeAreaInsets();

  const _map = useRef<MapView>(null);
  const _floods = useRef<ShapeSource>(null);
  const _foods = useRef<ShapeSource>(null);

  const [currentCenter, setCurrentCenter] =
    useState<GetFloodsParams>(DEFAULT_POINT);
  const [floodPolygons, setFloodPolygons] =
    useState<GeoJSON.FeatureCollection>();
  const [floodMarkers, setFloodMarkers] = useState<GeoJSON.FeatureCollection>();

  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const showLogin = () => setIsLoginVisible(true);
  const hideLogin = () => setIsLoginVisible(false);

  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const showSelector = () => setIsSelectorVisible(true);
  const hideSelector = () => setIsSelectorVisible(false);

  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const showSummary = () => setIsSummaryVisible(true);
  const hideSummary = () => setIsSummaryVisible(false);

  const [isFoodDetailVisible, setIsFoodDetailVisible] = useState(false);
  const showFoodDetail = () => setIsFoodDetailVisible(true);
  const hideFoodDetail = () => setIsFoodDetailVisible(false);

  const [isCreateFloodVisible, setIsCreateFloodVisible] = useState(false);
  const showCreateFlood = () => setIsCreateFloodVisible(true);
  const hideCreateFlood = () => setIsCreateFloodVisible(false);

  const [isCreateFoodsVisible, setIsCreateFoodsVisible] = useState(false);
  const showCreateFoods = () => setIsCreateFoodsVisible(true);
  const hideCreateFoods = () => setIsCreateFoodsVisible(false);

  const [isCreateMedicineVisible, setIsCreateMedicineVisible] = useState(false);
  const showCreateMedicine = () => setIsCreateMedicineVisible(true);
  const hideCreateMedicine = () => setIsCreateMedicineVisible(false);

  const [isCreateSafeHouseVisible, setIsCreateSafeHouseVisible] =
    useState(false);
  const showCreateSafeHouse = () => setIsCreateSafeHouseVisible(true);
  const hideCreateSafeHouse = () => setIsCreateSafeHouseVisible(false);

  const {user} = useAuthContext();
  const {
    data: floodPolygonsData,
    isLoading: isLoadingFloodPolygons,
    error: errorFloodPolygons,
  } = useFloodsPolygonQuery(currentCenter);
  const {
    data: floodMarkersData,
    isLoading: isLoadingFloodMarkers,
    error: errorFloodMarkers,
  } = useFloodsMarkerQuery(currentCenter);

  useEffect(() => {
    if (!floodPolygonsData) return;

    setFloodPolygons(floodPolygonsData);
  }, [floodPolygonsData]);

  useEffect(() => {
    if (!floodMarkersData) return;

    setFloodMarkers(floodMarkersData);
  }, [floodMarkersData]);

  const handleMovementEnd = debounce(async (feature: MapState) => {
    const [long, lat] = feature.properties.center ?? DEFAULT_CENTER;
    const radius = calculateRadius(feature.properties.zoom);
    setCurrentCenter({long, lat, radius});
  }, 500);

  const handleFloodMarkerPress = throttle(
    async (pressedShape: OnPressEvent) => {
      let latitude, longitude;
      try {
        const [cluster] = pressedShape.features;

        const collection = await _floods.current?.getClusterLeaves?.(
          cluster,
          999,
          0,
        );

        const centroid = calculateCentroid(collection);
        if (centroid) {
          latitude = centroid.latitude;
          longitude = centroid.longitude;
        }
      } catch {
        if (!pressedShape.features[0].properties?.cluster) {
          const {coordinates} = pressedShape.features[0]
            .geometry as GeoJSON.Point;
          [longitude, latitude] = coordinates;
        }
      }

      console.log({longitude, latitude});

      showSummary();
    },
    2000,
  );

  const handleFoodMarkerPress = throttle(async (pressedShape: OnPressEvent) => {
    let latitude, longitude;

    if (!pressedShape.features[0].properties?.cluster) {
      const {coordinates} = pressedShape.features[0].geometry as GeoJSON.Point;
      [longitude, latitude] = coordinates;
    }

    console.log({longitude, latitude});

    showFoodDetail();
  }, 2000);

  const handleCreateMarkerPress = throttle(() => {
    if (!user) {
      showLogin();
    } else {
      showSelector();
    }
  }, DEFAULT_BUTTON_THROTTLE);

  const handleLogin = throttle(() => {
    navigation.navigate('Login');
    hideLogin();
  }, DEFAULT_BUTTON_THROTTLE);

  const handleRegister = throttle(() => {
    navigation.navigate('Register');
    hideLogin();
  }, DEFAULT_BUTTON_THROTTLE);

  const handleCreateFlood = throttle(() => {
    showCreateFlood();
    hideSelector();
  }, DEFAULT_BUTTON_THROTTLE);

  const handleCreateFoods = throttle(() => {
    showCreateFoods();
    hideSelector();
  }, DEFAULT_BUTTON_THROTTLE);

  const handleCreateMedicine = throttle(() => {
    showCreateMedicine();
    hideSelector();
  }, DEFAULT_BUTTON_THROTTLE);

  const handleCreateSafeHouse = throttle(() => {
    showCreateSafeHouse();
    hideSelector();
  }, DEFAULT_BUTTON_THROTTLE);

  console.log(JSON.stringify({floodMarkers}, null, 2));

  const handleCreateFloodMarker = throttle(
    async (data: PostCreateMarkerParams) => {
      LoadingService.setLoading(true, 'Submitting...');
      try {
        const {
          coords: {latitude: lat, longitude: long},
        } = await getCurrentPosition();

        await postCreateMarker({
          ...data,
          markerType: MARKER_VALUES.FLOOD,
          phone_number: user?.phone_number as string,
          lat,
          long,
        });

        hideCreateFlood();
      } catch (err) {
        const error = err as Error;
        Alert.alert(
          error?.name ?? 'Upload Error',
          error?.message ?? JSON.stringify({...error}, null, 2),
        );
      } finally {
        LoadingService.setLoading(false);
      }
    },
    DEFAULT_BUTTON_THROTTLE,
  );

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <View style={styles.container}>
        <MapView
          ref={_map}
          style={styles.map}
          scaleBarEnabled={false}
          logoEnabled={false}
          rotateEnabled={false}
          onMapIdle={handleMovementEnd}>
          <Camera
            zoomLevel={DEFAULT_ZOOM}
            centerCoordinate={DEFAULT_CENTER as Position}
          />
          {/* <RasterSource
            id="tile"
            tileUrlTemplates={[
              'https://60fe-180-252-61-55.ngrok-free.app/data/flooded_tiles/{z}/{x}/{y}.png',
            ]}>
            <RasterLayer
              id="tile-layer"
              minZoomLevel={10}
              maxZoomLevel={18}
              style={{rasterOpacity: 0.2}}
            />
          </RasterSource> */}
          <ShapeSource id="floods-poly" shape={floodPolygons}>
            <FillLayer
              id="floods-poly-layer"
              sourceID="floods-poly"
              style={styles.floodPolygon}
            />
          </ShapeSource>
          <ShapeSource
            ref={_floods}
            id="floods-point"
            shape={floodMarkers}
            cluster
            clusterRadius={50}
            clusterMaxZoomLevel={15}
            onPress={handleFloodMarkerPress}>
            <Images
              images={{
                'flood-marker': require('@assets/images/flood-marker.png'),
              }}
            />
            <SymbolLayer
              id="floods-point-cluster"
              style={{
                ...styles.floodMarker,
                iconSize: ['step', ['get', 'point_count'], 1.25, 250, 1.5],
              }}
              filter={['has', 'point_count']}
            />
            <SymbolLayer
              id="floods-point-marker"
              style={styles.floodMarker}
              filter={['!', ['has', 'point_count']]}
              // minZoomLevel={16}
            />
          </ShapeSource>
          {/* <ShapeSource
            ref={_foods}
            id="foods-point"
            shape={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [106.82881332234473, -6.161159819707596, 0.0],
                  },
                  properties: {
                    markerType: 'food',
                    attribute: {
                      waterOn: 1,
                      electricOn: 0,
                      isSanitation: 0,
                      imageUrl: 'link',
                      Description: 'ini Banjir',
                    },
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [106.82781332234473, -6.161559819707596, 0.0],
                  },
                  properties: {
                    markerType: 'food',
                    attribute: {
                      waterOn: 1,
                      electricOn: 0,
                      isSanitation: 0,
                      imageUrl: 'link',
                      Description: 'ini Banjir',
                    },
                  },
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [106.82781332234473, -6.161159819707596, 0.0],
                  },
                  properties: {
                    markerType: 'food',
                    attribute: {
                      waterOn: 1,
                      electricOn: 0,
                      isSanitation: 0,
                      imageUrl: 'link',
                      Description: 'ini Banjir',
                    },
                  },
                },
              ],
            }}
            onPress={handleFoodMarkerPress}>
            <Images
              images={{
                'food-marker': require('@assets/images/flood-marker.png'),
              }}
            />
            <SymbolLayer
              id="foods-point-marker"
              style={styles.foodMarker}
              minZoomLevel={12}
            />
          </ShapeSource> */}
        </MapView>

        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{position: 'absolute', right: 16, top: insets.top + 16}}>
          <TouchableOpacity onPress={handleCreateMarkerPress}>
            <Image
              source={require('@assets/icons/create-marker.png')}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <AskLoginBottomSheet
        visible={isLoginVisible}
        onClose={hideLogin}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <MarkerSelectorBottomSheet
        visible={isSelectorVisible}
        onClose={hideSelector}
        onCreateFlood={handleCreateFlood}
        onCreateFoods={handleCreateFoods}
        onCreateMedicine={handleCreateMedicine}
        onCreateSafeHouse={handleCreateSafeHouse}
      />

      <FloodInformationBottomSheet
        visible={isSummaryVisible}
        onClose={hideSummary}
        onUpvote={() => {}}
        onDownvote={() => {}}
        data={{}}
      />

      <FoodDetailBottomSheet
        visible={isFoodDetailVisible}
        onClose={hideFoodDetail}
        onUpvote={() => {}}
        onDownvote={() => {}}
        data={{}}
      />

      <CreateFloodBottomSheet
        visible={isCreateFloodVisible}
        onClose={hideCreateFlood}
        onSubmit={handleCreateFloodMarker}
      />
    </>
  );
};

export default Home;

const styles = {
  ...StyleSheet.create({
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: 'tomato',
    },
    map: {
      flex: 1,
    },
  }),
  floodPolygon: {
    fillColor: '#90daee',
    fillOutlineColor: '#000',
  },
  floodMarker: {
    iconImage: 'flood-marker',
    iconPitchAlignment: 'map',
    iconSize: 1.25,
  },
  foodMarker: {
    iconImage: 'food-marker',
    iconSize: 1.25,
  },
  floodClusterCount: {
    textField: ['get', 'point_count'],
    textSize: 16,
    textPitchAlignment: 'map',
  },
  buttonImage: {width: 100, height: 100},
  buttonTopRight: {position: 'absolute', right: 16},
};
