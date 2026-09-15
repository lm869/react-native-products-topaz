import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsScreen } from '@/features/products/screens/ProductsScreen';
import { ProductDetailScreen } from '@/features/products/screens/ProductDetailScreen';
import type { ProductsStackParamList } from './types';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export function ProductsStack(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detail' }}
      />
    </Stack.Navigator>
  );
}
