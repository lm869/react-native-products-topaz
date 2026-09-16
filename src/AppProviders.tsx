import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ThemeOverrideProvider } from '@/theme/ThemeOverrideProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { queryClient } from '@/store/queryClient';

type Props = { children: React.ReactNode };

export function AppProviders({ children }: Props): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemeOverrideProvider>{children}</ThemeOverrideProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
