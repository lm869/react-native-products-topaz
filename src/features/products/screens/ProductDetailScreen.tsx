import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { Screen } from '@/components/Screen';
import { ThemedScreenHeader } from '@/components/ThemedScreenHeader';
import { Icon } from '@/components/Icon';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { RetryButton } from '@/components/RetryButton';
import { DiscountPill } from '@/features/products/components/DiscountPill';
import { ProductDetailSkeleton } from '@/features/products/components/ProductDetailSkeleton';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { useAppTheme } from '@/theme/ThemeContext';
import { useProduct } from '@/features/products/hooks/useProduct';
import { computeDiscountedPrice, isOnSale } from '@/utils/discount';
import { useFormattedPrice } from '@/utils/useFormattedPrice';
import {
  convertFromUSD,
  DEMO_DISCLAIMER,
  getCurrencyLocale,
  getDemoRate,
  type DemoCurrency,
} from '@/utils/currencyConversion';
import type { ProductsStackScreenProps } from '@/navigation/types';

const CURRENCY_OPTIONS = ['USD', 'EUR', 'ARS', 'JPY'] as const;
type CurrencyCode = DemoCurrency;

type Props = ProductsStackScreenProps<'ProductDetail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const HERO_HEIGHT = 380;
const ITEM_WIDTH = SCREEN_WIDTH;

export function ProductDetailScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const theme = useAppTheme();
  const { productId } = route.params;

  const { product, isPending, isError, isNotFound, error, refetch } =
    useProduct(productId);

  const gallery: string[] = useMemo(() => {
    if (!product) return [];
    if (product.images.length > 0) return product.images;
    return [product.thumbnail];
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const locale = getCurrencyLocale(currency);

  const safePrice = product?.price ?? 0;
  const safeDiscount = product?.discountPercentage ?? 0;
  const safeOnSale = isOnSale(safeDiscount);
  const safeFinalPrice = safeOnSale
    ? computeDiscountedPrice(safePrice, safeDiscount)
    : safePrice;
  const convertedFinalPrice = convertFromUSD(safeFinalPrice, currency);
  const convertedOriginalPrice = convertFromUSD(safePrice, currency);
  const mainPriceFmt = useFormattedPrice(convertedFinalPrice, currency, locale);
  const originalPriceFmt = useFormattedPrice(
    convertedOriginalPrice,
    currency,
    locale,
  );

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setActiveIndex(idx);
  }, []);

  const renderGalleryItem = useCallback(
    ({ item }: { item: string }) => (
      <View
        style={[styles.heroItem, { backgroundColor: theme.colors.imageBg }]}
      >
        <FastImage
          source={{ uri: item }}
          style={styles.heroImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    ),
    [theme.colors.imageBg],
  );

  const heroKeyExtractor = useCallback(
    (item: string, idx: number) => `${idx}-${item}`,
    [],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  if (isPending) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <ThemedScreenHeader title="Product" />
        <ProductDetailSkeleton />
      </Screen>
    );
  }

  if (isNotFound) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <ThemedScreenHeader title="Product" />
        <EmptyState
          icon="package-variant"
          title="Product not found"
          description="This product may have been removed or is unavailable."
          cta={
            <RetryButton
              label="Go back"
              onPress={() => {
                if (navigation.canGoBack()) navigation.goBack();
              }}
            />
          }
        />
      </Screen>
    );
  }

  if (isError && error) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <ThemedScreenHeader title="Product" />
        <ErrorState error={error} onRetry={refetch} />
      </Screen>
    );
  }

  if (!product) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <ThemedScreenHeader title="Product" />
      </Screen>
    );
  }

  const onSaleFlag = isOnSale(product.discountPercentage);
  const ratingValue = product.rating;
  const tags = product.tags ?? [];
  const showBrand = product.brand !== undefined && product.brand.length > 0;
  const showTags = tags.length > 0;
  const isCarousel = gallery.length > 1;
  const discountRounded = Math.round(product.discountPercentage);
  const stars = buildStars(ratingValue);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ThemedScreenHeader back onBack={handleBack} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          {isCarousel ? (
            <FlatList
              data={gallery}
              renderItem={renderGalleryItem}
              keyExtractor={heroKeyExtractor}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: ITEM_WIDTH,
                offset: ITEM_WIDTH * index,
                index,
              })}
            />
          ) : (
            <View
              style={[
                styles.heroItem,
                { backgroundColor: theme.colors.imageBg },
              ]}
            >
              <FastImage
                source={{ uri: gallery[0] ?? product.thumbnail }}
                style={styles.heroImage}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          )}
          <DiscountPill discountPercentage={product.discountPercentage} />
          <FavoriteButton product={product} />
          {isCarousel ? (
            <View style={styles.dotsRow} accessibilityRole="text">
              {gallery.map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <View
                    key={`dot-${idx}`}
                    style={[
                      isActive ? styles.dotActive : styles.dot,
                      {
                        backgroundColor: isActive
                          ? theme.colors.accent
                          : theme.colors.cardBorder,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ) : null}
        </View>

        <View
          style={[styles.detailsCard, { backgroundColor: theme.colors.card }]}
        >
          <View
            style={[
              styles.dragIndicator,
              { backgroundColor: theme.colors.cardBorder },
            ]}
          />

          <View style={styles.eyebrowRow}>
            <Text
              style={[
                theme.typography.eyebrowSm,
                styles.eyebrowText,
                { color: theme.colors.accent },
              ]}
              numberOfLines={1}
            >
              {showBrand
                ? `${product.brand}  ·  ${product.category}`
                : product.category}
            </Text>
            {showBrand ? (
              <View
                style={[
                  styles.verifiedPill,
                  {
                    backgroundColor: theme.colors.themeToggleBg,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
                accessibilityLabel="Verified Authentic"
              >
                <Icon name="verified" size={12} color={theme.colors.accent} />
                <Text
                  style={[
                    theme.typography.eyebrowSm,
                    styles.verifiedLabel,
                    { color: theme.colors.text },
                  ]}
                >
                  Verified
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.currencyRow}>
            {CURRENCY_OPTIONS.map(code => {
              const isActive = code === currency;
              return (
                <View
                  key={code}
                  style={[
                    styles.currencyPill,
                    {
                      backgroundColor: isActive
                        ? theme.colors.accent
                        : theme.colors.themeToggleBg,
                      borderColor: theme.colors.cardBorder,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Show price in ${code}`}
                  accessibilityState={{ selected: isActive }}
                  onTouchEnd={() => setCurrency(code)}
                >
                  <Text
                    style={[
                      theme.typography.eyebrowSm,
                      styles.currencyLabel,
                      {
                        color: isActive
                          ? theme.colors.canvas
                          : theme.colors.text,
                      },
                    ]}
                  >
                    {code}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text
            style={[
              theme.typography.screenTitle,
              styles.title,
              { color: theme.colors.text },
            ]}
          >
            {product.title}
          </Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {stars.map((filled, idx) => (
                <Icon
                  key={`star-${idx}`}
                  name={filled ? 'star' : 'star-outline'}
                  size={16}
                  color={theme.colors.accent}
                />
              ))}
            </View>
            {ratingValue > 0 ? (
              <Text
                style={[
                  theme.typography.cardTitle,
                  styles.ratingValue,
                  { color: theme.colors.text },
                ]}
              >
                {ratingValue.toFixed(1)}
              </Text>
            ) : null}
            {product.stock > 0 ? (
              <View
                style={[
                  styles.stockPill,
                  {
                    backgroundColor: theme.colors.canvas,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.stockDot,
                    { backgroundColor: theme.colors.accent },
                  ]}
                />
                <Text
                  style={[
                    theme.typography.eyebrowSm,
                    styles.stockLabel,
                    { color: theme.colors.text },
                  ]}
                >
                  In Stock ({product.stock})
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.pricingCard,
              {
                backgroundColor: theme.colors.canvas,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.priceHuge, { color: theme.colors.accent }]}>
              {mainPriceFmt.value}
            </Text>
            {onSaleFlag ? (
              <Text
                style={[
                  theme.typography.priceStrike,
                  styles.priceStrike,
                  { color: theme.colors.priceStrike },
                ]}
              >
                {originalPriceFmt.value}
              </Text>
            ) : null}
            {onSaleFlag ? (
              <View
                style={[
                  styles.discountBadge,
                  {
                    backgroundColor: theme.colors.themeToggleBg,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.typography.eyebrowSm,
                    styles.discountBadgeLabel,
                    { color: theme.colors.text },
                  ]}
                >
                  -{discountRounded}% OFF
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={[
              theme.typography.footerLabel,
              styles.pathBadge,
              {
                color:
                  mainPriceFmt.path === 'native'
                    ? theme.colors.accent
                    : theme.colors.textMuted,
              },
            ]}
            accessibilityLabel={
              mainPriceFmt.path === 'native'
                ? `Price formatted by native Android NumberFormat. 1 USD equals ${getDemoRate(
                    currency,
                  )} ${currency}. Demo rates, not real-time.`
                : `Price formatted by Intl fallback. 1 USD equals ${getDemoRate(
                    currency,
                  )} ${currency}. Demo rates, not real-time.`
            }
          >
            {`1 USD = ${getDemoRate(currency)} ${currency} · ${
              mainPriceFmt.path === 'native' ? 'via native' : 'via Intl'
            } · ${DEMO_DISCLAIMER}`}
          </Text>

          {showTags ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScroll}
            >
              {tags.map(tag => (
                <View
                  key={tag}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: theme.colors.themeToggleBg,
                      borderColor: theme.colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      theme.typography.footerLabel,
                      styles.tagLabel,
                      { color: theme.colors.text },
                    ]}
                  >
                    #{tag}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : null}

          {product.description ? (
            <View style={styles.aboutSection}>
              <Text
                style={[
                  theme.typography.cardTitle,
                  styles.sectionTitle,
                  { color: theme.colors.text },
                ]}
              >
                About this product
              </Text>
              <Text
                style={[
                  theme.typography.subtitle,
                  styles.aboutBody,
                  { color: theme.colors.subtitle },
                ]}
              >
                {product.description}
              </Text>
            </View>
          ) : null}

          {product.shippingInformation ||
          product.warrantyInformation ||
          product.returnPolicy ||
          product.availabilityStatus ? (
            <View style={styles.metaGrid}>
              {product.shippingInformation ? (
                <MetaCard
                  icon="truck"
                  label="Shipping"
                  value={product.shippingInformation}
                />
              ) : null}
              {product.warrantyInformation ? (
                <MetaCard
                  icon="shield-check-outline"
                  label="Warranty"
                  value={product.warrantyInformation}
                />
              ) : null}
              {product.returnPolicy ? (
                <MetaCard
                  icon="keyboard-return"
                  label="Returns"
                  value={product.returnPolicy}
                />
              ) : null}
              {product.availabilityStatus ? (
                <MetaCard
                  icon="package-variant"
                  label="Availability"
                  value={product.availabilityStatus}
                />
              ) : null}
            </View>
          ) : null}

          <View style={styles.footer}>
            <Icon name="lock-outline" size={14} color={theme.colors.accent} />
            <Text
              style={[
                theme.typography.eyebrowSm,
                styles.footerLabel,
                { color: theme.colors.textMuted },
              ]}
            >
              Catalog ID: {product.id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function buildStars(rating: number): boolean[] {
  if (!Number.isFinite(rating) || rating <= 0) {
    return [false, false, false, false, false];
  }
  const filled = Math.round(rating / 2);
  const stars: boolean[] = [];
  for (let i = 0; i < 5; i += 1) {
    stars.push(i < filled);
  }
  return stars;
}

type MetaCardProps = {
  icon: string;
  label: string;
  value: string;
};

function MetaCard({ icon, label, value }: MetaCardProps): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.metaCard,
        {
          backgroundColor: theme.colors.canvas,
          borderColor: theme.colors.cardBorder,
        },
      ]}
    >
      <View
        style={[
          styles.metaIconWrap,
          { backgroundColor: theme.colors.themeToggleBg },
        ]}
      >
        <Icon name={icon} size={18} color={theme.colors.text} />
      </View>
      <Text
        style={[
          theme.typography.eyebrowSm,
          styles.metaLabel,
          { color: theme.colors.textMuted },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          theme.typography.cardTitle,
          styles.metaValue,
          { color: theme.colors.text },
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  heroWrap: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroItem: {
    width: ITEM_WIDTH,
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: ITEM_WIDTH,
    height: HERO_HEIGHT,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },
  detailsCard: {
    marginTop: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eyebrowText: {
    flexShrink: 1,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginLeft: 8,
  },
  verifiedLabel: {
    marginLeft: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  currencyPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  currencyLabel: {
    fontFamily: 'Manrope-Bold',
  },
  pathBadge: {
    marginTop: -12,
    marginBottom: 20,
    letterSpacing: 0.4,
  },
  title: {
    marginBottom: 12,
    fontFamily: 'Manrope-Bold',
    letterSpacing: -0.4,
    fontSize: 26,
    lineHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    marginLeft: 4,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginLeft: 'auto',
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  stockLabel: {},
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  priceHuge: {
    fontFamily: 'Manrope-Bold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  priceStrike: {
    marginLeft: 12,
  },
  discountBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  discountBadgeLabel: {},
  tagsScroll: {
    gap: 8,
    paddingRight: 20,
    marginBottom: 20,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagLabel: {},
  aboutSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  aboutBody: {
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metaCard: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  metaIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    marginBottom: 4,
  },
  metaValue: {},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerLabel: {},
});
