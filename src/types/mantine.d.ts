import type { DefaultMantineColor, Tuple } from '@mantine/core';

type ExtendedCustomColors =
  | 'company-primary'
  | 'company-secondary'
  | 'company-error'
  | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}
