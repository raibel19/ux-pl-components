import { Command as CommandPrimitive } from 'cmdk';
import { Loader2 } from 'lucide-react';
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { djb2Hash } from 'ux-pl/utils/hash';
import { equals } from 'ux-pl/utils/object';

import { Command, CommandEmpty, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent } from '@/components/ui/popover';

import { cn } from '@/lib/utils';

import inputStyle from '../input.module.css';
import {
  AutocompleteForwardRefType,
  IAutocompleteInputForwardRefType,
  IAutocompleteInputProps,
  IAutocompleteItemsExtend,
  IAutocompleteProps,
  IResetFnc,
} from '../interfaces/internals';
import AutocompleteInput from './autocomplete-input';
import AutocompleteList from './autocomplete-list';
import AautocompleteListHeader from './autocomplete-list-header';
import AutocompleteListVirtualizer from './autocomplete-list-virtualizer';

export default forwardRef(function Autocomplete<Data, AutoCompData extends string>(
  props: IAutocompleteProps<Data, AutoCompData>,
  ref?: ForwardedRef<AutocompleteForwardRefType>,
) {
  const {
    data,
    handleBlurInput,
    handleFocusInput,
    resetInput: resetInputFnc,
    setInputValue,
    setIsFirstRender,
    validateStringLength,
    valueInput,
    nativeInputsProps,
    variantIsError,
    variantLeftElement,
    classNameInput,
    leftWidth,
    rightWidth,
    theme,
  } = props;

  const {
    classNamePopover,
    classNamePopoverHeader,
    classNamePopoverScrollArea,
    isLoading,
    itemIconSelected,
    items,
    messages,
    minLengthRequired,
    onBlurConfig,
    resetOnSameItem,
    setInputSelected,
    showIconSelected,
    showLoading,
    showMessages,
    virtualizeSuggestionsList,
  } = data;

  const minLingthValue = minLengthRequired ?? 0;

  const [inputSelectedValueState, setInputSelectedValueState] = useState<string>('');
  const [openState, setOpenState] = useState<boolean>(false);
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);
  const [itemsState, setItemsState] = useState<Map<string, IAutocompleteItemsExtend<AutoCompData>>>(new Map());
  const [commandValueState, setCommandValueState] = useState<string>('');

  const prevInputSelectedValueRef = useRef<string>('');
  const itemsCache = useRef<Map<string, string>>(new Map());
  const autocompleteInputRef = useRef<IAutocompleteInputForwardRefType>(null);

  const baseStyle = inputStyle.baseStyle;
  const themeStyle = useMemo(() => {
    switch (theme) {
      case 'default':
        return '';
      default:
        return theme ?? '';
    }
  }, [theme]);

  const autocompletePropsMemo = useMemo(
    (): IAutocompleteInputProps<Data, AutoCompData>['autocompleteProps'] => ({
      classNameInput,
      handleBlurInput,
      handleFocusInput,
      leftWidth,
      nativeInputsProps,
      rightWidth,
      setInputValue,
      setIsFirstRender,
      validateStringLength,
      valueInput,
      variantIsError,
      variantLeftElement,
    }),
    [
      classNameInput,
      handleBlurInput,
      handleFocusInput,
      leftWidth,
      nativeInputsProps,
      rightWidth,
      setInputValue,
      setIsFirstRender,
      validateStringLength,
      valueInput,
      variantIsError,
      variantLeftElement,
    ],
  );

  useImperativeHandle(ref, () => {
    return {
      element: autocompleteInputRef.current?.element ?? null,
      reset: (resetInput, resetOpen) => reset({ resetInput, resetOpen }),
    };
  });

  const setInputSelectedValueFnc = useCallback((value: string) => {
    setInputSelectedValueState((prev) => {
      if (prev !== value) return value;
      return prev;
    });
  }, []);

  const setOpenFnc = useCallback(
    (value: boolean | undefined, func: ((prev: boolean) => boolean | undefined | void) | undefined = undefined) => {
      setOpenState((prev) => {
        const fncValue = func?.(prev);
        if (typeof fncValue === 'boolean') return fncValue;
        if (value === undefined) return prev;
        if (prev !== value) return value;
        return prev;
      });
    },
    [],
  );

  const setIsLoadingFnc = useCallback(
    (value: boolean) => {
      if (!showLoading) {
        setIsLoadingState(false);
        return;
      }
      setIsLoadingState(value);
    },
    [showLoading],
  );

  const reset = useCallback(
    ({ resetInput, resetOpen }: IResetFnc = {}) => {
      prevInputSelectedValueRef.current = '';
      setInputSelectedValueFnc('');
      if (resetInput) resetInputFnc();
      if (resetOpen) setOpenFnc(false);
    },
    [resetInputFnc, setInputSelectedValueFnc, setOpenFnc],
  );

  const handleOnSelect = useCallback(
    (identifier: string) => {
      // console.log('handleOnSelect');
      if (identifier === inputSelectedValueState && resetOnSameItem) {
        reset({ resetInput: true, resetOpen: true });
        return;
      }

      if (identifier !== inputSelectedValueState) {
        setInputSelectedValueFnc(identifier);
        const newValue = itemsState.get(identifier);
        setInputValue({ value: newValue?.labelSelected, checked: undefined, files: undefined }, 'string');
      }
      setOpenFnc(false);
    },
    [inputSelectedValueState, itemsState, reset, resetOnSameItem, setInputSelectedValueFnc, setInputValue, setOpenFnc],
  );

  const renderEmpty = useCallback(() => {
    if (isLoadingState && items.length > 0) return undefined;

    if (!valueInput) return messages?.initMessage;
    else if (valueInput.length >= minLingthValue) return messages?.noData;
    else if (valueInput.length < minLingthValue) return messages?.minLengthMessage;
    return undefined;
  }, [
    messages?.initMessage,
    messages?.minLengthMessage,
    messages?.noData,
    isLoadingState,
    items.length,
    minLingthValue,
    valueInput,
  ]);

  useEffect(() => {
    const newMap = new Map(
      items.map((item): [string, IAutocompleteItemsExtend<AutoCompData>] => {
        const key = `${item.labelSelected.trim().toLowerCase()}-${item.labelSuggestion.trim().toLowerCase()}`;
        let identifier = itemsCache.current.get(key);

        if (!identifier) {
          identifier = djb2Hash(key);
          itemsCache.current.set(key, identifier);
        }
        return [identifier, { ...item, identifier }];
      }),
    );

    setItemsState((prev) => {
      const isEquals = equals(newMap, prev);
      if (!isEquals) return newMap;
      return prev;
    });
  }, [items]);

  useEffect(() => {
    if (valueInput === '') {
      reset({ resetInput: false, resetOpen: true });
    }
  }, [reset, valueInput]);

  useEffect(() => {
    if (isLoading !== undefined) setIsLoadingFnc(isLoading);
  }, [isLoading, setIsLoadingFnc]);

  useEffect(() => {
    if (items.length === 0) setIsLoadingFnc(false);
  }, [items, setIsLoadingFnc]);

  useEffect(() => {
    setInputSelected?.((prev) => {
      const labelsLength = itemsState.size;
      const currentLabel = itemsState.get(inputSelectedValueState);

      //Si no existe una lista de sugerencias pero anteriormente habia seleccionado una regresamos prev.
      if (!labelsLength && inputSelectedValueState) return prev;
      //Si existen sugerencias y ya tenía una sugerencia seleccionada anteriormente, pero no concuerda con ningun dato de las sugerencias mostradas regresamos prev.
      if (labelsLength && inputSelectedValueState && !currentLabel) return prev;
      //Si no existe un dentro de la lista de sugerencias y el valor seleccionado es vacío se resetea
      if (!currentLabel && !inputSelectedValueState) return '';

      if (currentLabel) {
        const newValue = currentLabel.labelSelected;
        if (prev !== newValue) return newValue;
      }
      return prev;
    });
  }, [inputSelectedValueState, itemsState, setInputSelected]);

  useEffect(() => {
    const labelsLength = itemsState.size;
    const currentLabel = itemsState.get(inputSelectedValueState);

    if (labelsLength > 0 && currentLabel) {
      prevInputSelectedValueRef.current = currentLabel.labelSelected;
    }
  }, [inputSelectedValueState, itemsState]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (openState && inputSelectedValueState) {
        setCommandValueState(inputSelectedValueState);
      }
    });

    return () => cancelAnimationFrame(id);
    //NOTA: ES IMPORTANTE QUE NO SE ELIMINE itemsState DE LAS DEPENDENCIAS, YA QUE SI NO, NO SE ACTUALIZA EL VALOR CORRECTAMENTE.
  }, [inputSelectedValueState, openState, itemsState]);

  useEffect(() => {
    console.log('Component-Autocomplete');
  }, []);

  return (
    <Popover open={openState} onOpenChange={setOpenState}>
      <Command
        shouldFilter={false}
        value={commandValueState}
        onValueChange={setCommandValueState}
        className="[&_label]:hidden"
      >
        <AutocompleteInput
          ref={autocompleteInputRef}
          autocompleteProps={autocompletePropsMemo}
          inputSelectedValueState={inputSelectedValueState}
          itemsState={itemsState}
          minLingthValue={minLingthValue}
          onBlurConfig={onBlurConfig}
          prevInputSelectedValueRef={prevInputSelectedValueRef}
          reset={reset}
          setIsLoadingFnc={setIsLoadingFnc}
          setOpenFnc={setOpenFnc}
        />
        {!openState && <CommandList aria-hidden="true" className="hidden" />}
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (e.target instanceof Element && e.target.hasAttribute('cmdk-input')) {
              // console.log('onInteractOutside-IF');
              e.preventDefault();
            }
          }}
          className={cn(
            baseStyle,
            themeStyle,
            'w-[--radix-popover-trigger-width] p-0',
            classNamePopover?.classNameContent || null,
          )}
        >
          <CommandList className={cn(classNamePopover?.classNameList)}>
            <CommandEmpty
              className={cn(
                'py-6 text-center text-sm',
                (items.length > 0 || isLoadingState || !showMessages) && 'hidden',
                classNamePopover?.classNameEmpty,
              )}
              onMouseDown={(e) => e.preventDefault()}
            >
              {renderEmpty()}
            </CommandEmpty>
            {isLoadingState && showLoading && (
              <CommandPrimitive.Loading>
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 size={20} className="animate-spin" />
                  <p className="text-center text-sm">Fetching data…</p>
                </div>
              </CommandPrimitive.Loading>
            )}
            {items.length > 0 && !isLoadingState && (
              <AautocompleteListHeader
                classNamePopoverHeader={classNamePopoverHeader}
                inputSelectedValueState={inputSelectedValueState}
                messages={messages}
                reset={reset}
              />
            )}
            {virtualizeSuggestionsList && (
              <AutocompleteListVirtualizer
                classNamePopoverScrollArea={classNamePopoverScrollArea}
                handleOnSelect={handleOnSelect}
                inputSelectedValueState={inputSelectedValueState}
                itemIconSelected={itemIconSelected}
                itemsState={itemsState}
                openState={openState}
                showIconSelected={showIconSelected}
                hidden={items.length === 0 || isLoadingState}
                commandValueState={commandValueState}
              />
            )}
            {!virtualizeSuggestionsList && (
              <AutocompleteList
                classNamePopoverScrollArea={classNamePopoverScrollArea}
                commandValueState={commandValueState}
                handleOnSelect={handleOnSelect}
                hidden={items.length === 0 || isLoadingState}
                inputSelectedValueState={inputSelectedValueState}
                itemIconSelected={itemIconSelected}
                itemsState={itemsState}
                openState={openState}
                showIconSelected={showIconSelected}
              />
            )}
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  );
}) as <Data, AutoCompData extends string>(
  props: IAutocompleteProps<Data, AutoCompData> & { ref?: ForwardedRef<AutocompleteForwardRefType> },
) => React.JSX.Element;
