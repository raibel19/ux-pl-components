import { createContext, useContext } from 'react';

import { InputTheme, InputType } from './types/types';

export interface InputContextType<Data = unknown> {
  data?: Data;
  disabled?: boolean;
  displayValue: string;
  errors: string[];
  id: string;
  initialValueRef: React.MutableRefObject<string>;
  isInvalid?: boolean;
  leftAddonWidth: string | number;
  maxLength?: number;
  rightAddonWidth: string | number;
  theme?: InputTheme;
  type: InputType;
  value: string;
  valueFormatted: string;
  onAddError: (key: string, value: string | string[]) => void;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onReset: (resetToInitialValue: boolean | undefined) => void;
  setLeftAddonWidth: (width: string | number) => void;
  setRightAddonWidth: (width: string | number) => void;
}

export const InputContext = createContext<InputContextType<unknown> | undefined>(undefined);

export const useInputContext = () => {
  const context = useContext(InputContext);
  if (context === undefined) {
    throw new Error('useInputContext debe ser usado dentro de un Input.Group');
  }
  return context;
};
