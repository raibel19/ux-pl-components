import { ForwardedRef, forwardRef, ReactNode, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '../../../lib/utils';
import autocompleteStyle from './autocomplete.module.css';
import {
  AutocompleteActionsContext,
  AutocompleteActionsContextProps,
  AutocompleteContext,
  AutocompleteContextProps,
} from './context';
import useManagedAutocomplete from './hooks/use-managed-autocomplete';
import useTheme from './hooks/use-theme';
import { IItem, AutocompleteStateChangePayload, AutocompleteTheme } from './types/types';

interface AutocompleteRootProps<Data> {
  children: ReactNode;
  className?: string;
  data?: Data;
  defaultValue?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  items: { data: IItem[]; searchValue: string | null };
  loading?: boolean;
  minLengthRequired?: number;
  mode?: 'async' | 'static';
  blurAction?: 'restore' | 'clear' | 'keep';
  reset?: boolean;
  resetOnReselect?: boolean;
  resetToInitialValue?: boolean;
  theme?: AutocompleteTheme;
  value?: string;
  onStateChange?: (payload: AutocompleteStateChangePayload<Data>) => void;
  setReset?: React.Dispatch<React.SetStateAction<boolean>>;
  subscribeIsInvalid?: (isInvalid: boolean) => void;
  // setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default forwardRef(function AutocompleteRoot<Data>(
  props: AutocompleteRootProps<Data>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const {
    children,
    className,
    data,
    defaultValue,
    disabled,
    isInvalid,
    items,
    loading = false,
    minLengthRequired = 0,
    mode = 'async',
    blurAction = 'restore',
    reset,
    resetOnReselect,
    resetToInitialValue,
    theme,
    value,
    // setLoading,
    onStateChange,
    setReset,
    subscribeIsInvalid,
  } = props;

  const id = useId();
  const { themeCore, themeStyle } = useTheme({ style: autocompleteStyle, theme });

  const [leftAddonWidth, setLeftAddonWidth] = useState<string | number>(0);
  const [rightAddonWidth, setRightAddonWidth] = useState<string | number>(0);
  const [isLoadingMounted, setIsLoadingMounted] = useState<boolean>(false);

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
    data,
    defaultValue,
    items,
    loading,
    minLengthRequired,
    mode,
    reset,
    resetOnReselect,
    resetToInitialValue,
    value,
    blurAction,
    onStateChange,
    setReset,
  });

  const isInvalidMemo = useMemo(() => isInvalid || Boolean(errors.length), [errors.length, isInvalid]);

  const contextValue = useMemo<AutocompleteContextProps>(
    () => ({
      filteredItems: state.filteredItems,
      initialValueRef,
      inputValue: state.inputValue,
      isInvalid: isInvalidMemo,
      isLoading: state.isLoading,
      isOpen: state.isOpen,
      isSearching: state.isSearching,
      lastValidSelection: state.lastValidSelection,
      leftAddonWidth,
      preSelectedValue: state.preSelectedValue,
      rightAddonWidth,
      selectedValue: state.selectedValue,
    }),
    [
      initialValueRef,
      isInvalidMemo,
      leftAddonWidth,
      rightAddonWidth,
      state.filteredItems,
      state.inputValue,
      state.isLoading,
      state.isOpen,
      state.isSearching,
      state.lastValidSelection,
      state.preSelectedValue,
      state.selectedValue,
    ],
  );

  const contextActionsValue = useMemo<AutocompleteActionsContextProps<Data>>(
    () => ({
      data,
      disabled,
      id,
      isLoadingMounted,
      minLengthRequired,
      theme,
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
      setIsLoadingMounted,
      setLeftAddonWidth,
      setRightAddonWidth,
      registerKeydownOverride,
    }),
    [
      data,
      disabled,
      id,
      isLoadingMounted,
      minLengthRequired,
      onBlur,
      onChange,
      onFocus,
      onMouseDown,
      onPreSelectItem,
      onReset,
      onSelectItem,
      onToogleLoading,
      onTooglePopover,
      onkeyDown,
      registerKeydownOverride,
      theme,
    ],
  );

  useEffect(() => {
    const id = setTimeout(() => {
      subscribeIsInvalid?.(isInvalidMemo);
    }, 200);

    return () => {
      clearTimeout(id);
    };
  }, [isInvalidMemo, subscribeIsInvalid]);

  // useEffect(() => {
  //   setLoading?.((prev) => {
  //     if (prev !== state.isLoading) return state.isLoading;
  //     return prev;
  //   });
  // }, [setLoading, state.isLoading]);

  useEffect(() => {
    console.log('Component-AutocompleteRoot');
  }, []);

  return (
    <div ref={ref} className={cn(themeCore, themeStyle, 'w-full space-y-1', className || null)}>
      <div className="relative w-full">
        <AutocompleteContext.Provider value={contextValue}>
          <AutocompleteActionsContext.Provider value={contextActionsValue}>
            {children}
          </AutocompleteActionsContext.Provider>
        </AutocompleteContext.Provider>
      </div>
    </div>
  );
}) as <Data>(props: AutocompleteRootProps<Data> & { ref?: ForwardedRef<HTMLDivElement> }) => React.JSX.Element;
