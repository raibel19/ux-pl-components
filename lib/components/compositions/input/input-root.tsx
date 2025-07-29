import { ForwardedRef, forwardRef, ReactNode, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '../../../lib/utils';
import { InputContext, InputContextType } from './context';
import useManagedInput from './hooks/use-managed-input';
import useTheme from './hooks/use-theme';
import inputStyle from './input.module.css';
import {
  IFormatter,
  InputChangePayload,
  InputTheme,
  InputType,
  ISanitize,
  IValidationBetween,
  IValidationLimits,
} from './types/types';

interface ITextProcessor {
  sanitize?: ISanitize;
  maxLength?: number;
  between?: IValidationBetween;
  formatter?: IFormatter;
  limits?: IValidationLimits;
}

interface InputRootProps<Data> {
  children: ReactNode;
  className?: string;
  data?: Data;
  defaultValue?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  reset?: boolean;
  resetToInitialValue?: boolean;
  textProcessor?: ITextProcessor;
  theme?: InputTheme;
  type: InputType;
  value?: string;
  onValueChange?: (payload: InputChangePayload<Data>) => void;
  setReset?: React.Dispatch<React.SetStateAction<boolean>>;
  subscribeIsInvalid?: (isInvalid: boolean) => void;
}

export default forwardRef(function InputRoot<Data>(props: InputRootProps<Data>, ref: ForwardedRef<HTMLDivElement>) {
  const {
    children,
    className,
    data,
    defaultValue,
    disabled,
    isInvalid,
    reset,
    resetToInitialValue,
    textProcessor,
    theme = 'default',
    type,
    value: controllerValue,
    setReset,
    onValueChange,
    subscribeIsInvalid,
  } = props;

  const { between, formatter, limits, maxLength, sanitize } = textProcessor || {};

  const id = useId();
  const { themeCore, themeStyle } = useTheme({ style: inputStyle, theme });

  const [leftAddonWidth, setLeftAddonWidth] = useState<string | number>(0);
  const [rightAddonWidth, setRightAddonWidth] = useState<string | number>(0);

  const {
    displayValue,
    errors,
    initialValueRef,
    value,
    valueFormatted,
    onAddError,
    onBlur,
    onChange,
    onFocus,
    onReset,
  } = useManagedInput<Data>({
    between,
    data,
    defaultValue,
    formatter,
    limits,
    maxLength,
    reset,
    resetToInitialValue,
    sanitize,
    type,
    value: controllerValue,
    onValueChange,
    setReset,
  });

  const isInvalidMemo = useMemo(() => isInvalid || Boolean(errors.length), [errors.length, isInvalid]);

  const contextValue = useMemo<InputContextType<Data>>(
    () => ({
      data,
      disabled,
      displayValue,
      errors,
      id,
      initialValueRef,
      isInvalid: isInvalidMemo,
      leftAddonWidth,
      maxLength,
      rightAddonWidth,
      theme,
      type,
      value,
      valueFormatted,
      onAddError,
      onBlur,
      onChange,
      onFocus,
      onReset,
      setLeftAddonWidth,
      setRightAddonWidth,
    }),
    [
      data,
      disabled,
      displayValue,
      errors,
      id,
      initialValueRef,
      isInvalidMemo,
      leftAddonWidth,
      maxLength,
      onAddError,
      onBlur,
      onChange,
      onFocus,
      onReset,
      rightAddonWidth,
      theme,
      type,
      value,
      valueFormatted,
    ],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      subscribeIsInvalid?.(isInvalidMemo);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [isInvalidMemo, subscribeIsInvalid]);

  useEffect(() => {
    console.log('Component-InputRoot');
  }, [props]);

  return (
    <InputContext.Provider value={contextValue}>
      <div ref={ref} className={cn(themeCore, themeStyle, 'w-full space-y-1', className || null)}>
        {children}
      </div>
    </InputContext.Provider>
  );
}) as <Data>(props: InputRootProps<Data> & { ref?: ForwardedRef<HTMLDivElement> }) => React.JSX.Element;
