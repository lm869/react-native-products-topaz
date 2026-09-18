import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  discountPercentage: number;
};

function DiscountPillImpl({ discountPercentage }: Props): React.JSX.Element {
  const theme = useAppTheme();
  const visible = discountPercentage > 0;
  if (!visible) return <View />;
  const rounded = Math.round(discountPercentage);
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: theme.colors.discountBg,
          borderColor: theme.colors.discountBorder,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Discount ${rounded} percent`}
    >
      <Text
        style={[
          theme.typography.eyebrowSm,
          styles.label,
          { color: theme.colors.discountText },
        ]}
      >
        -{rounded}%
      </Text>
    </View>
  );
}

export const DiscountPill = memo(DiscountPillImpl);

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: { includeFontPadding: false },
});
