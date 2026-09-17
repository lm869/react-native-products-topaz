import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleButton } from '@/features/settings/components/ThemeToggleButton';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  title: string;
};

export function ThemedScreenHeader({ title }: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.root, { backgroundColor: theme.colors.canvas }]}
    >
      <View style={styles.row}>
        <Text
          style={[
            styles.title,
            styles.titleColor,
            { color: theme.colors.text },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <ThemeToggleButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
  },
  titleColor: {
    fontFamily: 'Manrope-Bold',
  },
});
