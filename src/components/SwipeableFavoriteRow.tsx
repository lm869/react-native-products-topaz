import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  children: React.ReactNode;
  onDelete: () => void;
  accessibilityLabel?: string;
  onMount?: (reset: () => void) => void;
};

const REVEAL_WIDTH = 88;
const COMMIT_THRESHOLD = -40;
const RUBBERBAND_LIMIT = -110;
const RUBBERBAND_FACTOR = 0.2;

function SwipeableFavoriteRowImpl({
  children,
  onDelete,
  accessibilityLabel,
  onMount,
}: Props): React.JSX.Element {
  const theme = useAppTheme();
  const translateX = useSharedValue(0);

  const reset = useCallback(() => {
    translateX.value = withSpring(0, { damping: 18, stiffness: 200 });
  }, [translateX]);

  useEffect(() => {
    onMount?.(reset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onUpdate(event => {
      const next = event.translationX;
      if (next < RUBBERBAND_LIMIT) {
        translateX.value =
          RUBBERBAND_LIMIT + (next - RUBBERBAND_LIMIT) * RUBBERBAND_FACTOR;
      } else {
        translateX.value = next;
      }
    })
    .onEnd(event => {
      if (event.translationX < COMMIT_THRESHOLD || event.velocityX < -800) {
        translateX.value = withSpring(-REVEAL_WIDTH, {
          damping: 18,
          stiffness: 200,
        });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 200 });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.actionLayer,
          { backgroundColor: theme.colors.destructiveBg },
        ]}
        pointerEvents="box-none"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? 'Delete favorite'}
          accessibilityHint="Deletes this favorite from your list"
          onPress={onDelete}
          style={styles.actionButton}
        >
          <Text
            style={[
              styles.actionLabel,
              { color: theme.colors.destructiveText },
            ]}
          >
            Delete
          </Text>
        </Pressable>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.row, rowStyle]}
          accessibilityHint="Swipe left to delete"
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export const SwipeableFavoriteRow = React.memo(SwipeableFavoriteRowImpl);

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    marginBottom: 12,
  },
  actionLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  actionButton: {
    width: 88,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontFamily: 'Manrope-Bold',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    backgroundColor: 'transparent',
  },
});

export const SWIPEABLE_CONSTANTS = {
  REVEAL_WIDTH,
  COMMIT_THRESHOLD,
  RUBBERBAND_LIMIT,
};
