import { createContext, useContext } from 'react';

import { InputType } from './types/types';

export interface InputVolatileContextProps {
  displayValue: string;
  value: string;
  valueFormatted: string;
}

export interface InputStableContextProps<Data = undefined> {
  data?: Data;
  disabled?: boolean;
  errors: string[];
  id: string;
  initialValueRef: React.MutableRefObject<string>;
  isInvalid?: boolean;
  maxLength?: number;
  type: InputType;
}

export interface InputActionsContextProps {
  isPartialNumber: (value: string) => boolean;
  onAddError: (key: string, value: string) => void;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onReset: (resetToInitialValue: boolean | undefined) => void;
}

export interface InputLayoutContextProps {
  leftAddonWidth: string | number;
  rightAddonWidth: string | number;
  setLeftAddonWidth: (width: string | number) => void;
  setRightAddonWidth: (width: string | number) => void;
}

export const InputVolatileContext = createContext<InputVolatileContextProps | undefined>(undefined);
export const InputStableContext = createContext<InputStableContextProps<unknown> | undefined>(undefined);
export const InputActionsContext = createContext<InputActionsContextProps | undefined>(undefined);
export const InputLayoutContext = createContext<InputLayoutContextProps | undefined>(undefined);

export function useInputVolatileContext() {
  const context = useContext(InputVolatileContext);
  if (context === undefined) {
    throw new Error('useInputVolatileContext debe ser usado dentro de un componente <Input>');
  }
  return context;
}

export function useInputStableContext<Data = undefined>() {
  const context = useContext(InputStableContext) as InputStableContextProps<Data> | undefined;
  if (context === undefined) {
    throw new Error('useInputStableContext debe ser usado dentro de un componente <Input>');
  }
  return context;
}

export function useInputActionsContext() {
  const context = useContext(InputActionsContext);
  if (context === undefined) {
    throw new Error('useInputActionsContext debe ser usado dentro de un componente <Input>');
  }
  return context;
}

export function useInputLayoutContext() {
  const context = useContext(InputLayoutContext);
  if (context === undefined) {
    throw new Error('useInputLayopoutContext debe ser usado dentro de un Input.Root');
  }
  return context;
}
