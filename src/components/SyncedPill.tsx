import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '@/theme/ThemeContext';

export function SyncedPill(): React.JSX.Element {
  const theme = useAppTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.35, {
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [opacity]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel="Synced locally"
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.hintBg,
          borderColor: theme.colors.cardBorder,
        },
      ]}
    >
      <Animated.View
        style={[styles.dot, { backgroundColor: theme.colors.accent }, dotStyle]}
      />
      <Text style={[styles.label, { color: theme.colors.subtitle }]}>
        Synced locally
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: 'Manrope-Medium',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
