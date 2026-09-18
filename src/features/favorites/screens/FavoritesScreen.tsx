import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { ThemedScreenHeader } from '@/components/ThemedScreenHeader';
import { SyncedPill } from '@/components/SyncedPill';
import { SwipeHint } from '@/components/SwipeHint';
import { SwipeableFavoriteRow } from '@/components/SwipeableFavoriteRow';
import { Icon } from '@/components/Icon';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useFavoritesStore } from '@/features/favorites/store/favoritesStore';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useConfirm } from '@/hooks/useConfirm';
import { FavoriteListItem } from '@/features/favorites/components/FavoriteListItem';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import { useAppTheme } from '@/theme/ThemeContext';
import type { RootTabScreenProps } from '@/navigation/types';

type Props = RootTabScreenProps<'FavoritesTab'>;

export function FavoritesScreen({ navigation }: Props): React.JSX.Element {
  const theme = useAppTheme();
  const { items, isHydrated } = useFavorites();
  const remove = useFavoritesStore(state => state.remove);
  const restore = useFavoritesStore(state => state.restore);
  const showSnackbar = useSnackbar();
  const confirm = useConfirm();
  const cancelSwipesRef = useRef<Map<number, () => void>>(new Map());
  const [hintDismissed, setHintDismissed] = useState(false);

  const registerCancel = useCallback(
    (id: number) => (reset: () => void) => {
      cancelSwipesRef.current.set(id, reset);
    },
    [],
  );

  const handlePressItem = useCallback(
    (id: number) => {
      navigation.navigate('ProductsTab', {
        screen: 'ProductDetail',
        params: { productId: id },
      });
    },
    [navigation],
  );

  const handleDelete = useCallback(
    (entry: FavoriteProduct) => {
      remove(entry.id);
      cancelSwipesRef.current.delete(entry.id);
      showSnackbar(`Removed ${entry.title}`, {
        action: {
          label: 'Undo',
          onPress: () => {
            restore(entry);
          },
        },
      });
    },
    [remove, restore, showSnackbar],
  );

  const requestDelete = useCallback(
    (entry: FavoriteProduct) => {
      // eslint-disable-next-line no-void
      void confirm({
        title: 'Remove favorite?',
        message: entry.title,
        confirmLabel: 'Delete',
      }).then(ok => {
        if (ok) {
          handleDelete(entry);
        } else {
          cancelSwipesRef.current.get(entry.id)?.();
        }
      });
    },
    [confirm, handleDelete],
  );

  const renderItem = useCallback(
    ({ item }: { item: FavoriteProduct }) => (
      <SwipeableFavoriteRow
        onDelete={() => requestDelete(item)}
        accessibilityLabel={`Delete ${item.title}`}
        onMount={registerCancel(item.id)}
      >
        <FavoriteListItem favorite={item} onPress={handlePressItem} />
      </SwipeableFavoriteRow>
    ),
    [requestDelete, handlePressItem, registerCancel],
  );

  const keyExtractor = useCallback(
    (item: FavoriteProduct) => String(item.id),
    [],
  );

  const dismissHint = useCallback(() => setHintDismissed(true), []);

  if (isHydrated && items.length === 0) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <ThemedScreenHeader title="Favorites" />
        <View style={styles.emptyBody}>
          <View
            style={[
              styles.emptyIconWrap,
              { backgroundColor: theme.colors.placeholderBg },
            ]}
          >
            <Icon
              name="heart-outline"
              size={40}
              color={theme.colors.textMuted}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            Your atelier is empty
          </Text>
          <Text style={[styles.emptyBody_, { color: theme.colors.subtitle }]}>
            Items you favorite in the catalog will sync and appear here
            automatically.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ThemedScreenHeader title="Favorites" />
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerStack}>
            <View style={styles.syncedSlot}>
              <SyncedPill />
            </View>
            <Text
              style={[
                theme.typography.displayLg,
                styles.hero,
                { color: theme.colors.text },
              ]}
            >
              Your Saved Pieces
            </Text>
            <Text style={[styles.counter, { color: theme.colors.subtitle }]}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
            {!hintDismissed ? (
              <View style={styles.hintSlot}>
                <SwipeHint onDismiss={dismissHint} />
              </View>
            ) : null}
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody_: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerStack: {
    marginBottom: 8,
  },
  syncedSlot: {
    marginBottom: 16,
  },
  hero: {
    marginBottom: 4,
  },
  counter: {
    fontFamily: 'Manrope-Medium',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  hintSlot: {
    marginTop: 4,
    marginBottom: 8,
  },
});
