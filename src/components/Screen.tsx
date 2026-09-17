import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  children: React.ReactNode;
  edges?: ReadonlyArray<Edge>;
};

export function Screen({ children, edges }: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.root, { backgroundColor: theme.colors.canvas }]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
