import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { ProductsStack } from './ProductsStack';
import { FavoritesScreen } from '@/features/favorites/screens/FavoritesScreen';
import { useAppTheme } from '@/theme/ThemeContext';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';
import { Icon } from '@/components/Icon';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function useFavoritesCount(): number {
  return useFavoritesStore(state => Object.keys(state.byId).length);
}

type IconProps = { color: string; focused: boolean };

function ProductsTabIcon({ color, focused }: IconProps): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconText, { color }]}>▤</Text>
      {focused ? (
        <View
          style={[styles.indicator, { backgroundColor: theme.colors.primary }]}
        />
      ) : null}
    </View>
  );
}

function FavoritesTabIcon({ color, focused }: IconProps): React.JSX.Element {
  const theme = useAppTheme();
  const favoritesCount = useFavoritesCount();
  const isFilled = favoritesCount > 0;
  return (
    <View
      accessibilityLabel={
        favoritesCount > 0
          ? `Favorites, ${favoritesCount} ${
              favoritesCount === 1 ? 'item' : 'items'
            }`
          : 'Favorites, empty'
      }
      style={styles.iconWrap}
    >
      <Icon
        name={isFilled ? 'heart' : 'heart-outline'}
        size={22}
        color={color}
      />
      {focused ? (
        <View
          style={[styles.indicator, { backgroundColor: theme.colors.primary }]}
        />
      ) : null}
    </View>
  );
}

export function RootTabs(): React.JSX.Element {
  const theme = useAppTheme();
  const favoritesCount = useFavoritesCount();

  const screenOptions = useMemo<BottomTabNavigationOptions>(
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
        options={{
          tabBarIcon: FavoritesTabIcon,
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.accent,
            color: theme.colors.card,
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    lineHeight: 24,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
