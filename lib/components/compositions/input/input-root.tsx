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
  InputActionsContext,
  InputActionsContextProps,
  InputLayoutContext,
  InputLayoutContextProps,
  InputStableContext,
  InputStableContextProps,
  InputVolatileContext,
  InputVolatileContextProps,
} from './context';
import useManagedInput, { UseManagedInputProps } from './hooks/use-managed-input';
import {
  IFormatter,
  InputType,
  ISanitize,
  IValidationBetween,
  IValidationLimits,
  NumericPayload,
  TextPayload,
} from './types/types';

interface BaseInputRootProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  reset?: boolean;
  resetToInitialValue?: boolean;
  type: InputType;
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

export type InputRootProps<Data = undefined> = BaseInputRootProps &
  DataState<Data> &
  ControlledState &
  (
    | {
        type: 'text';
        textProcessor?: {
          maxLength?: number;
        };
        onValueChange?: (payload: TextPayload<Data>) => void;
      }
    | {
        type: 'number';
        textProcessor?: {
          between?: IValidationBetween;
          formatter?: IFormatter;
          limits?: IValidationLimits;
          maxLength?: number;
          sanitize?: ISanitize;
        };
        onValueChange?: (payload: NumericPayload<Data>) => void;
      }
  );

export default forwardRef(function InputRoot<Data = undefined>(
  props: InputRootProps<Data>,
  ref: ForwardedRef<HTMLDivElement>,
) {
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
    type,
    value: controllerValue,
    onValueChange,
    setReset,
    subscribeIsInvalid,
  } = props;

  const id = useId();

  const [leftAddonWidth, setLeftAddonWidth] = useState<string | number>(0);
  const [rightAddonWidth, setRightAddonWidth] = useState<string | number>(0);

  const propsRef = useRef({ subscribeIsInvalid });

  const hookProps: UseManagedInputProps<Data> =
    type === 'number'
      ? {
          between: textProcessor?.between,
          data,
          defaultValue,
          formatter: textProcessor?.formatter,
          limits: textProcessor?.limits,
          maxLength: textProcessor?.maxLength,
          reset,
          resetToInitialValue,
          sanitize: textProcessor?.sanitize,
          type,
          value: controllerValue,
          onValueChange,
          setReset,
        }
      : {
          data,
          defaultValue,
          maxLength: textProcessor?.maxLength,
          reset,
          resetToInitialValue,
          type,
          value: controllerValue,
          onValueChange,
          setReset,
        };

  const {
    displayValue,
    errors,
    initialValueRef,
    value,
    valueFormatted,
    isPartialNumber,
    onAddError,
    onBlur,
    onChange,
    onFocus,
    onReset,
  } = useManagedInput<Data>(hookProps);

  const isInvalidMemo = useMemo(() => isInvalid || Boolean(errors.length), [errors.length, isInvalid]);

  const contextVolatileValue = useMemo<InputVolatileContextProps>(
    () => ({
      displayValue,
      value,
      valueFormatted,
    }),
    [displayValue, value, valueFormatted],
  );

  const contextStableValue = useMemo<InputStableContextProps<Data>>(
    () => ({
      data,
      disabled,
      errors,
      id,
      initialValueRef,
      isInvalid: isInvalidMemo,
      maxLength: hookProps.maxLength,
      type,
    }),
    [data, disabled, errors, hookProps.maxLength, id, initialValueRef, isInvalidMemo, type],
  );

  const contextActionsValue = useMemo<InputActionsContextProps>(
    () => ({
      onAddError,
      onBlur,
      onChange,
      onFocus,
      onReset,
      isPartialNumber,
    }),
    [isPartialNumber, onAddError, onBlur, onChange, onFocus, onReset],
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
    <InputLayoutContext.Provider value={contextLayoutValue}>
      <InputStableContext.Provider value={contextStableValue}>
        <InputVolatileContext.Provider value={contextVolatileValue}>
          <InputActionsContext.Provider value={contextActionsValue}>
            <div ref={ref} className={cn('w-full space-y-1', className || null)}>
              {children}
            </div>
          </InputActionsContext.Provider>
        </InputVolatileContext.Provider>
      </InputStableContext.Provider>
    </InputLayoutContext.Provider>
  );
}) as <Data = undefined>(props: InputRootProps<Data> & { ref?: ForwardedRef<HTMLDivElement> }) => React.JSX.Element;
