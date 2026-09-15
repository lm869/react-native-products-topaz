import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ProductsScreen(): React.JSX.Element {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Products</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
});
