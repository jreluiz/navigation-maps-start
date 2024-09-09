import { STRIPE_PUBLIC_KEY } from '@env'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Checkout } from './views'
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
          <Stack.Screen name="Checkout" component={Checkout} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}
