import React, { useState, useEffect, useRef } from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

export default function Checkout(props) {
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
