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
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { computeDiscountedPrice, isOnSale } from '@/utils/discount';
import { formatCurrency } from '@/utils/currency';
import { truncate } from '@/utils/truncate';

type Props = {
  product: Product;
  onPress: (id: number) => void;
};

function ProductCardImpl({ product, onPress }: Props): React.JSX.Element {
  const theme = useAppTheme();

  const handlePress = useCallback(() => {
    onPress(product.id);
  }, [onPress, product.id]);

  const onSaleFlag = isOnSale(product.discountPercentage);
  const finalPrice = onSaleFlag
    ? computeDiscountedPrice(product.price, product.discountPercentage)
    : product.price;

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
        <FavoriteButton product={product} />
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
    prev.product.price === next.product.price &&
    prev.product.title === next.product.title &&
    prev.product.thumbnail === next.product.thumbnail &&
    prev.product.discountPercentage === next.product.discountPercentage &&
    prev.product.category === next.product.category,
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#2B2D42',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 2,
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
