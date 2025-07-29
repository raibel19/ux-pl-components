import { createContext, useContext } from 'react';

import { AutocompleteTheme, ItemsWithIdentifier } from './types/types';

export interface AutocompleteContextProps {
  filteredItems: Map<string, ItemsWithIdentifier>;
  initialValueRef: React.MutableRefObject<string>;
  inputValue: string;
  isInvalid?: boolean;
  isLoading: boolean;
  isOpen: boolean;
  leftAddonWidth: string | number;
  preSelectedValue: string | undefined;
  rightAddonWidth: string | number;
  selectedValue: ItemsWithIdentifier | null;
  isSearching: boolean;
}

export interface AutocompleteActionsContextProps<Data = unknown> {
  data?: Data;
  disabled?: boolean;
  id: string;
  isLoadingMounted: boolean;
  minLengthRequired: number;
  theme?: AutocompleteTheme;
  onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  onChange: (value: string) => void;
  onFocus: () => void;
  onkeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onMouseDown: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  onPreSelectItem: (value: string) => void;
  onReset: () => void;
  onSelectItem: (identifier: string, itemsToSearchIn?: Map<string, ItemsWithIdentifier>) => void;
  onToogleLoading: (value: boolean) => void;
  onTooglePopover: (value: boolean) => void;
  setIsLoadingMounted: (isMounted: boolean) => void;
  setLeftAddonWidth: (width: string | number) => void;
  setRightAddonWidth: (width: string | number) => void;
}

export const AutocompleteContext = createContext<AutocompleteContextProps | undefined>(undefined);
export const AutocompleteActionsContext = createContext<AutocompleteActionsContextProps<unknown> | undefined>(
  undefined,
);

export const useAutocompleteContext = () => {
  const context = useContext(AutocompleteContext);
  if (context === undefined) {
    throw new Error('useAutocompleteContext debe ser usado dentro de un Input.Group');
  }
  return context;
};

export const useAutocompleteActionsContext = () => {
  const context = useContext(AutocompleteActionsContext);
  if (context === undefined) {
    throw new Error('useAutocompleteActionsContext debe ser usado dentro de un Input.Group');
  }
  return context;
};
