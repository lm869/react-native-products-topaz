import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';

type Props = { children: React.ReactNode };

export function HydrationGate({ children }: Props): React.JSX.Element {
  const theme = useAppTheme();
  const isHydrated = useFavoritesStore(state => state.isHydrated);
  const hydrate = useFavoritesStore(state => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <View
        style={[styles.root, { backgroundColor: theme.colors.canvas }]}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
