import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { RetryButton } from '@/components/RetryButton';
import { mapAppError, type AppError } from '@/api/errors';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  error: AppError;
  onRetry: () => void;
};

function iconForError(kind: AppError['kind']): string {
  switch (kind) {
    case 'network':
      return 'wifi-off';
    case 'timeout':
      return 'clock-alert-outline';
    case 'http':
      return 'alert-circle';
    case 'parse':
      return 'alert-circle-outline';
    case 'unknown':
    default:
      return 'alert-circle-outline';
  }
}

export function ErrorState({ error, onRetry }: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <View style={styles.root}>
      <Icon
        name={iconForError(error.kind)}
        size={48}
        color={theme.colors.discountBg}
        variant="outline"
      />
      <Text
        style={[
          theme.typography.cardTitle,
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        Something went wrong
      </Text>
      <Text
        style={[
          theme.typography.subtitle,
          styles.message,
          { color: theme.colors.subtitle },
        ]}
      >
        {mapAppError(error)}
      </Text>
      <View style={styles.cta}>
        <RetryButton onPress={onRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  title: { marginTop: 16, textAlign: 'center' },
  message: { marginTop: 8, textAlign: 'center' },
  cta: { marginTop: 24 },
});
