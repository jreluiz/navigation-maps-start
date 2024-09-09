import { URL_ROOT } from '@env'
import React, { useState, useEffect, useRef } from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

export default function Checkout(props) {

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  async function initializePaymentSheet(){
    const amountInCents = Math.round(
      props.route.params.price * 100
    )
    console.log(amountInCents)
    try{
      const response = await fetch('http://192.168.15.3:3000/payment-intent', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          amount:amountInCents,
        })
      })

      const data = await response.json()

      if (!response.ok){
        throw new Error(data.error || 'Erro ao criar o PaymentIntent')
      }

      console.log(data.clientSecret);

      const { clientSecret } = data;

      if (typeof clientSecret !== 'string'){
        console.error('clientSecret não é uma string: ', clientSecret)
        return false
      }

      if (!clientSecret) {
        console.error('clientSecret não retornada !!!')
        return false;
      }

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Navigation maps start',
        returnURL:'myapp://home',
      })

      if (error){
        console.error('Error initializing payment sheet: ', error);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error in initializePaymentSheet: ', error)
    }
  }

  async function openPaymentSheet(){
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      Alert.alert('Successo', 'Seu pedido/pagamento foi confirmado!')
    }
    // cartStore.clear()
    // navigation.goBack()

  }

  useEffect(() => {
    console.log('URL_ROOT: ', URL_ROOT);
    async function sendServer(){
      console.log('Efetuando requisição...')
      const isInitialized = await initializePaymentSheet();

      if (isInitialized) {
        await openPaymentSheet();
      }
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
