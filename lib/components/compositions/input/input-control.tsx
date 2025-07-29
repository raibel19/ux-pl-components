import { ComponentPropsWithoutRef, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import { Input } from '@/components/ui/input';

import { cn } from '../../../lib/utils';
import { useInputContext } from './context';
import { inputVariants } from './input-control.variants';

type InputControlForwardRef = {
  blur: () => void;
  focus: () => void;
  get: () => HTMLElement | null;
};

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'id' | 'type' | 'onChange' | 'value' | 'defaultValue' | 'disabled'
>;

interface InputControlProps extends NativeInputProps {
  subscribeFocus?: (isFocus: boolean) => void;
}

export default forwardRef<InputControlForwardRef, InputControlProps>(function InputControl(props, ref) {
  const { className, subscribeFocus, onFocus: onFocusNative, onBlur: onBlurNative, ...moreProps } = props;
  const { id, onBlur, onChange, onFocus, displayValue, disabled, isInvalid, type, leftAddonWidth, rightAddonWidth } =
    useInputContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    const inputCoreElement = inputRef.current || null;
    return {
      blur: () => {
        inputCoreElement?.blur();
      },
      focus: () => {
        inputCoreElement?.focus();
      },
      get: () => {
        return inputCoreElement;
      },
    };
  });

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      onFocusNative?.(event);
      onFocus();
      if (subscribeFocus) subscribeFocus(true);
    },
    [onFocus, onFocusNative, subscribeFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      onBlurNative?.(event);
      if (subscribeFocus) subscribeFocus(false);
      if (type === 'number') onBlur();
    },
    [onBlur, onBlurNative, subscribeFocus, type],
  );

  return (
    <Input
      ref={inputRef}
      {...moreProps}
      id={id}
      type={type === 'number' ? 'text' : type}
      value={displayValue}
      defaultValue={undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        inputVariants({ isError: isInvalid }),
        leftAddonWidth && 'ps-[--leftWidth]',
        rightAddonWidth && 'pe-[--rightWidth]',
        className || null,
      )}
      style={{ '--leftWidth': `${leftAddonWidth}`, '--rightWidth': `${rightAddonWidth}` } as React.CSSProperties}
    />
  );
});
