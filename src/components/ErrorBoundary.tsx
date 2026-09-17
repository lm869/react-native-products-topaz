import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = (): void => {
    this.setState({ error: null });
  };

  override render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      return (
        <View style={styles.root}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Algo salió mal</Text>
            <Text style={styles.message}>
              La app encontró un error inesperado. Toca Reset para continuar.
            </Text>
            <Pressable
              onPress={this.handleReset}
              accessibilityRole="button"
              accessibilityLabel="Reset"
              accessibilityHint="Clears the error and returns to the app"
              hitSlop={12}
              style={({ pressed }) => [
                styles.reset,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.resetLabel}>Reset</Text>
            </Pressable>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  reset: {
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#999',
  },
  resetLabel: { fontSize: 16, fontWeight: '600' },
});
