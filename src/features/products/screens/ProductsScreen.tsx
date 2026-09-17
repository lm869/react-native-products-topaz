import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { ThemedScreenHeader } from '@/components/ThemedScreenHeader';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { RetryButton } from '@/components/RetryButton';
import { useAppTheme } from '@/theme/ThemeContext';
import { useDebouncedValue } from '@/features/products/hooks/useDebouncedValue';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/products/hooks/useCategories';
import { SearchBar } from '@/features/products/components/SearchBar';
import { CategoryChips } from '@/features/products/components/CategoryChips';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductSkeleton } from '@/features/products/components/ProductSkeleton';
import { ProductGridFooter } from '@/features/products/components/ProductGridFooter';
import type { Product } from '@/domain/product/Product';
import type { ProductsStackScreenProps } from '@/navigation/types';

type Props = ProductsStackScreenProps<'Products'>;

export function ProductsScreen({ navigation }: Props): React.JSX.Element {
  const theme = useAppTheme();

  const [rawQuery, setRawQuery] = useState<string>('');
  const [category, setCategory] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(rawQuery, 350);

  const {
    items,
    isPending,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useProducts({
    search: debouncedQuery,
    category,
  });

  const categories = useCategories();

  const handleCardPress = useCallback(
    (id: number) => {
      navigation.navigate('ProductDetail', { productId: id });
    },
    [navigation],
  );

  const handleQueryChange = useCallback((next: string) => {
    setRawQuery(next);
    const trimmed = next.trim();
    if (trimmed.length > 0) {
      setCategory(null);
    }
  }, []);

  const handleCategorySelect = useCallback((slug: string | null) => {
    setCategory(slug);
    if (slug !== null) {
      setRawQuery('');
    }
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={handleCardPress} />
    ),
    [handleCardPress],
  );

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  const showInitialSkeleton = isPending && items.length === 0;
  const showInlineError = isError && items.length === 0;
  const showEmpty = !isPending && !isError && items.length === 0;

  let content: React.ReactNode = null;
  if (showInitialSkeleton) {
    content = (
      <View style={styles.skeletonWrap}>
        <ProductSkeleton count={6} />
      </View>
    );
  } else if (showInlineError && error) {
    content = <ErrorState error={error} onRetry={handleRetry} />;
  } else if (showEmpty) {
    content = (
      <EmptyState
        icon={debouncedQuery.trim() ? 'magnify' : 'tag-outline'}
        title={
          debouncedQuery.trim()
            ? 'No products match your search'
            : 'Nothing here yet'
        }
        description={
          debouncedQuery.trim()
            ? 'Try a different word or browse another category.'
            : 'Check back soon for new curated items.'
        }
        cta={
          debouncedQuery.trim() || category ? (
            <RetryButton
              label="Clear filters"
              onPress={() => {
                setRawQuery('');
                setCategory(null);
              }}
            />
          ) : undefined
        }
      />
    );
  } else {
    content = (
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        onEndReachedThreshold={0.6}
        onEndReached={handleEndReached}
        ListFooterComponent={isFetchingNextPage ? <ProductGridFooter /> : null}
        contentContainerStyle={styles.listContent}
      />
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ThemedScreenHeader title="Products" />
      <View style={styles.subtitleWrap}>
        <Text
          style={[
            theme.typography.subtitle,
            styles.subtitle,
            { color: theme.colors.subtitle },
          ]}
        >
          Discover curated items from independent makers.
        </Text>
      </View>
      <SearchBar value={rawQuery} onChangeText={handleQueryChange} />
      <View style={styles.searchChipsWrap}>
        <CategoryChips
          categories={categories.items}
          selected={category}
          onSelect={handleCategorySelect}
        />
      </View>
      <View style={styles.body}>{content}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitleWrap: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 12,
  },
  searchChipsWrap: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  subtitle: {},
  body: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 13,
    paddingBottom: 24,
  },
  row: {
    gap: 14,
    marginBottom: 14,
  },
  skeletonWrap: {
    paddingHorizontal: 13,
  },
});
