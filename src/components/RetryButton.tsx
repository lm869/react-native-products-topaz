import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  onPress: () => void;
  label?: string;
};

function RetryButtonImpl({
  onPress,
  label = 'Retry',
}: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.btn,
        {
          borderColor: theme.colors.searchBorder,
          backgroundColor: pressed ? theme.colors.searchFocus : 'transparent',
        },
      ]}
    >
      <Text
        style={[theme.typography.footerLabel, { color: theme.colors.text }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export const RetryButton = memo(RetryButtonImpl);

const styles = StyleSheet.create({
  btn: {
    minWidth: 88,
    minHeight: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
  },
});
