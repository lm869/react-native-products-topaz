import React from 'react';

export type ConfirmVariant = 'destructive' | 'neutral';

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

export type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

export interface ConfirmContextValue {
  confirm: ConfirmFn;
}

export const ConfirmContext = React.createContext<ConfirmContextValue | null>(
  null,
);
