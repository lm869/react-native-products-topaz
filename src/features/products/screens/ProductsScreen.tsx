import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useCategories } from '@/features/products/hooks/useCategories';
import { useAppTheme } from '@/theme/ThemeContext';
import { Icon } from '@/components/Icon';
import { ThemeToggleButton } from '@/features/settings/components/ThemeToggleButton';
import type { ProductCategory } from '@/domain/product/ProductCategory';

export function ProductsScreen(): React.JSX.Element {
  const theme = useAppTheme();
  const { items, isPending, isError, error } = useCategories();

  if (isPending) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.canvas }]}>
        <Icon name="loading" size={32} color={theme.colors.accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.canvas }]}>
        <Icon
          name="alert-circle"
          size={32}
          color={theme.colors.discountBg}
          variant="outline"
        />
        <Text
          style={[
            theme.typography.subtitle,
            styles.errorMsg,
            { color: theme.colors.text },
          ]}
        >
          {error?.message ?? 'Failed to load categories'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.canvas }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerCol}>
          <Text
            style={[theme.typography.eyebrow, { color: theme.colors.eyebrow }]}
          >
            Phase 3 smoke
          </Text>
          <Text
            style={[
              theme.typography.cardTitle,
              styles.headerTitle,
              { color: theme.colors.text },
            ]}
          >
            Manrope SemiBold + MCI
          </Text>
          <Text
            style={[
              theme.typography.subtitle,
              styles.headerSub,
              { color: theme.colors.subtitle },
            ]}
          >
            {items.length} categories
          </Text>
        </View>
        <ThemeToggleButton />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item: ProductCategory) => item.slug}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Icon name="tag" size={20} color={theme.colors.accent} />
            <Text
              style={[
                theme.typography.cardTitle,
                styles.rowTitle,
                { color: theme.colors.text },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                theme.typography.subtitle,
                styles.rowSlug,
                { color: theme.colors.textMuted },
              ]}
            >
              {item.slug}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorMsg: { marginTop: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerCol: { flex: 1 },
  headerTitle: { marginTop: 4 },
  headerSub: { marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  rowTitle: { marginLeft: 12 },
  rowSlug: { marginLeft: 'auto' },
});
