import React from 'react';

export type SnackbarAction = {
  label: string;
  onPress: () => void;
};

export type ShowSnackbarOptions = {
  action?: SnackbarAction;
  duration?: number;
};

export type ShowSnackbar = (
  message: string,
  options?: ShowSnackbarOptions,
) => void;

export interface SnackbarContextValue {
  show: ShowSnackbar;
  dismiss: () => void;
}

export const SnackbarContext = React.createContext<SnackbarContextValue | null>(
  null,
);
