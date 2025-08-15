import { equals } from 'ux-pl/utils/object';

import { AutocompleteAction, ErrorAction, ErrorState, IAutocompleteState, ItemsWithIdentifier } from '../types/types';

export function autocompleteReduce(state: IAutocompleteState, action: AutocompleteAction): IAutocompleteState {
  switch (action.type) {
    case 'SET_INPUT_VALUE': {
      if (action.payload.value === state.inputValue) return state;

      return {
        ...state,
        inputValue: action.payload.value,
        selectedValue: null,
        isOpen: action.payload.openPopover,
        preSelectedValue: '',
      };
    }
    case 'SELECT_ITEM': {
      if (state.selectedValue && equals(action.payload, state.selectedValue)) {
        return state;
      }

      return {
        ...state,
        inputValue: action.payload.label,
        selectedValue: action.payload,
        isOpen: false,
        preSelectedValue: action.payload.identifier,
        lastValidSelection: action.payload,
      };
    }
    case 'CLEAR_SELECTION': {
      if (state.inputValue === '' && state.selectedValue === null && !state.isOpen) return state;

      return {
        ...state,
        inputValue: '',
        selectedValue: null,
        isOpen: false,
        preSelectedValue: '',
        isSearching: false,
        lastValidSelection: null,
      };
    }
    case 'OPEN_POPOVER': {
      if (state.isOpen) return state;

      return {
        ...state,
        isOpen: true,
      };
    }
    case 'CLOSE_POPOVER': {
      if (!state.isOpen) return state;

      return {
        ...state,
        isOpen: false,
      };
    }
    case 'SET_IS_LOADING': {
      if (action.payload === state.isLoading) return state;

      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case 'SET_FILTERED_ITEMS': {
      if (state.filteredItems.size === 0 && action.payload.size === 0) return state;
      const isEquals = equals(state.filteredItems, action.payload);

      if (isEquals) return state;

      return {
        ...state,
        filteredItems: action.payload,
      };
    }
    case 'SET_PRE_SELECTION_VALUE': {
      if (action.payload === state.preSelectedValue) return state;

      return {
        ...state,
        preSelectedValue: action.payload,
      };
    }
    case 'SET_IS_SEARCHING': {
      if (action.payload === state.isSearching) return state;

      return {
        ...state,
        isSearching: action.payload,
      };
    }
  }
}

export function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case 'ADD_ERROR': {
      const { key, message } = action.payload;

      if (state.get(key) === message || message === '') return state;

      const newState = new Map(state);
      newState.set(key, message);
      return newState;
    }
    case 'REMOVE_ERROR': {
      const { key } = action.payload;

      if (!state.has(key)) return state;

      const newState = new Map(state);
      newState.delete(key);
      return newState;
    }
    case 'CLEAR_ERRORS': {
      if (!state.size) return state;
      return new Map();
    }
    default:
      return state;
  }
}

export function findMatchingItem(
  value: string,
  items: Map<string, ItemsWithIdentifier>,
): ItemsWithIdentifier | undefined {
  if (!value || !items.size) return undefined;

  return Array.from(items.values()).find((item) => item.label.trim().toLowerCase() === value.trim().toLowerCase());
}

export function formatStr(value: string | undefined): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
