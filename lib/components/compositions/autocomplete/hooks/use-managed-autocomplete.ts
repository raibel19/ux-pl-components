import { djb2Hash } from '@pl-core/utils/hash';
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react';

import useControllableState from '../../../hooks/use-controllable-state';
import {
  IAutocompleteState,
  IItem,
  AutocompleteStateChangePayload,
  ItemsWithIdentifier,
  nonOpeningKeys,
  Actions,
} from '../types/types';
import { autocompleteReduce, errorReducer, findMatchingItem, formatStr } from '../utils/utils';
import useLoading from './use-loading';

interface UseManagedAutocompleteProps<Data = undefined> {
  blurAction: 'restore' | 'clear' | 'keep';
  caseSensitive?: boolean;
  data?: Data;
  defaultValue?: string;
  items: { data: IItem[]; searchValue: string | null };
  loading: boolean;
  minLengthRequired: number;
  mode: 'async' | 'static';
  reset?: boolean;
  resetOnReselect?: boolean;
  value?: string;
  filterItems?: (items: IItem[], inputValue: string) => IItem[];
  onStateChange?: (payload: AutocompleteStateChangePayload<Data>) => void;
  setReset?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useManagedAutocomplete<Data = undefined>(props: UseManagedAutocompleteProps<Data>) {
  const { defaultValue, items: itemsProps, reset, value: controlledValue, loading: loadingRaw, setReset } = props;

  const propsRef = useRef(props);
  const itemsCache = useRef<Map<string, string>>(new Map());
  const isControlledUpdateRef = useRef(false);
  const keyDownOverrides = useRef<Map<string, (event: React.KeyboardEvent<HTMLInputElement>) => void>>(new Map());
  const actionRef = useRef<Actions | null>(null);
  const lastUserInputValueRef = useRef<string | null>(null);
  const initialValueRef = useRef<string>(controlledValue ?? defaultValue ?? '');
  const lastRequestRef = useRef<string>('');

  const loading = useLoading({ delay: 150, isLoading: loadingRaw });

  const format = useCallback(
    (value: string | undefined | null) => formatStr(value, propsRef.current.caseSensitive),
    [],
  );

  const processRawItems = useCallback<(source: IItem[]) => Map<string, ItemsWithIdentifier>>((source) => {
    const processedItems = source.map<[string, ItemsWithIdentifier]>((item) => {
      const safeLabel = String(item.label || '').trim();
      const safeValue = String(item.value || '').trim();
      const key = `${safeLabel}-${safeValue}`;
      let identifier = itemsCache.current.get(key);

      if (!identifier) {
        identifier = djb2Hash(key);

        if (itemsCache.current.size > 3000) {
          const oldestKey = itemsCache.current.keys().next().value;
          if (oldestKey) itemsCache.current.delete(oldestKey);
        }

        itemsCache.current.set(key, identifier);
      }
      return [identifier, { ...item, identifier }];
    });

    return new Map(processedItems);
  }, []);

  const registerKeydownOverride = useCallback(
    (key: string, handler: (event: React.KeyboardEvent<HTMLInputElement>) => void) => {
      keyDownOverrides.current.set(key, handler);

      return () => {
        keyDownOverrides.current.delete(key);
      };
    },
    [],
  );

  const onChangeControllableState = useCallback((newValue: string) => {
    const { data, onStateChange } = propsRef.current;
    const { lastValidSelection } = stateRef.current;

    const action = actionRef.current;

    if (!action) {
      return;
    }

    actionRef.current = null;

    onStateChange?.({
      type: action,
      data: data as Data,
      initialValue: initialValueRef.current,
      inputValue: newValue,
      selectedValue: lastValidSelection?.value ?? '',
    });
  }, []);

  const {
    value: currentValue,
    setValue: setCurrentValue,
    isControlled,
  } = useControllableState<string>({
    defaultValue: defaultValue ?? '',
    onChange: onChangeControllableState,
    value: controlledValue,
  });

  const [errors, dispatchError] = useReducer(errorReducer, new Map());
  const [state, dispatch] = useReducer(
    autocompleteReduce,
    { ...props, value: currentValue },
    (): IAutocompleteState => {
      const initialItems = processRawItems(itemsProps.data);
      const matchingItems = findMatchingItem(currentValue, initialItems, propsRef.current.caseSensitive);

      return {
        inputValue: currentValue,
        selectedValue: matchingItems ?? null,
        isOpen: false,
        isLoading: false,
        filteredItems: initialItems,
        preSelectedValue: matchingItems?.identifier ?? '',
        isSearching: false,
        lastValidSelection: matchingItems ?? null,
      };
    },
  );
  const stateRef = useRef(state);

  const handleTooglePopover = useCallback(
    (value: boolean) => dispatch({ type: value ? 'OPEN_POPOVER' : 'CLOSE_POPOVER' }),
    [],
  );

  const handleToggleLoading = useCallback((value: boolean) => dispatch({ type: 'SET_IS_LOADING', payload: value }), []);

  const handleToggleSearching = useCallback(
    (value: boolean) => dispatch({ type: 'SET_IS_SEARCHING', payload: value }),
    [],
  );

  const handleSetFilteredItems = useCallback(
    (items: IItem[]) => {
      const processItems = processRawItems(items);
      dispatch({ type: 'SET_FILTERED_ITEMS', payload: processItems });
      return processItems;
    },
    [processRawItems],
  );

  const handleOnPreSelected = useCallback(
    (value: string) => dispatch({ type: 'SET_PRE_SELECTION_VALUE', payload: value }),
    [],
  );

  const handleReset = useCallback(
    (options?: { closePopover?: boolean }) => {
      const { closePopover = true } = options || {};

      if (closePopover) handleTooglePopover(false);

      dispatchError({ type: 'CLEAR_ERRORS' });
      dispatch({ type: 'CLEAR_SELECTION' });

      lastRequestRef.current = '';
      lastUserInputValueRef.current = '';
      actionRef.current = 'RESET';
      setCurrentValue('');
    },
    [handleTooglePopover, setCurrentValue],
  );

  /**
   * Maneja la selección de un item, ya sea por una acción del usuario o por una actualización controlada.
   * @param {string} identifier - El identificador único del item a seleccionar.
   * @param {Map<string, ItemsWithIdentifier>} [itemsToSearchIn] - Opcional. La colección de items sobre la cual buscar. Si no se provee, se usa la lista del estado actual.
   * @param {'selected' | 'controller'} [action='selected'] - El contexto de la selección. 'selected' para interacciones del usuario (clic, Enter), 'controller' para actualizaciones programáticas.
   */
  const handleOnSelect = useCallback(
    (
      identifier: string,
      itemsToSearchIn?: Map<string, ItemsWithIdentifier>,
      action: 'selected' | 'controller' = 'selected',
    ) => {
      const { selectedValue, filteredItems } = stateRef.current;
      const { resetOnReselect } = propsRef.current;
      const selectedIdentifier = selectedValue?.identifier;

      if (identifier === selectedIdentifier) {
        // La lógica de 'resetOnReselect' solo debe aplicarse a interacciones directas del usuario.
        if (resetOnReselect && action === 'selected') handleReset();
        // Si la acción fue del usuario ('selected'), es una operación nula (no-op).
        // Se detiene la ejecución para no disparar eventos redundantes.
        if (action === 'selected') return;
        // Si la acción es 'controller', se permite deliberadamente que la función continúe.
        // Esto garantiza que el padre siempre reciba una confirmación 'ITEM_SELECTED'
        // después de una actualización programática, incluso si el valor es el mismo.
      }

      const items = itemsToSearchIn || filteredItems;
      const item = items.get(identifier);
      if (!item) return;

      const openPopover = action === 'controller' && stateRef.current.isOpen ? true : false;
      dispatch({ type: 'SELECT_ITEM', payload: { items: item, openPopover } });
      lastRequestRef.current = item.label;

      if (action === 'selected') {
        lastUserInputValueRef.current = item.label;
        actionRef.current = 'ITEM_SELECTED';
      } else {
        actionRef.current = null;
      }

      setCurrentValue(item.label);
    },
    [handleReset, setCurrentValue],
  );

  const applyItemsAndSelect = useCallback(
    (items: IItem[]) => {
      isControlledUpdateRef.current = false;
      const { inputValue } = stateRef.current;
      const processItems = handleSetFilteredItems(items);
      const matchingItems = findMatchingItem(inputValue, processItems, propsRef.current.caseSensitive);
      if (matchingItems) handleOnSelect(matchingItems.identifier, processItems, 'controller');
    },
    [handleOnSelect, handleSetFilteredItems],
  );

  const handleStaticFilter = useCallback(
    (items: IItem[], inputValue: string) => {
      const { mode, filterItems, minLengthRequired } = propsRef.current;

      if (mode !== 'static') return;

      if (inputValue.length < minLengthRequired) {
        handleSetFilteredItems([]);
        return;
      }

      let newItems: IItem[] = [];

      if (typeof filterItems === 'function') {
        const filtered = filterItems(items, inputValue);
        newItems = filtered;
      } else {
        if (!inputValue) {
          newItems = items;
        } else {
          const formatInputValue = format(inputValue);
          newItems = items.filter((item) => format(item.label).includes(formatInputValue));
        }
      }

      const fn = isControlledUpdateRef.current ? applyItemsAndSelect : handleSetFilteredItems;
      fn(newItems);
    },
    [applyItemsAndSelect, format, handleSetFilteredItems],
  );

  const handleChange = useCallback(
    (value: string) => {
      const { minLengthRequired, mode } = propsRef.current;

      if (mode === 'async') {
        handleToggleSearching(value.length >= minLengthRequired);
      }

      lastRequestRef.current = value;
      lastUserInputValueRef.current = value;
      actionRef.current = 'INPUT_CHANGE';
      setCurrentValue(value);
    },
    [handleToggleSearching, setCurrentValue],
  );

  const handleOpenAndRepopulate = useCallback(() => {
    const { minLengthRequired, mode, items } = propsRef.current;
    const { inputValue, selectedValue } = stateRef.current;

    if (inputValue.length < minLengthRequired) {
      return;
    }

    if (mode === 'static') {
      handleStaticFilter(items.data, inputValue);
    } else {
      const isResponseIrrelevantToInput = format(inputValue) !== format(items.searchValue ?? '');
      handleSetFilteredItems(isResponseIrrelevantToInput ? [] : items.data);
    }

    const currentSelectedValue = selectedValue;
    if (currentSelectedValue) {
      lastRequestRef.current = currentSelectedValue.label;
      handleOnPreSelected(currentSelectedValue.identifier);
    }
  }, [format, handleOnPreSelected, handleSetFilteredItems, handleStaticFilter]);

  const handleOnkeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;

      if (keyDownOverrides.current.has(key)) {
        keyDownOverrides.current.get(key)!(event);
        return;
      }

      if (key !== 'Enter') {
        if (!nonOpeningKeys.includes(key)) handleTooglePopover(true);
        return;
      }

      event.preventDefault();
      handleTooglePopover(false);

      const preselectValue = stateRef.current.preSelectedValue;
      if (preselectValue) handleOnSelect(preselectValue);
    },
    [handleOnSelect, handleTooglePopover],
  );

  const handleOnMouseDown = useCallback(() => handleOpenAndRepopulate(), [handleOpenAndRepopulate]);

  const handleOnFocus = useCallback(() => handleOpenAndRepopulate(), [handleOpenAndRepopulate]);

  const handleOnBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      const { blurAction } = propsRef.current;
      const { inputValue, lastValidSelection } = stateRef.current;

      const hasCmdkInput = event.relatedTarget?.hasAttribute?.('cmdk-input');

      if (!hasCmdkInput && format(inputValue) !== format(lastValidSelection?.label)) {
        switch (blurAction) {
          case 'restore':
            if (lastValidSelection) {
              dispatch({ type: 'SELECT_ITEM', payload: { items: lastValidSelection, openPopover: false } });

              lastRequestRef.current = lastValidSelection.label;
              // lastUserInputValueRef.current = lastValidSelection.label;
              actionRef.current = 'INPUT_CHANGE';
              setCurrentValue(lastValidSelection.label);
            } else {
              handleReset();
            }
            break;
          case 'clear':
            handleReset();
            break;
          case 'keep':
            break;
        }
      }
    },
    [format, handleReset, setCurrentValue],
  );

  useLayoutEffect(() => {
    propsRef.current = props;
    stateRef.current = state;
  }, [props, state]);

  useEffect(() => {
    if (currentValue === stateRef.current.inputValue) return;

    const wasUserInteraction = format(lastUserInputValueRef.current) === format(currentValue);
    lastUserInputValueRef.current = null;

    const { mode } = propsRef.current;
    let clearItems = false;

    if (mode === 'async') {
      clearItems = true;
    }

    if (wasUserInteraction) {
      dispatch({ type: 'SET_INPUT_VALUE', payload: { value: currentValue, openPopover: true, clearItems } });
    } else {
      isControlledUpdateRef.current = true;
      lastRequestRef.current = currentValue;

      dispatch({ type: 'SET_INPUT_VALUE', payload: { value: currentValue, openPopover: false, clearItems } });
    }
  }, [currentValue, format]);

  useEffect(() => {
    const { minLengthRequired, mode } = propsRef.current;

    if (mode !== 'async') return;

    const { inputValue } = stateRef.current;
    const searchValue = itemsProps.searchValue;
    const newItems = itemsProps.data;

    handleToggleLoading(loading);

    if (loading) {
      handleToggleSearching(true);
      return;
    }

    const fn = isControlledUpdateRef.current ? applyItemsAndSelect : handleSetFilteredItems;

    if (inputValue.length < minLengthRequired) {
      fn([]);
      handleToggleSearching(false);
      return;
    }

    if (searchValue === null) {
      fn(newItems);
      handleToggleSearching(false);
      return;
    }

    const isObsoleteRequest = searchValue !== null && format(searchValue) !== format(lastRequestRef.current);
    const isResponseIrrelevantToInput = format(inputValue) !== format(searchValue ?? '');

    if (isObsoleteRequest || isResponseIrrelevantToInput) {
      fn([]);
      return;
    }

    fn(newItems);
    handleToggleSearching(false);
  }, [
    applyItemsAndSelect,
    format,
    handleSetFilteredItems,
    handleToggleLoading,
    handleToggleSearching,
    itemsProps.data,
    itemsProps.searchValue,
    loading,
  ]);

  useEffect(() => {
    const { mode } = propsRef.current;

    if (mode !== 'static') return;

    const inputValue = state.inputValue;
    const items = itemsProps.data;
    handleStaticFilter(items, inputValue);
  }, [handleStaticFilter, itemsProps.data, state.inputValue]);

  useEffect(() => {
    if (reset && setReset) {
      setReset(false);
      handleReset();
    }
  }, [handleReset, reset, setReset]);

  useEffect(() => {
    if (isControlled && defaultValue !== undefined) {
      console.warn(
        `useManagedAutocomplete: Se están proporcionando las props 'value' y 'defaultValue' a un Autocomplete. Un componente no puede ser controlado y no controlado a la vez. Se dará prioridad a 'value'.`,
      );
    }
  }, [isControlled, defaultValue]);

  return {
    errors: Array.from(errors.values()),
    initialValueRef,
    state,
    onBlur: handleOnBlur,
    onChange: handleChange,
    onDispatchError: dispatchError,
    onFocus: handleOnFocus,
    onkeyDown: handleOnkeyDown,
    onMouseDown: handleOnMouseDown,
    onPreSelectItem: handleOnPreSelected,
    onReset: handleReset,
    onSelectItem: handleOnSelect,
    onToogleLoading: handleToggleLoading,
    onTooglePopover: handleTooglePopover,
    registerKeydownOverride,
  };
}
