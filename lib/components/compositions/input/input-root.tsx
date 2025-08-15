import { ForwardedRef, forwardRef, ReactNode, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '../../../lib/utils';
import {
  InputActionsContext,
  InputActionsContextProps,
  InputContext,
  InputContextProps,
  InputLayoutContext,
  InputLayoutContextProps,
} from './context';
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
  NumericPayload,
  ResolvedVariantsProps,
  TextPayload,
} from './types/types';

interface BaseInputRootProps<Data> {
  children: ReactNode;
  className?: string;
  data?: Data;
  defaultValue?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  reset?: boolean;
  resetToInitialValue?: boolean;
  theme?: InputTheme;
  type: InputType;
  value?: string;
  setReset?: React.Dispatch<React.SetStateAction<boolean>>;
  subscribeIsInvalid?: (isInvalid: boolean) => void;
}

type InputRootProps<Data> = BaseInputRootProps<Data> &
  (
    | {
        type: 'text';
        onValueChange?: (payload: TextPayload<Data>) => void;
        textProcessor: {
          maxLength?: number;
        };
      }
    | {
        type: 'number';
        onValueChange?: (payload: NumericPayload<Data>) => void;
        textProcessor: {
          sanitize?: ISanitize;
          maxLength?: number;
          between?: IValidationBetween;
          formatter?: IFormatter;
          limits?: IValidationLimits;
        };
      }
  );

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

  const id = useId();
  const { themeCore, themeStyle } = useTheme({ style: inputStyle, theme });

  const [leftAddonWidth, setLeftAddonWidth] = useState<string | number>(0);
  const [rightAddonWidth, setRightAddonWidth] = useState<string | number>(0);

  const resolvedVariantsProps = useMemo<ResolvedVariantsProps>(() => {
    if (type === 'number') {
      const { between, formatter, limits, maxLength, sanitize } = textProcessor;
      return { between, formatter, limits, maxLength, sanitize };
    }

    const { maxLength } = textProcessor;
    return { between: undefined, formatter: undefined, limits: undefined, maxLength, sanitize: undefined };
  }, [textProcessor, type]);

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
    ...resolvedVariantsProps,
    data,
    defaultValue,
    reset,
    resetToInitialValue,
    type,
    value: controllerValue,
    onValueChange: onValueChange as (payload: InputChangePayload<Data>) => void,
    setReset,
  });

  const isInvalidMemo = useMemo(() => isInvalid || Boolean(errors.length), [errors.length, isInvalid]);

  const contextValue = useMemo<InputContextProps>(
    () => ({
      displayValue,
      initialValueRef,
      isInvalid: isInvalidMemo,
      value,
      valueFormatted,
    }),
    [displayValue, initialValueRef, isInvalidMemo, value, valueFormatted],
  );

  const contextActionsValue = useMemo<InputActionsContextProps<Data>>(
    () => ({
      data,
      disabled,
      errors,
      id,
      maxLength: resolvedVariantsProps.maxLength,
      theme,
      type,
      onAddError,
      onBlur,
      onChange,
      onFocus,
      onReset,
    }),
    [
      data,
      disabled,
      errors,
      id,
      onAddError,
      onBlur,
      onChange,
      onFocus,
      onReset,
      resolvedVariantsProps.maxLength,
      theme,
      type,
    ],
  );

  const contextLayoutValue = useMemo<InputLayoutContextProps>(
    () => ({
      leftAddonWidth,
      rightAddonWidth,
      setLeftAddonWidth,
      setRightAddonWidth,
    }),
    [leftAddonWidth, rightAddonWidth],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      subscribeIsInvalid?.(isInvalidMemo);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [isInvalidMemo, subscribeIsInvalid]);

  return (
    <InputLayoutContext.Provider value={contextLayoutValue}>
      <InputContext.Provider value={contextValue}>
        <InputActionsContext.Provider value={contextActionsValue}>
          <div ref={ref} className={cn(themeCore, themeStyle, 'w-full space-y-1', className || null)}>
            {children}
          </div>
        </InputActionsContext.Provider>
      </InputContext.Provider>
    </InputLayoutContext.Provider>
  );
}) as <Data>(props: InputRootProps<Data> & { ref?: ForwardedRef<HTMLDivElement> }) => React.JSX.Element;
