export type AutocompleteStateChangePayload<Data = unknown> = {
  type: 'INPUT_CHANGE' | 'ITEM_SELECTED' | 'RESET';
  data: Data | undefined;
  initialValue: string;
  inputValue: string;
  selectedValue: string;
};

export type AutocompleteTheme = 'default' | 'inherit' | (string & {});

export interface IItem {
  label: string;
  value: string;
  disabled?: boolean;
  render?: (props: { item: IItem; isSelected: boolean; children: React.ReactNode }) => React.ReactNode;
}

export type ItemsWithIdentifier = IItem & { identifier: string };

export type ErrorState = Map<string, string>;

export type ErrorAction =
  | { type: 'ADD_ERROR'; payload: { key: string; message: string | string[] } }
  | { type: 'REMOVE_ERROR'; payload: { key: string } }
  | { type: 'CLEAR_ERRORS' };

export const ErrorKeys = Object.freeze({
  custom: 'custom',
});

export interface IAutocompleteState {
  filteredItems: Map<string, ItemsWithIdentifier>;
  inputValue: string;
  isLoading: boolean;
  isOpen: boolean;
  preSelectedValue: string;
  selectedValue: ItemsWithIdentifier | null;
  isSearching: boolean;
  lastValidSelection: ItemsWithIdentifier | null;
}

export type AutocompleteAction =
  | { type: 'SET_INPUT_VALUE'; payload: { value: string; openPopover: boolean } }
  | { type: 'SELECT_ITEM'; payload: ItemsWithIdentifier }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'OPEN_POPOVER' }
  | { type: 'CLOSE_POPOVER' }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_FILTERED_ITEMS'; payload: Map<string, ItemsWithIdentifier> }
  | { type: 'SET_PRE_SELECTION_VALUE'; payload: string }
  | { type: 'SET_IS_SEARCHING'; payload: boolean };

export const nonOpeningKeys = [
  // Modificadores (no abren por sí solos)
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'CapsLock',
  'NumLock',
  // Navegación
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Tab',
  // Teclas de Función
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  // Enter y Escape
  'Enter',
  'Escape',
];
