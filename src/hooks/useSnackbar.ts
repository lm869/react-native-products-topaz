import { useContext } from 'react';
import {
  SnackbarContext,
  type ShowSnackbar,
} from '@/components/snackbarContext';

export function useSnackbar(): ShowSnackbar {
  const ctx = useContext(SnackbarContext);
  if (ctx === null) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return ctx.show;
}

export function useSnackbarDismiss(): () => void {
  const ctx = useContext(SnackbarContext);
  if (ctx === null) {
    throw new Error(
      'useSnackbarDismiss must be used within a SnackbarProvider',
    );
  }
  return ctx.dismiss;
}
