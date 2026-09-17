import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { useAppTheme } from '@/theme/ThemeContext';

type Props = {
  icon?: string;
  title: string;
  description?: string;
  cta?: React.ReactNode;
};

export function EmptyState({
  icon = 'magnify',
  title,
  description,
  cta,
}: Props): React.JSX.Element {
  const theme = useAppTheme();
  return (
    <View style={styles.root}>
      <Icon name={icon} size={48} color={theme.colors.textMuted} />
      <Text
        style={[
          theme.typography.cardTitle,
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            theme.typography.subtitle,
            styles.description,
            { color: theme.colors.subtitle },
          ]}
        >
          {description}
        </Text>
      ) : null}
      {cta ? <View style={styles.cta}>{cta}</View> : null}
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
  description: { marginTop: 8, textAlign: 'center' },
  cta: { marginTop: 24 },
});
