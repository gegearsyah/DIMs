import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Home, Login, Register} from '@screens';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@contexts';
import {LoadingService} from '@services';
import {ActivityIndicator} from '@components';
import Geolocation from '@react-native-community/geolocation';
import Mapbox from '@rnmapbox/maps';
import Config from '@config';

Mapbox.setTelemetryEnabled(false);
Mapbox.setAccessToken(Config.mapbox.token);
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'auto',
  enableBackgroundLocationUpdates: false,
  locationProvider: 'auto',
});

const Stack = createStackNavigator();
const queryClient = new QueryClient();

const App = (): React.JSX.Element => {
  const [activityIndicator, setActivityIndicator] = useState<{
    isLoading: boolean;
    message?: string;
  }>({isLoading: false, message: ''});

  const setLoading = useCallback((isLoading: boolean, message?: string) => {
    setActivityIndicator({isLoading, message});
  }, []);

  useEffect(() => {
    LoadingService.initialize(setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />

        <GestureHandlerRootView>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>

        <ActivityIndicator
          isLoading={activityIndicator.isLoading}
          message={activityIndicator.message}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
