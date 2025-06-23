import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { numberFormatter } from 'ux-pl/utils/numbers';

import {
  ErrorKeys,
  IFormatter,
  InputChangePayload,
  InputType,
  ISanitize,
  IValidationBetween,
  IValidationLimits,
} from '../types/types';
import {
  errorReducer,
  isBetweenExceeded,
  isMaxExceeded,
  isMaxLengthExceeded,
  isMinExceeded,
  sanitizeNumber,
} from '../utils/utils';

interface UseManagedInputProps<Data> {
  between?: IValidationBetween;
  data?: Data;
  defaultValue?: string;
  formatter?: IFormatter;
  limits?: IValidationLimits;
  maxLength?: number;
  reset?: boolean;
  resetToInitialValue?: boolean;
  sanitize?: ISanitize;
  type: InputType;
  value?: string;
  onValueChange?: (payload: InputChangePayload<Data>) => void;
  setReset?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useManagedInput<Data>(props: UseManagedInputProps<Data>) {
  const {
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
    value: controlledValue,
    onValueChange,
    setReset,
  } = props;

  const isControlled = controlledValue !== undefined;
  const isTypeNumber = type === 'number';

  const sanitizeOnInitialValue = sanitize?.initialValue;
  const sanitizeOnChangeEvent = sanitize?.onChangeEvent;
  const sanitizeDigits = sanitize?.maxDecimalDigits ?? 0;

  const [errors, dispatchError] = useReducer(errorReducer, new Map());

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [valueFormatted, setValueFormatted] = useState<string>('');

  const formatValue = useCallback(
    (value: string, setSanitze: boolean = true) => {
      if (!formatter || !formatter.active) return;

      let valueSantize = value;
      if (setSanitze) valueSantize = sanitizeNumber(value);
      const formatted = numberFormatter(formatter).format(valueSantize);
      setValueFormatted(formatted);
    },
    [formatter],
  );

  const validateMaxLength = useCallback(
    (value: string) => {
      if (!maxLength || maxLength === 0) return false;
      return isMaxLengthExceeded(value, maxLength);
    },
    [maxLength],
  );

  const validateLimits = useCallback(
    (valueSantize: string) => {
      if (!limits) return;

      const { max, min, maxMessageError, minMessageError } = limits;
      const isInvalidMin = isMinExceeded(valueSantize, min);
      const isInvalidMax = isMaxExceeded(valueSantize, max);

      if (!isInvalidMin && !isInvalidMax) {
        dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.limitsMin } });
        dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.limitsMax } });
        return;
      }

      if (isInvalidMin) {
        dispatchError({
          type: 'ADD_ERROR',
          payload: { key: ErrorKeys.limitsMin, message: minMessageError ?? 'El valor es menor al mínimo permitido' },
        });
      } else {
        dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.limitsMin } });
      }

      if (isInvalidMax) {
        dispatchError({
          type: 'ADD_ERROR',
          payload: { key: ErrorKeys.limitsMax, message: maxMessageError ?? 'El valor es mayor al máximo permitido' },
        });
      } else {
        dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.limitsMax } });
      }
    },
    [limits],
  );

  const validateBetween = useCallback(
    (valueSantize: string) => {
      if (!between) return;

      const { messageError, subscribeBetween } = between;
      const { beteween, isInvalidRange } = isBetweenExceeded(valueSantize, between);

      if (beteween) subscribeBetween?.(beteween);

      if (!isInvalidRange) {
        dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.between } });
        return;
      }

      if (isInvalidRange) {
        dispatchError({
          type: 'ADD_ERROR',
          payload: { key: ErrorKeys.between, message: messageError ?? 'El valor no encuentra en el rango permitido' },
        });
      } else {
        dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.between } });
      }
    },
    [between],
  );

  const processRawValue = useCallback(
    (rawValue: string) => {
      const trimmed = rawValue.trim();

      const sanitized = isTypeNumber
        ? sanitizeNumber(trimmed, { ...sanitizeOnInitialValue, maxDecimalDigits: sanitizeDigits })
        : trimmed;

      const newValue = validateMaxLength(sanitized) ? sanitized.slice(0, maxLength) : sanitized;

      if (isTypeNumber) {
        validateBetween(newValue);
        validateLimits(newValue);
        formatValue(newValue, false);
      }
      return newValue;
    },
    [
      formatValue,
      isTypeNumber,
      maxLength,
      sanitizeDigits,
      sanitizeOnInitialValue,
      validateBetween,
      validateLimits,
      validateMaxLength,
    ],
  );

  const [value, setValue] = useState<string>(() => {
    const rawValue = isControlled ? controlledValue : (defaultValue ?? '');
    return processRawValue(rawValue);
  });
  const initialValueRef = useRef<string>(value);
  const displayValue = isFocused ? value : valueFormatted || value;

  const handleBlur = useCallback(() => {
    const valueSantize = sanitizeNumber(value);
    setIsFocused(false);
    formatValue(valueSantize);
  }, [formatValue, value]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (isTypeNumber) setValueFormatted('');
  }, [isTypeNumber]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const previousInputValue = value;

      const sanitized = isTypeNumber
        ? sanitizeNumber(inputValue, { ...sanitizeOnChangeEvent, maxDecimalDigits: sanitizeDigits })
        : inputValue;

      const newValue = validateMaxLength(sanitized) ? sanitized.slice(0, maxLength) : sanitized;

      if (isTypeNumber) {
        validateBetween(newValue);
        validateLimits(newValue);
        formatValue(newValue, false);
      }

      const isEquals = newValue === previousInputValue;

      if (!isControlled) setValue(newValue);

      if (onValueChange && !isEquals) {
        const payload: InputChangePayload<Data> = {
          data,
          initialValue: initialValueRef.current,
          value: newValue,
        };
        onValueChange(payload);
      }
    },
    [
      data,
      formatValue,
      isControlled,
      isTypeNumber,
      maxLength,
      onValueChange,
      sanitizeDigits,
      sanitizeOnChangeEvent,
      validateBetween,
      validateLimits,
      validateMaxLength,
      value,
    ],
  );

  const handleReset = useCallback(
    (resetToInitialValue: boolean | undefined) => {
      const initialValue = initialValueRef.current;
      const resetValue = resetToInitialValue === true ? initialValue : '';

      dispatchError({ type: 'CLEAR_ERRORS' });

      if (isControlled) {
        onValueChange?.({ data, initialValue: initialValue, value: resetValue });
      } else {
        setValueFormatted('');
        setValue('');
      }
    },
    [data, isControlled, onValueChange],
  );

  useEffect(() => {
    if (isControlled) {
      setValue((prev) => {
        const rawValue = controlledValue;
        const newValue = processRawValue(rawValue);

        if (newValue === prev) return prev;
        return rawValue;
      });
    }
  }, [controlledValue, isControlled, processRawValue]);

  useEffect(() => {
    if (reset && setReset) {
      setReset(false);
      handleReset(resetToInitialValue);
    }
  }, [handleReset, reset, resetToInitialValue, setReset]);

  return {
    displayValue,
    errors: Array.from(errors.values()),
    initialValueRef,
    value,
    valueFormatted,
    onBlur: handleBlur,
    onChange: handleChange,
    onDispatchError: dispatchError,
    onFocus: handleFocus,
    onReset: handleReset,
  };
}
