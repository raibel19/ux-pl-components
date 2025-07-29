import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
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
  const { defaultValue, reset, type, value: controlledValue, setReset } = props;

  const isControlled = controlledValue !== undefined;
  const isTypeNumber = type === 'number';

  const [errors, dispatchError] = useReducer(errorReducer, new Map());

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [valueFormatted, setValueFormatted] = useState<string>('');

  const propsRef = useRef(props);

  const formatValue = useCallback((value: string, setSanitze: boolean = true) => {
    const { formatter } = propsRef.current;

    if (!formatter || !formatter.active) return;

    let valueSantize = value;
    if (setSanitze) valueSantize = sanitizeNumber(value);
    const formatted = numberFormatter(formatter).format(valueSantize);
    setValueFormatted(formatted);
  }, []);

  const validateMaxLength = useCallback((value: string) => {
    const { maxLength } = propsRef.current;

    if (!maxLength || maxLength === 0) return false;
    return isMaxLengthExceeded(value, maxLength);
  }, []);

  const validateLimits = useCallback((valueSantize: string) => {
    const { limits } = propsRef.current;

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
  }, []);

  const validateBetween = useCallback((valueSantize: string) => {
    const { between } = propsRef.current;

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
  }, []);

  const processRawValue = useCallback(
    (rawValue: string) => {
      const { maxLength, sanitize } = propsRef.current;
      const { maxDecimalDigits = 0, initialValue } = sanitize || {};

      const trimmed = rawValue.trim();

      const sanitized = isTypeNumber ? sanitizeNumber(trimmed, { ...initialValue, maxDecimalDigits }) : trimmed;

      const newValue = validateMaxLength(sanitized) ? sanitized.slice(0, maxLength) : sanitized;

      if (isTypeNumber) {
        validateBetween(newValue);
        validateLimits(newValue);
        formatValue(newValue, false);
      }
      return newValue;
    },
    [formatValue, isTypeNumber, validateBetween, validateLimits, validateMaxLength],
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
      const { data, maxLength, sanitize, onValueChange } = propsRef.current;
      const { maxDecimalDigits = 0, onChangeEvent } = sanitize || {};

      const inputValue = e.target.value;
      const previousInputValue = value;

      const sanitized = isTypeNumber ? sanitizeNumber(inputValue, { ...onChangeEvent, maxDecimalDigits }) : inputValue;

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
    [formatValue, isControlled, isTypeNumber, validateBetween, validateLimits, validateMaxLength, value],
  );

  const handleReset = useCallback(
    (resetToInitialValue: boolean | undefined) => {
      const { data, onValueChange } = propsRef.current;

      const initialValue = initialValueRef.current;
      const resetValue = resetToInitialValue === true ? initialValue : '';

      dispatchError({ type: 'CLEAR_ERRORS' });

      if (!isControlled) {
        setValueFormatted('');
        setValue('');
      }

      if (onValueChange) {
        const payload: InputChangePayload<Data> = {
          data,
          initialValue,
          value: resetValue,
        };
        onValueChange(payload);
      }
    },
    [isControlled],
  );

  const handleAddError = useCallback((key: string, value: string | string[]) => {
    dispatchError({
      type: 'ADD_ERROR',
      payload: { key, message: value },
    });
  }, []);

  useLayoutEffect(() => {
    propsRef.current = props;
  }, [props]);

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
      const { resetToInitialValue } = propsRef.current;

      setReset(false);
      handleReset(resetToInitialValue);
    }
  }, [handleReset, reset, setReset]);

  useEffect(() => {
    if (isControlled && defaultValue !== undefined) {
      console.warn(
        `useManagedInput: Se están proporcionando las props 'value' y 'defaultValue' a un Input. Un componente no puede ser controlado y no controlado a la vez. Se dará prioridad a 'value'.`,
      );
    }
  }, [isControlled, defaultValue]);

  return {
    displayValue,
    errors: Array.from(errors.values()),
    initialValueRef,
    value,
    valueFormatted,
    onBlur: handleBlur,
    onChange: handleChange,
    onFocus: handleFocus,
    onReset: handleReset,
    onAddError: handleAddError,
  };
}
