import React, { memo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type AccessibilityState,
} from 'react-native';
import type { ProductCategory } from '@/domain/product/ProductCategory';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  categories: ProductCategory[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function Chip({ label, selected, onPress }: ChipProps): React.JSX.Element {
  const theme = useAppTheme();
  const a11yState: AccessibilityState = { selected };
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={a11yState}
      hitSlop={6}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected
            ? theme.colors.primary
            : pressed
            ? theme.colors.searchFocus
            : 'transparent',
          borderColor: selected
            ? theme.colors.primary
            : theme.colors.searchBorder,
        },
      ]}
    >
      <Text
        style={[
          theme.typography.footerLabel,
          {
            color: selected ? theme.colors.card : theme.colors.text,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function CategoryChipsImpl({
  categories,
  selected,
  onSelect,
}: Props): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      <Chip
        label="All"
        selected={selected === null}
        onPress={() => onSelect(null)}
      />
      {categories.map(c => (
        <Chip
          key={c.slug}
          label={c.name}
          selected={selected === c.slug}
          onPress={() => onSelect(c.slug)}
        />
      ))}
    </ScrollView>
  );
}

export const CategoryChips = memo(
  CategoryChipsImpl,
  (prev, next) =>
    prev.selected === next.selected &&
    prev.onSelect === next.onSelect &&
    prev.categories.length === next.categories.length &&
    prev.categories.every((c, i) => c.slug === next.categories[i]!.slug),
);

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
