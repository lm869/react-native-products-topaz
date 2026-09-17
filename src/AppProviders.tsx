import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ThemeOverrideProvider } from '@/theme/ThemeOverrideProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HydrationGate } from '@/components/HydrationGate';
import { queryClient } from '@/store/queryClient';

type Props = { children: React.ReactNode };

export function AppProviders({ children }: Props): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemeOverrideProvider>
              <HydrationGate>{children}</HydrationGate>
            </ThemeOverrideProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
