import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { numberFormatter } from 'ux-pl/utils/numbers';

import { ErrorKeys, InputChangePayload, InputType, ResolvedVariantsProps } from '../types/types';
import {
  errorReducer,
  isBetweenExceeded,
  isMaxExceeded,
  isMaxLengthExceeded,
  isMinExceeded,
  isPartial,
  sanitize,
} from '../utils/utils';

interface UseManagedInputProps<Data> extends ResolvedVariantsProps {
  data?: Data;
  defaultValue?: string;
  maxLength?: number;
  reset?: boolean;
  resetToInitialValue?: boolean;
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

  const sanitizeNumber = useCallback((value: string) => {
    const { sanitize: sanitizeProp, maxLength } = propsRef.current;
    return sanitize(value, sanitizeProp, maxLength);
  }, []);

  const isPartialNumber = useCallback((value: string) => {
    const { sanitize } = propsRef.current;
    return isPartial(value, sanitize?.decimalSeparator);
  }, []);

  const formatValue = useCallback(
    (value: string, setSanitze: boolean = true) => {
      const { formatter } = propsRef.current;

      if (!formatter || !formatter.active) return;

      let valueSantize = value;
      if (setSanitze) valueSantize = sanitizeNumber(value);
      const formatted = numberFormatter(formatter).format(valueSantize);
      setValueFormatted(formatted);
    },
    [sanitizeNumber],
  );

  const validateMaxLength = useCallback((value: string) => {
    const { maxLength } = propsRef.current;

    if (!maxLength || maxLength === 0) return false;
    return isMaxLengthExceeded(value, maxLength);
  }, []);

  const validateLimits = useCallback((valueSantize: string) => {
    const { limits } = propsRef.current;

    if (!limits) {
      dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.limitsMin } });
      dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.limitsMax } });
      return;
    }

    const { max, min, maxMessageError, minMessageError } = limits;

    const validations = [
      {
        key: ErrorKeys.limitsMin,
        invalid: isMinExceeded(valueSantize, min),
        message: minMessageError ?? 'El valor es menor al mínimo permitido',
      },
      {
        key: ErrorKeys.limitsMax,
        invalid: isMaxExceeded(valueSantize, max),
        message: maxMessageError ?? 'El valor es mayor al máximo permitido',
      },
    ];

    validations.forEach(({ key, invalid, message }) => {
      if (invalid) {
        dispatchError({ type: 'ADD_ERROR', payload: { key, message } });
      } else {
        dispatchError({ type: 'REMOVE_ERROR', payload: { key } });
      }
    });
  }, []);

  const validateBetween = useCallback((valueSantize: string) => {
    const { between } = propsRef.current;

    if (!between) {
      dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.between } });
      return;
    }

    const { messageError, subscribeBetween } = between;
    const { beteween, isInvalidRange } = isBetweenExceeded(valueSantize, between);

    if (beteween) subscribeBetween?.(beteween);

    if (!isInvalidRange) {
      dispatchError({ type: 'REMOVE_ERROR', payload: { key: ErrorKeys.between } });
      return;
    }

    dispatchError({
      type: 'ADD_ERROR',
      payload: { key: ErrorKeys.between, message: messageError ?? 'El valor no encuentra en el rango permitido' },
    });
  }, []);

  const processRawValue = useCallback(
    (rawValue: string, trimmed: boolean = true) => {
      const { maxLength } = propsRef.current;
      const value = trimmed ? rawValue.trim() : rawValue;
      let newValue = value;

      if (isTypeNumber) {
        newValue = sanitizeNumber(value);

        validateBetween(newValue);
        validateLimits(newValue);
        formatValue(newValue, false);
      } else {
        newValue = validateMaxLength(newValue) ? newValue.slice(0, maxLength) : newValue;
      }
      return newValue;
    },
    [formatValue, isTypeNumber, sanitizeNumber, validateBetween, validateLimits, validateMaxLength],
  );

  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
    const rawValue = isControlled ? controlledValue : (defaultValue ?? '');
    return processRawValue(rawValue);
  });
  const currentValue = isControlled ? controlledValue : uncontrolledValue;
  const initialValueRef = useRef<string>(currentValue);
  const displayValue = isFocused ? currentValue : valueFormatted || currentValue;

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    if (isTypeNumber) {
      const valueSantize = sanitizeNumber(currentValue);
      formatValue(valueSantize);
    }
  }, [isTypeNumber, sanitizeNumber, currentValue, formatValue]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (isTypeNumber) setValueFormatted('');
  }, [isTypeNumber]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { data, onValueChange } = propsRef.current;

      let newValue = e.target.value;
      const previousInputValue = currentValue;
      newValue = processRawValue(newValue, false);

      if (!isControlled) setUncontrolledValue(newValue);

      if (onValueChange && newValue !== previousInputValue) {
        const floatValue = parseFloat(newValue);
        onValueChange({
          data,
          initialValue: initialValueRef.current,
          value: newValue,
          isComplete: !isPartialNumber(newValue),
          floatValue: isNaN(floatValue) ? null : floatValue,
        });
      }
    },
    [currentValue, isControlled, isPartialNumber, processRawValue],
  );

  const handleReset = useCallback(
    (resetToInitialValue: boolean | undefined) => {
      const { data, onValueChange } = propsRef.current;

      const initialValue = initialValueRef.current;
      const resetValue = resetToInitialValue === true ? initialValue : '';

      dispatchError({ type: 'CLEAR_ERRORS' });

      if (!isControlled) {
        setValueFormatted('');
        setUncontrolledValue('');
      }

      onValueChange?.({ data, initialValue, value: resetValue, isComplete: false, floatValue: null });
    },
    [isControlled],
  );

  const handleAddError = useCallback((key: string, value: string) => {
    dispatchError({
      type: 'ADD_ERROR',
      payload: { key, message: value },
    });
  }, []);

  useLayoutEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    if (!isControlled) return;

    const sanitizeValue = processRawValue(controlledValue);

    if (sanitizeValue !== controlledValue) {
      const { data, onValueChange } = propsRef.current;

      if (onValueChange) {
        const floatValue = parseFloat(sanitizeValue);
        onValueChange({
          data,
          initialValue: initialValueRef.current,
          value: sanitizeValue,
          isComplete: !isPartialNumber(sanitizeValue),
          floatValue: isNaN(floatValue) ? null : floatValue,
        });
      }
    }
  }, [controlledValue, isControlled, isPartialNumber, processRawValue]);

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
    value: currentValue,
    valueFormatted,
    onBlur: handleBlur,
    onChange: handleChange,
    onFocus: handleFocus,
    onReset: handleReset,
    onAddError: handleAddError,
  };
}
