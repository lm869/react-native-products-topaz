import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type { FavoriteProduct } from '@/domain/favorites/FavoriteProduct';
import { useAppTheme } from '@/theme/ThemeContext';
import { formatCurrency } from '@/utils/currency';
import { truncate } from '@/utils/truncate';
import { Icon } from '@/components/Icon';

type Props = {
  favorite: FavoriteProduct;
  onPress: (id: number) => void;
};

function FavoriteListItemImpl({ favorite, onPress }: Props): React.JSX.Element {
  const theme = useAppTheme();

  const handlePress = useCallback(() => {
    onPress(favorite.id);
  }, [onPress, favorite.id]);

  const hasDiscount =
    favorite.discountPercentage !== undefined &&
    favorite.discountPercentage > 0;
  const originalPrice =
    favorite.originalPrice ??
    (hasDiscount
      ? favorite.price / (1 - (favorite.discountPercentage ?? 0) / 100)
      : undefined);
  const showStrike = hasDiscount && originalPrice !== undefined;
  const hasRating = favorite.rating !== undefined;

  const a11yLabel = `${favorite.title}, ${formatCurrency(favorite.price)}${
    showStrike ? `, was ${formatCurrency(originalPrice as number)}` : ''
  }${hasRating ? `, rated ${favorite.rating?.toFixed(1)}` : ''}`;

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
        {hasDiscount ? (
          <View
            style={[
              styles.discountBadge,
              {
                backgroundColor: theme.colors.discountBg,
                borderColor: theme.colors.discountBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.discountBadgeText,
                { color: theme.colors.discountText },
              ]}
            >
              -{Math.round(favorite.discountPercentage ?? 0)}%
            </Text>
          </View>
        ) : null}
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel="Favorited"
          style={[
            styles.heartSlot,
            { backgroundColor: theme.colors.favoriteFrosted },
          ]}
          hitSlop={12}
        >
          <Icon name="heart" size={16} color={theme.colors.favoriteActive} />
        </View>
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
        {hasRating ? (
          <View style={styles.ratingRow}>
            <Icon name="star" size={12} color={theme.colors.discountBg} />
            <Text style={[styles.ratingText, { color: theme.colors.subtitle }]}>
              {favorite.rating?.toFixed(1)}
            </Text>
          </View>
        ) : null}
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
        <View style={styles.priceRow}>
          <Text
            style={[
              theme.typography.priceMain,
              styles.priceMain,
              { color: theme.colors.text },
            ]}
          >
            {formatCurrency(favorite.price)}
          </Text>
          {showStrike ? (
            <Text
              style={[
                theme.typography.priceStrike,
                styles.priceStrike,
                { color: theme.colors.priceStrike },
              ]}
            >
              {formatCurrency(originalPrice as number)}
            </Text>
          ) : null}
        </View>
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
    prev.favorite.category === next.favorite.category &&
    prev.favorite.discountPercentage === next.favorite.discountPercentage &&
    prev.favorite.originalPrice === next.favorite.originalPrice &&
    prev.favorite.rating === next.favorite.rating,
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: 'transparent',
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
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  discountBadgeText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heartSlot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  eyebrow: {
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  },
  title: {
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceMain: {},
  priceStrike: {},
});
