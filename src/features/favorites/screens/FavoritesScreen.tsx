import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { ThemedScreenHeader } from '@/components/ThemedScreenHeader';
import { EmptyState } from '@/components/EmptyState';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { FavoriteListItem } from '@/features/favorites/components/FavoriteListItem';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import type { RootTabScreenProps } from '@/navigation/types';

type Props = RootTabScreenProps<'FavoritesTab'>;

export function FavoritesScreen({ navigation }: Props): React.JSX.Element {
  const { items, isHydrated } = useFavorites();

  const handlePressItem = useCallback(
    (id: number) => {
      navigation.navigate('ProductsTab', {
        screen: 'ProductDetail',
        params: { productId: id },
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: FavoriteProduct }) => (
      <FavoriteListItem favorite={item} onPress={handlePressItem} />
    ),
    [handlePressItem],
  );

  const keyExtractor = useCallback(
    (item: FavoriteProduct) => String(item.id),
    [],
  );

  if (isHydrated && items.length === 0) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <ThemedScreenHeader title="Favorites" />
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          description="Tap the heart on any product to save it for later."
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ThemedScreenHeader title="Favorites" />
      <View style={styles.body}>
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
});
