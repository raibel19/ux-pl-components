import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { Input } from '@/components/ui/input';

import { cn } from '../../lib/utils';
import { useInputContext } from './context';
import { inputVariants } from './variants/input-control.variants';

type InputControlForwardRef = {
  blur: () => void;
  focus: () => void;
  get: () => HTMLElement | null;
};

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  keyof InputControlProps | 'className' | 'id' | 'type' | 'onChange' | 'value' | 'defaultValue' | 'disabled'
>;

interface InputControlProps {
  nativeInputsProps?: NativeInputProps;
  className?: string;
  subscribeFocus?: (isFocus: boolean) => void;
}

export default forwardRef(function InputControl(props: InputControlProps, ref: ForwardedRef<InputControlForwardRef>) {
  const { className, nativeInputsProps, subscribeFocus } = props;
  const { id, onBlur, onChange, onFocus, displayValue, disabled, isInvalid, type, leftAddonWidth, rightAddonWidth } =
    useInputContext();

  const onFocusNative = nativeInputsProps?.onFocus;
  const onBlurNative = nativeInputsProps?.onBlur;

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

  useEffect(() => {
    console.log('Component-InputControl-PROPS');
  }, [props]);

  useEffect(() => {
    console.log('Component-InputControl-CONTEXT');
  }, [id, onBlur, onChange, onFocus, displayValue, disabled, isInvalid, type]);

  return (
    <Input
      ref={inputRef}
      {...nativeInputsProps}
      id={id}
      type={type === 'number' ? 'text' : type}
      value={displayValue}
      defaultValue={undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={onChange}
      disabled={disabled}
      className={cn(inputVariants({ isError: isInvalid }), className || null)}
      style={{ '--leftWidth': `${leftAddonWidth}`, '--rightWidth': `${rightAddonWidth}` } as React.CSSProperties}
    />
  );
});
