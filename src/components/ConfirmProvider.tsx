import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from '@/components/Icon';
import { useAppTheme } from '@/theme/ThemeContext';
import {
  ConfirmContext,
  type ConfirmContextValue,
  type ConfirmOptions,
} from './confirmContext';

type ConfirmState = ConfirmOptions & {
  id: number;
  resolve: (value: boolean) => void;
};

const ENTER_DURATION = 220;

export function ConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, setState] = useState<ConfirmState | null>(null);
  const counterRef = useRef(0);

  const cancel = useCallback(() => {
    setState(prev => {
      if (prev === null) return null;
      prev.resolve(false);
      return null;
    });
  }, []);

  const confirm = useCallback<ConfirmContextValue['confirm']>(opts => {
    counterRef.current += 1;
    return new Promise<boolean>(resolve => {
      setState(prev => {
        if (prev !== null) {
          prev.resolve(false);
        }
        return { ...opts, id: counterRef.current, resolve };
      });
    });
  }, []);

  const ctx = useMemo<ConfirmContextValue>(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={ctx}>
      {children}
      {state !== null ? (
        <ConfirmView
          key={state.id}
          title={state.title}
          message={state.message}
          confirmLabel={state.confirmLabel}
          cancelLabel={state.cancelLabel}
          variant={state.variant ?? 'destructive'}
          onConfirm={() => {
            state.resolve(true);
            setState(null);
          }}
          onCancel={cancel}
        />
      ) : null}
    </ConfirmContext.Provider>
  );
}

type ConfirmViewProps = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant: 'destructive' | 'neutral';
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmView({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant,
  onConfirm,
  onCancel,
}: ConfirmViewProps): React.JSX.Element {
  const theme = useAppTheme();
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  React.useEffect(() => {
    backdropOpacity.value = withTiming(1, {
      duration: ENTER_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    cardScale.value = withTiming(1, {
      duration: ENTER_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    cardOpacity.value = withTiming(1, {
      duration: ENTER_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    return () => {
      cancelAnimation(backdropOpacity);
      cancelAnimation(cardScale);
      cancelAnimation(cardOpacity);
    };
  }, [backdropOpacity, cardScale, cardOpacity]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const isDestructive = variant === 'destructive';
  const confirmBg = isDestructive
    ? theme.colors.destructiveBg
    : theme.colors.primary;
  const confirmText = isDestructive
    ? theme.colors.destructiveText
    : theme.colors.card;

  return (
    <View style={styles.host} pointerEvents="auto">
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: theme.colors.modalBackdrop },
          backdropStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onCancel}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
            borderRadius: theme.radius.xl,
          },
          cardStyle,
        ]}
        accessibilityViewIsModal
        accessibilityRole="alert"
      >
        {isDestructive ? (
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: theme.colors.destructiveBg },
            ]}
          >
            <Icon name="alert-circle" size={24} color={confirmText} />
          </View>
        ) : null}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        {message !== undefined ? (
          <Text style={[styles.message, { color: theme.colors.subtitle }]}>
            {message}
          </Text>
        ) : null}
        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            onPress={onCancel}
            style={({ pressed }) => [
              styles.button,
              styles.buttonGhost,
              {
                borderColor: theme.colors.cardBorder,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.buttonLabel, { color: theme.colors.text }]}>
              {cancelLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: confirmBg,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.buttonLabel, { color: confirmText }]}>
              {confirmLabel}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '85%',
    maxWidth: 360,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonLabel: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
