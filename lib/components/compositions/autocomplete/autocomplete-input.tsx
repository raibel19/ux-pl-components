import { Command as CommandPrimitive } from 'cmdk';
import { ComponentPropsWithoutRef, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import { cn } from '../../../lib/utils';
import { Input } from '../../ui/input';
import { PopoverTrigger } from '../../ui/popover';
import { inputVariants } from './autocomplete-input.variants';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

type AutocompleteInputForwardRef = {
  element: HTMLInputElement | null;
};

type AutocompleteInputProps = ComponentPropsWithoutRef<'input'>;

export default forwardRef<AutocompleteInputForwardRef, AutocompleteInputProps>(function AutocompleteInput(props, ref) {
  const {
    className,
    onKeyDown: onKeyDownNative,
    onMouseDown: onMouseDownNative,
    onFocus: onFocusNative,
    onBlur: onBlurNative,
    ...moreProps
  } = props;

  const { inputValue, isInvalid, leftAddonWidth, rightAddonWidth } = useAutocompleteContext();
  const { id, onChange, onkeyDown, onMouseDown, onFocus, onBlur } = useAutocompleteActionsContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      element: inputRef.current,
    };
  });

  const handleOnkeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onkeyDown(event);
      onKeyDownNative?.(event);
    },
    [onKeyDownNative, onkeyDown],
  );

  const handleOnMouseDown = useCallback(
    (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      onMouseDown(event);
      onMouseDownNative?.(event);
    },
    [onMouseDown, onMouseDownNative],
  );

  const handleOnFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      onFocus();
      onFocusNative?.(event);
    },
    [onFocus, onFocusNative],
  );

  const handleOnBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      onBlur(event);
      onBlurNative?.(event);
    },
    [onBlur, onBlurNative],
  );

  return (
    <PopoverTrigger asChild>
      <CommandPrimitive.Input
        asChild
        ref={inputRef}
        {...moreProps}
        id={id}
        value={inputValue}
        onValueChange={onChange}
        onKeyDown={handleOnkeyDown}
        onMouseDown={handleOnMouseDown}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      >
        <Input
          className={cn(
            inputVariants({ isError: isInvalid }),
            leftAddonWidth && 'ps-[--leftWidth]',
            rightAddonWidth && 'pe-[--rightWidth]',
            className || null,
          )}
          style={{ '--leftWidth': `${leftAddonWidth}`, '--rightWidth': `${rightAddonWidth}` } as React.CSSProperties}
        />
      </CommandPrimitive.Input>
    </PopoverTrigger>
  );
});
