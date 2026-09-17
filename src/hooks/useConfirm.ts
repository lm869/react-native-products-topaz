import { useContext } from 'react';
import { ConfirmContext, type ConfirmFn } from '@/components/confirmContext';

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (ctx === null) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return ctx.confirm;
}
