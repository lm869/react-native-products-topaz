import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Icon } from '@/components/Icon';
import { useAppTheme } from '@/theme/ThemeContext';
import type { Product } from '@/domain/product/Product';
import { useIsFavorite } from '../hooks/useIsFavorite';
import { useToggleFavorite } from '../hooks/useToggleFavorite';

type Props = {
  product: Product;
  testID?: string;
};

const PRESSED_SCALE = 1.2;
const SPRING_CONFIG = {
  damping: 12,
  stiffness: 220,
  mass: 0.8,
} as const;

export function FavoriteButton({ product, testID }: Props): React.JSX.Element {
  const theme = useAppTheme();
  const isFavorite = useIsFavorite(product.id);
  const { toggle } = useToggleFavorite();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(PRESSED_SCALE, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    toggle(product);
  }, [toggle, product]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Remove from favorites' : 'Add to favorites'
      }
      accessibilityState={{ selected: isFavorite }}
      hitSlop={8}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      style={styles.hit}
    >
      <Animated.View
        style={[
          styles.circle,
          styles.circleBorder,
          animatedStyle,
          {
            backgroundColor: theme.colors.favoriteFrosted,
            borderColor: isFavorite
              ? theme.colors.favoriteBorderActive
              : theme.colors.favoriteBorderInactive,
          },
        ]}
      >
        <View pointerEvents="none">
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={
              isFavorite
                ? theme.colors.favoriteActive
                : theme.colors.favoriteInactive
            }
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBorder: {
    borderWidth: 1,
  },
});
