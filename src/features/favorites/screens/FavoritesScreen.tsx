import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { ThemedScreenHeader } from '@/components/ThemedScreenHeader';
import { useAppTheme } from '@/theme/ThemeContext';

export function FavoritesScreen(): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ThemedScreenHeader title="Favorites" />
      <View style={[styles.root, { backgroundColor: theme.colors.canvas }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Favorites
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
});
