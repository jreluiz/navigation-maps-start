import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default function Checkout(props) {
  return (
    <View style={styles.container}>
      <Text>O valor da corrida é {props.route.params.price}
      Seu destino é {props.route.params.address}</Text>
    </View>
  )
}
