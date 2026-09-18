import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';

export function SkeletonCard(): React.JSX.Element {
  const theme = useAppTheme();
  const fill = theme.colors.placeholderBg;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
        },
      ]}
    >
      <View
        style={[
          styles.image,
          { backgroundColor: fill, borderRadius: theme.radius.image },
        ]}
      />
      <View style={styles.body}>
        <View style={[styles.lineSm, { backgroundColor: fill }]} />
        <View style={[styles.lineLg, { backgroundColor: fill }]} />
        <View style={[styles.linePrice, { backgroundColor: fill }]} />
      </View>
    </View>
  );
}

type Props = {
  count?: number;
};

export function ProductSkeleton({ count = 6 }: Props): React.JSX.Element {
  const items: number[] = [];
  for (let i = 0; i < count; i++) items.push(i);
  return (
    <>
      {items.map(i => (
        <SkeletonCard key={`sk-${i}`} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
  },
  lineSm: {
    height: 10,
    width: '40%',
    borderRadius: 4,
    marginBottom: 10,
  },
  lineLg: {
    height: 14,
    width: '90%',
    borderRadius: 4,
    marginBottom: 6,
  },
  linePrice: {
    height: 14,
    width: '50%',
    borderRadius: 4,
    marginTop: 10,
  },
});
