import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '../../../lib/utils';
import {
  AutocompleteActionsContext,
  AutocompleteActionsContextProps,
  AutocompleteLayoutContext,
  AutocompleteLayoutContextProps,
  AutocompleteStableContext,
  AutocompleteStableContextProps,
  AutocompleteVolatileContext,
  AutocompleteVolatileContextProps,
} from './context';
import useManagedAutocomplete from './hooks/use-managed-autocomplete';
import { AutocompleteStateChangePayload, IItem, Items } from './types/types';

interface BaseAutocompleteRootProps<Data = undefined> {
  blurAction?: 'restore' | 'clear'; // | 'keep';
  children: ReactNode;
  className?: string;
  data?: Data;
  disabled?: boolean;
  isInvalid?: boolean;
  items: Items;
  minLengthRequired?: number;
  reset?: boolean;
  resetOnReselect?: boolean;
  onStateChange?: (payload: AutocompleteStateChangePayload<Data>) => void;
  setReset?: React.Dispatch<React.SetStateAction<boolean>>;
  subscribeIsInvalid?: (isInvalid: boolean) => void;
}

type DataState<Data> = { data: Data } | { data?: never };

type ControlledState =
  | {
      value: string;
      defaultValue?: never;
    }
  | {
      value?: never;
      defaultValue: string;
    }
  | {
      value?: never;
      defaultValue?: never;
    };

export type AutocompleteRootProps<Data = undefined> = BaseAutocompleteRootProps<Data> &
  DataState<Data> &
  ControlledState &
  (
    | {
        mode: 'async';
        loading?: boolean;
      }
    | {
        mode: 'static';
        caseSensitive?: boolean;
        filterItems?: (items: IItem[], inputValue: string) => IItem[];
      }
  );

export default forwardRef(function AutocompleteRoot<Data = undefined>(
  props: AutocompleteRootProps<Data>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const {
    blurAction = 'restore',
    children,
    className,
    data,
    defaultValue,
    disabled,
    isInvalid,
    items,
    minLengthRequired = 0,
    mode = 'async',
    reset,
    resetOnReselect,
    value,
    onStateChange,
    setReset,
    subscribeIsInvalid,
  } = props;

  const loading = props.mode === 'async' ? (props.loading ?? false) : false;
  const filterItems = props.mode === 'static' ? props.filterItems : undefined;
  const caseSensitive = props.mode === 'static' ? props.caseSensitive : undefined;

  const id = useId();

  const [leftAddonWidth, setLeftAddonWidth] = useState<string | number>(0);
  const [rightAddonWidth, setRightAddonWidth] = useState<string | number>(0);

  const propsRef = useRef({ subscribeIsInvalid });

  const {
    errors,
    initialValueRef,
    state,
    onBlur,
    onChange,
    onFocus,
    onkeyDown,
    onMouseDown,
    onPreSelectItem,
    onReset,
    onSelectItem,
    onToogleLoading,
    onTooglePopover,
    registerKeydownOverride,
  } = useManagedAutocomplete<Data>({
    blurAction,
    caseSensitive,
    data,
    defaultValue,
    items,
    loading,
    minLengthRequired,
    mode,
    reset,
    resetOnReselect,
    value,
    filterItems,
    onStateChange,
    setReset,
  });

  const isInvalidMemo = useMemo(() => isInvalid || Boolean(errors.length), [errors.length, isInvalid]);

  const contextVolatileValue = useMemo<AutocompleteVolatileContextProps>(
    () => ({
      filteredItems: state.filteredItems,
      inputValue: state.inputValue,
      isLoading: state.isLoading,
      isSearching: state.isSearching,
      preSelectedValue: state.preSelectedValue,
    }),
    [state.filteredItems, state.inputValue, state.isLoading, state.isSearching, state.preSelectedValue],
  );

  const contextStableValue = useMemo<AutocompleteStableContextProps<Data>>(
    () => ({
      data,
      disabled,
      errors,
      id,
      initialValueRef,
      isInvalid: isInvalidMemo,
      isOpen: state.isOpen,
      lastValidSelection: state.lastValidSelection,
      minLengthRequired,
      selectedValue: state.selectedValue,
    }),
    [
      data,
      disabled,
      errors,
      id,
      initialValueRef,
      isInvalidMemo,
      minLengthRequired,
      state.isOpen,
      state.lastValidSelection,
      state.selectedValue,
    ],
  );

  const contextActionsValue = useMemo<AutocompleteActionsContextProps>(
    () => ({
      onBlur,
      onChange,
      onFocus,
      onkeyDown,
      onMouseDown,
      onPreSelectItem,
      onReset,
      onSelectItem,
      onToogleLoading,
      onTooglePopover,
      registerKeydownOverride,
    }),
    [
      onBlur,
      onChange,
      onFocus,
      onkeyDown,
      onMouseDown,
      onPreSelectItem,
      onReset,
      onSelectItem,
      onToogleLoading,
      onTooglePopover,
      registerKeydownOverride,
    ],
  );

  const constextLayoutValue = useMemo<AutocompleteLayoutContextProps>(
    () => ({ leftAddonWidth, rightAddonWidth, setLeftAddonWidth, setRightAddonWidth }),
    [leftAddonWidth, rightAddonWidth],
  );

  useLayoutEffect(() => {
    propsRef.current = { subscribeIsInvalid };
  }, [subscribeIsInvalid]);

  useEffect(() => {
    const id = setTimeout(() => {
      propsRef.current.subscribeIsInvalid?.(isInvalidMemo);
    }, 200);

    return () => {
      clearTimeout(id);
    };
  }, [isInvalidMemo]);

  return (
    <div ref={ref} className={cn('w-full space-y-1', className || null)}>
      <div className="relative w-full">
        <AutocompleteLayoutContext.Provider value={constextLayoutValue}>
          <AutocompleteStableContext.Provider value={contextStableValue}>
            <AutocompleteVolatileContext.Provider value={contextVolatileValue}>
              <AutocompleteActionsContext.Provider value={contextActionsValue}>
                {children}
              </AutocompleteActionsContext.Provider>
            </AutocompleteVolatileContext.Provider>
          </AutocompleteStableContext.Provider>
        </AutocompleteLayoutContext.Provider>
      </div>
    </div>
  );
}) as <Data = undefined>(
  props: AutocompleteRootProps<Data> & { ref?: ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
