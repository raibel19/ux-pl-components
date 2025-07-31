import { createContext, useContext } from 'react';

import { InputTheme, InputType } from './types/types';

export interface InputContextProps {
  displayValue: string;
  initialValueRef: React.MutableRefObject<string>;
  isInvalid?: boolean;
  leftAddonWidth: string | number;
  rightAddonWidth: string | number;
  value: string;
  valueFormatted: string;
}

export interface InputActionsContextProps<Data = unknown> {
  data?: Data;
  disabled?: boolean;
  errors: string[];
  id: string;
  maxLength?: number;
  theme?: InputTheme;
  type: InputType;
  onAddError: (key: string, value: string | string[]) => void;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onReset: (resetToInitialValue: boolean | undefined) => void;
  setLeftAddonWidth: (width: string | number) => void;
  setRightAddonWidth: (width: string | number) => void;
}

export const InputContext = createContext<InputContextProps | undefined>(undefined);
export const InputActionsContext = createContext<InputActionsContextProps<unknown> | undefined>(undefined);

export const useInputContext = () => {
  const context = useContext(InputContext);
  if (context === undefined) {
    throw new Error('useInputContext debe ser usado dentro de un Input.Root');
  }
  return context;
};

export const useInputActionsContext = () => {
  const context = useContext(InputActionsContext);
  if (context === undefined) {
    throw new Error('useInputActionsContext debe ser usado dentro de un Input.Root');
  }
  return context;
};
