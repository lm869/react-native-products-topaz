import React, { memo, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type AccessibilityRole,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type { Product } from '@/domain/product/Product';
import { useAppTheme } from '@/theme/ThemeContext';
import { DiscountPill } from './DiscountPill';
import { FavoriteIndicator } from './FavoriteIndicator';
import { computeDiscountedPrice, isOnSale } from '@/utils/discount';
import { formatCurrency } from '@/utils/currency';
import { truncate } from '@/utils/truncate';

type Props = {
  product: Product;
  isFavorite: boolean;
  onPress: (id: number) => void;
  onFavoritePress?: (id: number) => void;
};

function ratingLabel(rating: number): string {
  if (!Number.isFinite(rating) || rating <= 0) return '';
  return rating.toFixed(1);
}

function ProductCardImpl({
  product,
  isFavorite,
  onPress,
  onFavoritePress,
}: Props): React.JSX.Element {
  const theme = useAppTheme();

  const handlePress = useCallback(() => {
    onPress(product.id);
  }, [onPress, product.id]);

  const handleFav = useCallback(() => {
    onFavoritePress?.(product.id);
  }, [onFavoritePress, product.id]);

  const onSaleFlag = isOnSale(product.discountPercentage);
  const finalPrice = onSaleFlag
    ? computeDiscountedPrice(product.price, product.discountPercentage)
    : product.price;
  const rating = ratingLabel(product.rating);

  const a11yRole: AccessibilityRole = 'button';
  const a11yLabel = `${product.title}, ${formatCurrency(finalPrice)}${
    onSaleFlag ? `, on sale` : ''
  }`;

  return (
    <Pressable
      accessibilityRole={a11yRole}
      accessibilityLabel={a11yLabel}
      accessibilityHint="Opens product detail"
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.imageWrap,
          {
            backgroundColor: theme.colors.imageBg,
            borderRadius: theme.radius.image,
          },
        ]}
      >
        <FastImage
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <DiscountPill discountPercentage={product.discountPercentage} />
        <FavoriteIndicator
          isFavorite={isFavorite}
          onPress={onFavoritePress ? handleFav : undefined}
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
          {product.category}
          {rating ? ` · ★ ${rating}` : ''}
        </Text>
        <Text
          style={[
            theme.typography.cardTitle,
            styles.title,
            { color: theme.colors.text },
          ]}
          numberOfLines={2}
        >
          {truncate(product.title, 56)}
        </Text>
        <View style={styles.priceRow}>
          <Text
            style={[theme.typography.priceMain, { color: theme.colors.text }]}
          >
            {formatCurrency(finalPrice)}
          </Text>
          {onSaleFlag ? (
            <Text
              style={[
                theme.typography.priceStrike,
                styles.priceStrike,
                { color: theme.colors.priceStrike },
              ]}
            >
              {formatCurrency(product.price)}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export const ProductCard = memo(
  ProductCardImpl,
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.isFavorite === next.isFavorite &&
    prev.product.price === next.product.price &&
    prev.product.title === next.product.title &&
    prev.product.thumbnail === next.product.thumbnail,
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
  },
  eyebrow: { marginBottom: 4 },
  title: { minHeight: 38 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  priceStrike: { marginLeft: 8 },
});
