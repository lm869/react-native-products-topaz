import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import { useAppTheme } from '@/theme/ThemeContext';
import { formatCurrency } from '@/utils/currency';
import { truncate } from '@/utils/truncate';

type Props = {
  favorite: FavoriteProduct;
  onPress: (id: number) => void;
};

function FavoriteListItemImpl({ favorite, onPress }: Props): React.JSX.Element {
  const theme = useAppTheme();

  const handlePress = useCallback(() => {
    onPress(favorite.id);
  }, [onPress, favorite.id]);

  const a11yLabel = `${favorite.title}, ${formatCurrency(favorite.price)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="Opens product detail"
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: theme.colors.imageBg,
            borderRadius: theme.radius.image,
          },
        ]}
      >
        <FastImage
          source={{ uri: favorite.thumbnail }}
          style={styles.thumbImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={styles.body}>
        <Text
          style={[
            theme.typography.eyebrowSm,
            styles.eyebrow,
            { color: theme.colors.eyebrow },
          ]}
          numberOfLines={1}
        >
          {favorite.category}
        </Text>
        <Text
          style={[
            theme.typography.cardTitle,
            styles.title,
            { color: theme.colors.text },
          ]}
          numberOfLines={2}
        >
          {truncate(favorite.title, 56)}
        </Text>
        <Text
          style={[
            theme.typography.priceMain,
            styles.price,
            { color: theme.colors.text },
          ]}
        >
          {formatCurrency(favorite.price)}
        </Text>
      </View>
    </Pressable>
  );
}

export const FavoriteListItem = memo(
  FavoriteListItemImpl,
  (prev, next) =>
    prev.favorite.id === next.favorite.id &&
    prev.favorite.price === next.favorite.price &&
    prev.favorite.title === next.favorite.title &&
    prev.favorite.thumbnail === next.favorite.thumbnail &&
    prev.favorite.category === next.favorite.category,
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  thumb: {
    width: 72,
    height: 72,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
  },
  eyebrow: {
    marginBottom: 4,
  },
  title: {
    marginBottom: 6,
  },
  price: {},
});
