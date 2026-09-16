import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';

export function FavoritesScreen(): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.canvas }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Favorites
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
});
