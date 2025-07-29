import { useMemo } from 'react';

import { AutocompleteTheme } from '../types/types';

interface useThemeProps {
  style: CSSModuleClasses;
  theme?: AutocompleteTheme;
}
export default function useTheme(props: useThemeProps) {
  const { style, theme } = props;

  const themeCore = style['autocomplete-core'];
  const themeStyle = useMemo(() => {
    switch (theme) {
      case 'default':
        return style['autocomplete-theme-default'];
      case 'inherit':
        return '';
      default:
        return theme ?? '';
    }
  }, [style, theme]);

  return {
    themeCore,
    themeStyle,
  };
}
