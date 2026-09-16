import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCategories } from '@/features/products/hooks/useCategories';
import type { ProductCategory } from '@/domain/product/ProductCategory';

export function ProductsScreen(): React.JSX.Element {
  const { items, isPending, isError, error } = useCategories();

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error?.message ?? 'Failed to load categories'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item: ProductCategory) => item.slug}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.slug}>{item.slug}</Text>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: { fontSize: 16, fontWeight: '600' },
  slug: { fontSize: 12, color: '#888', marginTop: 2 },
  error: { fontSize: 14, color: '#c00' },
});
