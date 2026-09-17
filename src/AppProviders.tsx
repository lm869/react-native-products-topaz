import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ThemeOverrideProvider } from '@/theme/ThemeOverrideProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HydrationGate } from '@/components/HydrationGate';
import { SnackbarProvider } from '@/components/SnackbarProvider';
import { ConfirmProvider } from '@/components/ConfirmProvider';
import { queryClient } from '@/store/queryClient';

type Props = { children: React.ReactNode };

export function AppProviders({ children }: Props): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemeOverrideProvider>
              <SnackbarProvider>
                <ConfirmProvider>
                  <HydrationGate>{children}</HydrationGate>
                </ConfirmProvider>
              </SnackbarProvider>
            </ThemeOverrideProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
