import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProductsStack } from './ProductsStack';
import { FavoritesScreen } from '@/features/favorites/screens/FavoritesScreen';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function ProductsTabIcon({ color }: { color: string }): React.JSX.Element {
  return <Text style={{ color }}>▤</Text>;
}

function FavoritesTabIcon({ color }: { color: string }): React.JSX.Element {
  return <Text style={{ color }}>♥</Text>;
}

export function RootTabs(): React.JSX.Element {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStack}
        options={{
          title: 'Products',
          tabBarIcon: ProductsTabIcon,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: FavoritesTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
