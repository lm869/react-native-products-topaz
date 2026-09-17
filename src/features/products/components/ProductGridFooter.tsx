import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '@/theme/ThemeContext';

const DOT_SIZE = 8;
const TRAVEL = -6;
const STEP_MS = 200;

function BounceDot(): React.JSX.Element {
  const theme = useAppTheme();
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(TRAVEL, {
          duration: STEP_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: STEP_MS,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
    );
    return () => {
      y.value = 0;
    };
  }, [y]);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        aStyle,
        styles.dotColor,
        { backgroundColor: theme.colors.accent },
      ]}
    />
  );
}

export function ProductGridFooter(): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <View style={styles.root}>
      <View style={styles.dots}>
        <BounceDot />
        <BounceDot />
        <BounceDot />
      </View>
      <Text
        style={[
          theme.typography.footerLabel,
          styles.label,
          styles.labelColor,
          { color: theme.colors.subtitle },
        ]}
      >
        Fetching more curated items…
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DOT_SIZE,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 3,
  },
  dotColor: {},
  label: { marginTop: 12 },
  labelColor: {},
});
