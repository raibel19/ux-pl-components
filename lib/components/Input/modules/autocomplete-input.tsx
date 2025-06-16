import { PopoverAnchor } from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { ForwardedRef, forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef } from 'react';

import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import { inputVariants } from '../helpers/variants';
import { IAutocompleteInputForwardRefType, IAutocompleteInputProps, nonOpeningKeys } from '../interfaces/internals';

export default forwardRef(function AutocompleteInput<Data, AutoCompData extends string>(
  props: IAutocompleteInputProps<Data, AutoCompData>,
  ref?: ForwardedRef<IAutocompleteInputForwardRefType>,
) {
  const {
    autocompleteProps,
    inputSelectedValueState,
    itemsState,
    minLingthValue,
    onBlurConfig,
    prevInputSelectedValueRef,
    reset,
    setIsLoadingFnc,
    setOpenFnc,
  } = props;

  const {
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
  } = autocompleteProps;

  const { default: defaultBlur, reassignSelectedSuggestion, resetOnNoSelection } = onBlurConfig || {};

  const inputRef = useRef<HTMLInputElement>(null);

  const id = useId();
  const inputId = useMemo(() => (nativeInputsProps?.id ? nativeInputsProps.id : id), [id, nativeInputsProps?.id]);

  const onKeyDown = nativeInputsProps?.onKeyDown;
  const onMouseDown = nativeInputsProps?.onMouseDown;

  useImperativeHandle(ref, () => {
    return {
      element: inputRef.current,
    };
  });

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;
      setOpenFnc(undefined, () => {
        if (!nonOpeningKeys.includes(key)) {
          return true;
        }
        return undefined;
      });
      onKeyDown?.(event);
    },
    [onKeyDown, setOpenFnc],
  );

  const handleOnMouseDown = useCallback(
    (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const currentTargetValue = event.currentTarget.value;
      setOpenFnc(undefined, (prev) => {
        const value = Boolean(currentTargetValue) || !prev;
        // console.log('handleOnMouseDown', value);
        if (prev !== value) return value;
        return prev;
      });
      onMouseDown?.(event);
    },
    [onMouseDown, setOpenFnc],
  );

  const handleOnFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      // console.log('handleOnFocus', event);
      setOpenFnc(true);
      handleFocusInput(event);
    },
    [handleFocusInput, setOpenFnc],
  );

  const handleOnBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      const suggestion = itemsState.get(inputSelectedValueState);
      // console.log('handleOnBlur');
      if (
        !event.relatedTarget?.hasAttribute('cmdk-input') &&
        valueInput !== '' &&
        suggestion?.labelSelected !== valueInput
      ) {
        // console.log('handleOnBlur IF');
        if (defaultBlur) return;
        else if (reassignSelectedSuggestion) {
          const newValue = prevInputSelectedValueRef.current;

          if (!newValue || (!newValue && !suggestion)) reset({ resetInput: true });
          else setInputValue({ value: newValue, checked: undefined, files: undefined }, 'string');
        } else if (resetOnNoSelection) reset({ resetInput: true });
      }
      handleBlurInput(event);
    },
    [
      defaultBlur,
      handleBlurInput,
      inputSelectedValueState,
      itemsState,
      prevInputSelectedValueRef,
      reassignSelectedSuggestion,
      reset,
      resetOnNoSelection,
      setInputValue,
      valueInput,
    ],
  );

  const handleOnValueChange = useCallback(
    (value: string) => {
      if (validateStringLength(value)) return; // Detener si se excede el máximo de caracteres

      setIsFirstRender(false);
      const isLoadingValue = itemsState.size > 0 || value.length >= minLingthValue;
      setIsLoadingFnc(isLoadingValue);

      setInputValue({ value, checked: undefined, files: undefined }, 'string');
    },
    [itemsState.size, minLingthValue, setInputValue, setIsFirstRender, setIsLoadingFnc, validateStringLength],
  );

  useEffect(() => {
    console.log('Component-AutocompleteInput');
  }, []);

  return (
    <PopoverAnchor asChild>
      <CommandPrimitive.Input
        asChild
        ref={inputRef}
        {...nativeInputsProps}
        defaultValue={undefined}
        defaultChecked={undefined}
        value={valueInput}
        onValueChange={handleOnValueChange}
        onKeyDown={handleOnKeyDown}
        onMouseDown={handleOnMouseDown}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      >
        <Input
          id={inputId}
          className={cn(
            inputVariants({
              leftElement: variantLeftElement,
              isError: variantIsError,
            }),
            classNameInput || null,
          )}
          style={{ '--leftWidth': `${leftWidth}`, '--rightWidth': `${rightWidth}` } as React.CSSProperties}
        />
      </CommandPrimitive.Input>
    </PopoverAnchor>
  );
}) as <Data, AutoCompData extends string>(
  props: IAutocompleteInputProps<Data, AutoCompData> & { ref?: ForwardedRef<IAutocompleteInputForwardRefType> },
) => React.JSX.Element;
