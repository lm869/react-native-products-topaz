import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';
import { Icon } from '@/components/Icon';

type Props = {
  onDismiss: () => void;
};

export function SwipeHint({ onDismiss }: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel="Swipe left on a favorite to delete it"
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.hintBg,
          borderColor: theme.colors.cardBorder,
        },
      ]}
    >
      <Icon name="gesture-swipe-left" size={16} color={theme.colors.subtitle} />
      <Text
        style={[styles.label, { color: theme.colors.subtitle }]}
        numberOfLines={1}
      >
        Swipe left to delete
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss swipe hint"
        onPress={onDismiss}
        hitSlop={8}
        style={styles.close}
      >
        <Icon name="close" size={14} color={theme.colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  label: {
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    flex: 1,
  },
  close: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
