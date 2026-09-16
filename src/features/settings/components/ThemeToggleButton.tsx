import React, { useMemo } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Icon } from '@/components/Icon';
import { useAppTheme } from '@/theme/ThemeContext';
import {
  useThemeOverride,
  type ThemeMode,
} from '@/features/settings/hooks/useThemeOverride';

const GLYPH: Record<ThemeMode, string> = {
  light: 'weather-sunny',
  dark: 'weather-night',
};

const ACCESSIBILITY_LABEL: Record<ThemeMode, string> = {
  light: 'Theme: light. Tap to switch to dark.',
  dark: 'Theme: dark. Tap to switch to light.',
};

export function ThemeToggleButton(): React.JSX.Element {
  const theme = useAppTheme();
  const { mode, cycleMode } = useThemeOverride();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hit: {
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
          backgroundColor: theme.colors.themeToggleBg,
        },
      }),
    [theme.colors.themeToggleBg],
  );

  return (
    <Pressable
      onPress={cycleMode}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={ACCESSIBILITY_LABEL[mode]}
      style={styles.hit}
    >
      <View style={styles.circle}>
        <Icon name={GLYPH[mode]} size={18} color={theme.colors.text} />
      </View>
    </Pressable>
  );
}
