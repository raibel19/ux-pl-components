import { useMemo } from 'react';

import { InputTheme } from '../types/types';

interface useThemeProps {
  style: CSSModuleClasses;
  theme?: InputTheme;
}
export default function useTheme(props: useThemeProps) {
  const { style, theme } = props;

  const themeCore = style['input-core'];
  const themeStyle = useMemo(() => {
    switch (theme) {
      case 'default':
        return style['input-theme-default'];
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
