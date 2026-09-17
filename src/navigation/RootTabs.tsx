import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProductsStack } from './ProductsStack';
import { FavoritesScreen } from '@/features/favorites/screens/FavoritesScreen';
import { useAppTheme } from '@/theme/ThemeContext';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function ProductsTabIcon({ color }: { color: string }): React.JSX.Element {
  return <Text style={{ color }}>▤</Text>;
}

function FavoritesTabIcon({ color }: { color: string }): React.JSX.Element {
  return <Text style={{ color }}>♥</Text>;
}

export function RootTabs(): React.JSX.Element {
  const theme = useAppTheme();
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.colors.canvas,
        borderTopColor: theme.colors.cardBorder,
      },
      tabBarActiveTintColor: theme.colors.tabActive,
      tabBarInactiveTintColor: theme.colors.tabInactive,
    }),
    [theme],
  );
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStack}
        options={{ tabBarIcon: ProductsTabIcon }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{ tabBarIcon: FavoritesTabIcon }}
      />
    </Tab.Navigator>
  );
}
