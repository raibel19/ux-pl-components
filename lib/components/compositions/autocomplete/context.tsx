import { createContext, useContext } from 'react';

import { ItemsWithIdentifier } from './types/types';

export interface AutocompleteVolatileContextProps {
  filteredItems: Map<string, ItemsWithIdentifier>;
  inputValue: string;
  isLoading: boolean;
  isSearching: boolean;
  preSelectedValue: string | undefined;
}

export interface AutocompleteStableContextProps<Data = undefined> {
  data?: Data;
  disabled?: boolean;
  errors: string[];
  id: string;
  initialValueRef: React.MutableRefObject<string>;
  isInvalid?: boolean;
  isOpen: boolean;
  lastValidSelection: ItemsWithIdentifier | null;
  minLengthRequired: number;
  selectedValue: ItemsWithIdentifier | null;
}

export interface AutocompleteActionsContextProps {
  onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  onChange: (value: string) => void;
  onFocus: () => void;
  onkeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onMouseDown: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  onPreSelectItem: (value: string) => void;
  onReset: (options?: { closePopover?: boolean }) => void;
  onSelectItem: (identifier: string, itemsToSearchIn?: Map<string, ItemsWithIdentifier>) => void;
  onToogleLoading: (value: boolean) => void;
  onTooglePopover: (value: boolean) => void;
  registerKeydownOverride: (key: string, handler: (event: React.KeyboardEvent<HTMLInputElement>) => void) => () => void;
}

export interface AutocompleteLayoutContextProps {
  leftAddonWidth: string | number;
  rightAddonWidth: string | number;
  setLeftAddonWidth: (width: string | number) => void;
  setRightAddonWidth: (width: string | number) => void;
}

export const AutocompleteVolatileContext = createContext<AutocompleteVolatileContextProps | undefined>(undefined);
export const AutocompleteStableContext = createContext<AutocompleteStableContextProps<unknown> | undefined>(undefined);
export const AutocompleteActionsContext = createContext<AutocompleteActionsContextProps | undefined>(undefined);
export const AutocompleteLayoutContext = createContext<AutocompleteLayoutContextProps | undefined>(undefined);

export function useAutocompleteVolatileContext() {
  const context = useContext(AutocompleteVolatileContext);
  if (context === undefined) {
    throw new Error('useAutocompleteVolatileContext debe ser usado dentro de un componente <Autocomplete>');
  }
  return context;
}

export function useAutocompleteStableContext<Data = undefined>() {
  const context = useContext(AutocompleteStableContext) as AutocompleteStableContextProps<Data> | undefined;

  if (context === undefined) {
    throw new Error('useAutocompleteStableContext debe ser usado dentro de un componente <Autocomplete>');
  }

  return context;
}

export function useAutocompleteActionsContext() {
  const context = useContext(AutocompleteActionsContext);

  if (context === undefined) {
    throw new Error('useAutocompleteActionsContext debe ser usado dentro de un componente <Autocomplete>');
  }

  return context;
}

export function useAutocompleteLayoutContext() {
  const context = useContext(AutocompleteLayoutContext);

  if (context === undefined) {
    throw new Error('useAutocompleteLayoutContext debe ser usado dentro de un componente <Autocomplete>');
  }

  return context;
}
