import { MAPS_API_KEY } from '@env'
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, PermissionsAndroid, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MaterialIcons } from '@expo/vector-icons'

export default function Home(props) {
  const mapEl = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [address, setAddress] = useState(null);
  const PRECO_POR_KM = 3  // preço de R$3 por km

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
            strokeColor="black"
            mode={'DRIVING'}
            precision={"high"}
            onReady={result => {
              setDistance(result.distance)
              setPrice(result.distance*PRECO_POR_KM)
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
            setAddress(data.description)
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
          styles={{
            listView: {backgroundColor: '#fff', zIndex: 10},
            container: {position: "absolute", width: '100%'},
          }}
        />
        {distance &&
          <View style={styles.distance}>
            <Text style={styles.distance__text}>Ditância:
              {distance.toFixed(2).replace('.', ',')}km</Text>
            <TouchableOpacity style={styles.price} onPress={() =>
              props.navigation.navigate(
                'Checkout',
                {
                  price: price.toFixed(2),
                  address: address
                }
                )}>
              <View style={styles.price_view}>
                <MaterialIcons name={"payment"} size={24} color="white" />
                <Text style={styles.price__text}>
                  Pagar R${price.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        }
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
  },
  distance: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  distance__text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    backgroundColor: 'black',
    padding: 7,
    borderRadius: 4,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  price__text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 6
  },
  price_view: {
    flexDirection: "row"
  }
});
