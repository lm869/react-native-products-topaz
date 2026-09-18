import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/ThemeContext';
import {
  SnackbarContext,
  type SnackbarAction,
  type SnackbarContextValue,
  type ShowSnackbarOptions,
} from './snackbarContext';

type SnackbarState = {
  key: number;
  message: string;
  action?: SnackbarAction;
  duration: number;
};

const DEFAULT_DURATION = 3000;
const ENTER_OFFSET = 80;
const ENTER_DURATION = 220;
const EXIT_DURATION = 180;

export function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, setState] = useState<SnackbarState | null>(null);
  const counterRef = useRef(0);

  const dismiss = useCallback(() => {
    setState(null);
  }, []);

  const show = useCallback<SnackbarContextValue['show']>(
    (message, options?: ShowSnackbarOptions) => {
      counterRef.current += 1;
      setState({
        key: counterRef.current,
        message,
        action: options?.action,
        duration: options?.duration ?? DEFAULT_DURATION,
      });
    },
    [],
  );

  const ctx = useMemo<SnackbarContextValue>(
    () => ({ show, dismiss }),
    [show, dismiss],
  );

  return (
    <SnackbarContext.Provider value={ctx}>
      {children}
      {state !== null ? (
        <SnackbarView
          key={state.key}
          message={state.message}
          action={state.action}
          duration={state.duration}
          onDismiss={dismiss}
        />
      ) : null}
    </SnackbarContext.Provider>
  );
}

type SnackbarViewProps = {
  message: string;
  action?: SnackbarAction;
  duration: number;
  onDismiss: () => void;
};

function SnackbarView({
  message,
  action,
  duration,
  onDismiss,
}: SnackbarViewProps): React.JSX.Element {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(ENTER_OFFSET);
  const opacity = useSharedValue(0);
  const dismissedRef = useRef(false);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: ENTER_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: ENTER_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    const timer = setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      translateY.value = withTiming(ENTER_OFFSET, {
        duration: EXIT_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: EXIT_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      setTimeout(onDismiss, EXIT_DURATION);
    }, duration);
    return () => {
      clearTimeout(timer);
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [duration, onDismiss, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleAction = useCallback(() => {
    action?.onPress();
    dismissedRef.current = true;
    translateY.value = withTiming(ENTER_OFFSET, {
      duration: EXIT_DURATION,
      easing: Easing.in(Easing.cubic),
    });
    opacity.value = withTiming(0, {
      duration: EXIT_DURATION,
      easing: Easing.in(Easing.cubic),
    });
    setTimeout(onDismiss, EXIT_DURATION);
  }, [action, onDismiss, opacity, translateY]);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { bottom: insets.bottom + 16 }]}
    >
      <Animated.View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[
          styles.bar,
          {
            backgroundColor: theme.colors.snackBg,
            borderRadius: theme.radius.card,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[styles.message, { color: theme.colors.snackText }]}
          numberOfLines={2}
        >
          {message}
        </Text>
        {action !== undefined ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={handleAction}
            style={styles.actionWrap}
            hitSlop={8}
          >
            <Text
              style={[styles.actionLabel, { color: theme.colors.snackText }]}
            >
              {action.label.toUpperCase()}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    maxWidth: 480,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  message: {
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    flex: 1,
  },
  actionWrap: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionLabel: {
    fontFamily: 'Manrope-Bold',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
