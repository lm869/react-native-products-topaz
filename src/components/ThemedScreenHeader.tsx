import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { ThemeToggleButton } from '@/features/settings/components/ThemeToggleButton';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  title?: string;
  back?: boolean;
  onBack?: () => void;
};

function ThemedScreenHeaderImpl({
  title,
  back = false,
  onBack,
}: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.canvas,
          borderBottomColor: theme.colors.cardBorder,
        },
      ]}
    >
      <View style={styles.row}>
        {back ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to previous screen"
            onPress={onBack}
            hitSlop={8}
            style={styles.backHit}
          >
            <Icon name="arrow-left" size={20} color={theme.colors.text} />
            <Text
              style={[
                theme.typography.cardTitle,
                styles.backLabel,
                { color: theme.colors.text },
              ]}
            >
              Back
            </Text>
          </Pressable>
        ) : (
          <Text
            style={[
              styles.title,
              styles.titleColor,
              { color: theme.colors.text },
            ]}
            numberOfLines={1}
          >
            {title ?? ''}
          </Text>
        )}
        <ThemeToggleButton />
      </View>
    </SafeAreaView>
  );
}

export const ThemedScreenHeader = memo(ThemedScreenHeaderImpl);

const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1,
    shadowColor: '#2B2D42',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingLeft: 20,
    paddingRight: 5,
  },
  title: {
    fontSize: 18,
  },
  titleColor: {
    fontFamily: 'Manrope-Bold',
  },
  backHit: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    minWidth: 44,
    paddingVertical: 8,
    paddingRight: 12,
  },
  backLabel: {
    marginLeft: 6,
  },
});
