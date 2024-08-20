import { MAPS_API_KEY } from '@env'
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

const { width, height } = Dimensions.get('screen');

export default function App() {
  const mapEl = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização não garantida!')
      }
      let location = await Location.getCurrentPositionAsync({});
      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(() => {
          console.log('Permissão aceita!');
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={origin}
        showsUserLocation={true}
        zoomEnabled={true}
        loadingEnabled={true}
        ref={mapEl}
      >
        { destination &&
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="red"
            mode={'TRANSIT'}
            precision={"high"}
            onReady={result => {
              setDistance(result.distance)
              setDuration(result.duration)
              // console.log(result)  // mostrar o array de coordenadas
              mapEl.current.fitToCoordinates(
                result.coordinates, {
                  edgePadding: {  // para que a rota traçada não fique muito próxima da borda
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                  }
                }
              );
            }}
          />
        }
      </MapView>
    <View style={styles.search}>
      <GooglePlacesAutocomplete
        placeholder='Informe o destino?'
        onPress={(data, details = null) => {
          // console.log(data, details);
          setDestination({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          })
        }}
        query={{
          key: MAPS_API_KEY,
          language: 'pt-br',
        }}
        enablePoweredByContainer={false}
        fetchDetails={true}  // da os resultados da busca em detalhes
        styles={{listView: {height:70}}}
      />
      <View>
        {distance &&
          <Text>Ditância: {distance}km</Text>
        }
        {duration &&
          <Text>Duração: {duration}m</Text>
        }
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  map: {
    height: '60%',
    backgroundColor: 'black'
  },
  search: {
    height: '40%',
    backgroundColor: 'gray'
  }
});
