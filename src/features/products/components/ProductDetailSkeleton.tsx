import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';

export function ProductDetailSkeleton(): React.JSX.Element {
  const theme = useAppTheme();
  const baseColor = theme.colors.imageBg;
  const softColor = theme.colors.cardBorder;

  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading product"
    >
      <View style={[styles.hero, { backgroundColor: baseColor }]} />
      <View style={styles.body}>
        <View
          style={[
            styles.line,
            styles.lineEyebrow,
            { backgroundColor: softColor },
          ]}
        />
        <View
          style={[
            styles.line,
            styles.lineTitle,
            { backgroundColor: softColor },
          ]}
        />
        <View
          style={[
            styles.line,
            styles.linePrice,
            { backgroundColor: softColor },
          ]}
        />
        <View
          style={[styles.line, styles.lineText, { backgroundColor: softColor }]}
        />
        <View
          style={[styles.line, styles.lineText, { backgroundColor: softColor }]}
        />
        <View
          style={[
            styles.line,
            styles.lineTextShort,
            { backgroundColor: softColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    width: '100%',
    height: 360,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  line: {
    borderRadius: 6,
    marginBottom: 12,
  },
  lineEyebrow: { width: 100, height: 12 },
  lineTitle: { width: '85%', height: 24 },
  linePrice: { width: 120, height: 22 },
  lineText: { width: '100%', height: 14 },
  lineTextShort: { width: '60%', height: 14 },
});
