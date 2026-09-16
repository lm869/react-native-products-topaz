import React from 'react';
import {
  MaterialDesignIcons,
  type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons';
import type { ColorValue } from 'react-native';

type Variant = 'filled' | 'outline';

export type IconProps = {
  name: string;
  size?: number;
  color?: ColorValue;
  variant?: Variant;
};

function resolveName(name: string, variant: Variant): string {
  if (variant !== 'outline') {
    return name;
  }
  if (name.endsWith('-outline')) {
    return name;
  }
  return `${name}-outline`;
}

export function Icon({
  name,
  size = 20,
  color,
  variant = 'filled',
}: IconProps): React.JSX.Element {
  const resolved = resolveName(name, variant) as MaterialDesignIconsIconName;
  return <MaterialDesignIcons name={resolved} size={size} color={color} />;
}
