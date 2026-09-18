import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

function SearchBarImpl({
  value,
  onChangeText,
  placeholder = 'Search products',
}: Props): React.JSX.Element {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);

  const handleFocus = (): void => {
    setFocused(true);
  };
  const handleBlur = (): void => {
    setFocused(false);
  };

  const showClear = value.length > 0;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: focused
            ? theme.colors.searchFocus
            : theme.colors.searchBg,
          borderColor: focused
            ? theme.colors.focusRing
            : theme.colors.searchBorder,
        },
      ]}
    >
      <Icon
        name="magnify"
        size={20}
        color={focused ? theme.colors.accent : theme.colors.textMuted}
      />
      <TextInput
        accessibilityRole="search"
        accessibilityLabel="Search products"
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        style={[
          styles.input,
          theme.typography.searchInput,
          { color: theme.colors.text },
        ]}
      />
      {showClear ? (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          style={styles.clear}
        >
          <Icon name="close" size={18} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export const SearchBar = memo(SearchBarImpl);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  clear: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
