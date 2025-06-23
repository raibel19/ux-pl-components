import { ReactNode, useEffect, useId, useMemo, useState } from 'react';

import { InputContext, InputContextType } from './context';
import useManagedInput from './hooks/use-managed-input';
import {
  ErrorKeys,
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

interface InputGroupProps<Data> {
  children: ReactNode;
  customMessageError?: string;
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

export default function InputGroup<Data>(props: InputGroupProps<Data>) {
  const {
    children,
    customMessageError,
    data,
    defaultValue,
    disabled,
    isInvalid,
    textProcessor,
    theme = 'default',
    type,
    value: controllerValue,
    reset,
    resetToInitialValue,
    setReset,
    onValueChange,
    subscribeIsInvalid,
  } = props;
  const id = useId();

  const { between, formatter, limits, maxLength, sanitize } = textProcessor || {};

  const [leftAddonWidth, setLeftAddonWidth] = useState<string | number>(0);
  const [rightAddonWidth, setRightAddonWidth] = useState<string | number>(0);

  const {
    displayValue,
    errors,
    onBlur,
    onChange,
    onDispatchError,
    onFocus,
    onReset,
    value,
    valueFormatted,
    initialValueRef,
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
    if (isInvalid) {
      onDispatchError({
        type: 'ADD_ERROR',
        payload: { key: ErrorKeys.custom, message: customMessageError ?? '' },
      });
    } else {
      onDispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.custom } });
    }
  }, [customMessageError, isInvalid, onDispatchError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      subscribeIsInvalid?.(isInvalidMemo);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [isInvalidMemo, subscribeIsInvalid]);

  useEffect(() => {
    console.log('Component-InputGroup');
  }, [props]);

  return <InputContext.Provider value={contextValue}>{children}</InputContext.Provider>;
}
