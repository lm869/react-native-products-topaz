import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  isFavorite: boolean;
  onPress?: () => void;
  testID?: string;
};

export function FavoriteIndicator({
  isFavorite,
  onPress,
  testID,
}: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Remove from favorites' : 'Add to favorites'
      }
      accessibilityState={{ selected: isFavorite }}
      hitSlop={8}
      onPress={onPress}
      testID={testID}
      style={styles.hit}
    >
      <View
        style={[
          styles.circle,
          styles.circleBorder,
          {
            backgroundColor: theme.colors.favoriteFrosted,
            borderColor: isFavorite
              ? theme.colors.favoriteBorderActive
              : theme.colors.favoriteBorderInactive,
          },
        ]}
      >
        <Icon
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={16}
          color={
            isFavorite
              ? theme.colors.favoriteActive
              : theme.colors.favoriteInactive
          }
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    position: 'absolute',
    top: 6,
    right: 6,
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
  },
  circleBorder: {
    borderWidth: 1,
  },
});
