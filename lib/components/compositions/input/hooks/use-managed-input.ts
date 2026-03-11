import { numberFormatter } from '@pl-core/utils/numbers';
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';

import useControllableState from '../../../hooks/use-controllable-state';
import {
  ErrorKeys,
  IFormatter,
  InputType,
  ISanitize,
  IValidationBetween,
  IValidationLimits,
  NumericPayload,
  TextPayload,
} from '../types/types';
import {
  errorReducer,
  isBetweenExceeded,
  isMaxExceeded,
  isMaxLengthExceeded,
  isMinExceeded,
  isPartial,
  sanitize,
} from '../utils/utils';

interface BaseUseManagedInputProps<Data = undefined> {
  data?: Data;
  defaultValue?: string;
  reset?: boolean;
  resetToInitialValue?: boolean;
  type: InputType;
  value?: string;
  setReset?: React.Dispatch<React.SetStateAction<boolean>>;
}

export type UseManagedInputProps<Data = undefined> = BaseUseManagedInputProps<Data> &
  (
    | {
        type: 'text';
        between?: never;
        formatter?: never;
        limits?: never;
        maxLength?: number;
        sanitize?: never;
        onValueChange?: (payload: TextPayload<Data>) => void;
      }
    | {
        type: 'number';
        between?: IValidationBetween;
        formatter?: IFormatter;
        limits?: IValidationLimits;
        maxLength?: number;
        sanitize?: ISanitize;
        onValueChange?: (payload: NumericPayload<Data>) => void;
      }
  );

export default function useManagedInput<Data = undefined>(props: UseManagedInputProps<Data>) {
  const { defaultValue, reset, type, value: controlledValue, setReset } = props;

  const isTypeNumber = type === 'number';

  const [errors, dispatchError] = useReducer(errorReducer, new Map());

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [intlFormat, setIntlFormat] = useState<string>('');

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
      setIntlFormat(formatted);
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

  const onChangeControllableState = useCallback(
    (newValue: string) => {
      const { data, onValueChange, type } = propsRef.current;

      if (!onValueChange) return;

      if (type === 'number') {
        const normalizeValue = newValue.replace(',', '.');
        const floatValue = parseFloat(normalizeValue);

        onValueChange({
          inputType: 'number',
          data: data as Data,
          floatValue: isNaN(floatValue) ? undefined : floatValue,
          initialValue: initialValueRef.current,
          isComplete: !isPartialNumber(newValue),
          value: newValue,
        });
      } else {
        onValueChange({
          inputType: 'text',
          data: data as Data,
          initialValue: initialValueRef.current,
          value: newValue,
        });
      }
    },
    [isPartialNumber],
  );

  const defaultValueProcessed = useMemo(() => processRawValue(defaultValue ?? ''), [defaultValue, processRawValue]);

  const {
    value: currentValue,
    setValue: setCurrentValue,
    isControlled,
  } = useControllableState<string>({
    defaultValue: defaultValueProcessed,
    onChange: onChangeControllableState,
    value: controlledValue,
  });

  const initialValueRef = useRef<string>(currentValue);
  const displayValue = isFocused ? currentValue : intlFormat || currentValue;

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    if (isTypeNumber) {
      const valueSantize = sanitizeNumber(currentValue);
      formatValue(valueSantize);
    }
  }, [isTypeNumber, sanitizeNumber, currentValue, formatValue]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (isTypeNumber) setIntlFormat('');
  }, [isTypeNumber]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      newValue = processRawValue(newValue, false);

      setCurrentValue(newValue);
    },
    [processRawValue, setCurrentValue],
  );

  const handleReset = useCallback(
    (resetToInitialValue: boolean | undefined) => {
      const initialValue = initialValueRef.current;
      const resetValue = resetToInitialValue === true ? initialValue : '';

      dispatchError({ type: 'CLEAR_ERRORS' });

      setIntlFormat('');
      setCurrentValue(resetValue);
    },
    [setCurrentValue],
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

    const sanitizeValue = processRawValue(controlledValue ?? '', false);

    if (sanitizeValue !== controlledValue) {
      setCurrentValue(sanitizeValue);
    }
  }, [controlledValue, isControlled, processRawValue, setCurrentValue]);

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
    intlFormat,
    value: currentValue,
    isPartialNumber,
    onAddError: handleAddError,
    onBlur: handleBlur,
    onChange: handleChange,
    onFocus: handleFocus,
    onReset: handleReset,
  };
}
