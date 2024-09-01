import { URL_ROOT } from '@env'
import React, { useState, useEffect, useRef } from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

export default function Checkout(props) {

  useEffect(() => {
    async function sendServer(){
      console.log('Efetuando requisição...')
      await fetch(URL_ROOT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price: props.route.params.price,
          address: props.route.params.address,
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      }).then(data => {
        console.log(data)
      }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      })
    }
    sendServer()
  }, []);

  return (
    <View style={styles.container}>
      <Text>O valor da corrida é: {props.route.params.price}</Text>
      <Text>Seu destino é: {props.route.params.address}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
})
