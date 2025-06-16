'use client';

import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { numberFormatter } from 'ux-pl/utils/numbers';
import { equals } from 'ux-pl/utils/object';

import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

import { calculateInitialInputValues } from './helpers/initial-props';
import { sanitizeNumberInput } from './helpers/utils';
import { labelVariants } from './helpers/variants';
import useProps from './hooks/use-props';
import inputStyle from './input.module.css';
import { IInputResponseEventProps, InputResponseDefaultValueType, InputResponseValueType } from './interfaces';
import { IInputProps, InputForwardRefType, ISubscribeBetween } from './interfaces/input';
import {
  ICalculateInitialInputValues,
  IErrorNumberValidation,
  IInputInternalValueState,
  InputCoreForwardRefType,
} from './interfaces/internals';
import InputCore from './modules/input-core';
import LeftElement from './modules/left-element';
import RightElement from './modules/right-element';
import './input.css';

export default forwardRef(function Input<Data, AutoCompData extends string>(
  props: IInputProps<Data, AutoCompData>,
  ref?: ForwardedRef<InputForwardRefType>,
) {
  const {
    propsWithDefault,
    refs: { dataRef, onChangeRef, sanitizeOptionsRef, sanitizeMaxDecimalDigits, subscribeBetweenRef },
  } = useProps<Data, AutoCompData>(props);

  const {
    autocomplete,
    classNameInput,
    classNameInputContainer,
    classNameLabel,
    classNamePrincipalContainer,
    classNameSkeleton,
    classNameSkeletonContainer,
    formatter,
    leftElement,
    nativeInputsProps,
    reset: resetValue,
    rightElement,
    sanitize,
    setDefaultValueInReset,
    showRequired,
    showSkeleton,
    showTextLabel,
    showTextRequired,
    textLabel,
    textRequired,
    validations,
    waitTime,
    theme,
  } = useMemo(() => propsWithDefault, [propsWithDefault]);

  const {
    number: numberValidations,
    showError: showErrorValidations,
    maxLength,
    errorMessages,
    classNameErrorContainer,
  } = validations || {};

  const nativeType = nativeInputsProps!.type;
  const existNativeValueOrChecked =
    nativeInputsProps &&
    (Object.prototype.hasOwnProperty.call(nativeInputsProps, 'value') ||
      Object.prototype.hasOwnProperty.call(nativeInputsProps, 'checked'));

  const [inputValueState, setInputValueState] = useState<IInputInternalValueState>(() => {
    const nativeProps: ICalculateInitialInputValues = {
      checked: nativeInputsProps?.checked,
      defaultChecked: nativeInputsProps?.defaultChecked,
      defaultValue: nativeInputsProps?.defaultValue,
      formatter,
      nativeType,
      sanitize,
      value: nativeInputsProps?.value,
      maxLength,
      isFirstRender: true,
    };

    const { value, checked, files } = calculateInitialInputValues(nativeProps);
    return { value: value, checked, files };
  });

  const [inputValueFormatState, setInputValueFormatState] = useState<InputResponseValueType>('');
  const [showErrorState, setShowErrorState] = useState<boolean>(false);
  const [showErrorNumericState, setShowErrorNumericState] = useState<IErrorNumberValidation>({
    show: false,
    type: undefined,
  });
  const [leftWidthState, setLeftWidthState] = useState<number | string>('2.25rem');
  const [rightWidthState, setRightWidthState] = useState<number | string>('2.5rem');
  const [betweenSubscribeState, setBetweenSubscribeState] = useState<ISubscribeBetween>({
    isLess: false,
    isGreater: false,
    inRange: false,
  });
  const [focusSubscribeState, setFocusSubscribeState] = useState<((isFocus: boolean) => void) | null>(null);
  const [isFirstRenderState, setIsFirstRenderState] = useState<boolean>(true);

  const isFirstRenderRef = useRef<boolean>(true);
  const inputCoreRef = useRef<InputCoreForwardRefType>(null);
  const hasFocusRef = useRef<boolean>(false);
  const defaultValueRef = useRef<InputResponseDefaultValueType>(undefined!);
  const responseEventRef = useRef<IInputResponseEventProps<Data>>({
    value: undefined,
    checked: undefined,
    files: undefined,
    data: dataRef.current,
    defaultValue: undefined,
  });

  const themeCore = inputStyle['input-core'];
  const themeStyle = useMemo(() => {
    switch (theme) {
      case 'default':
        return inputStyle['input-theme-default'];
      case 'inherit':
        return '';
      default:
        return theme ?? '';
    }
  }, [theme]);

  const responseEventData = useMemo(
    (): IInputResponseEventProps<Data> => ({
      checked: inputValueState.checked,
      data: dataRef.current,
      defaultValue: defaultValueRef.current,
      files: inputValueState.files,
      value: inputValueState.value,
    }),
    [dataRef, inputValueState.checked, inputValueState.files, inputValueState.value],
  );

  useImperativeHandle(ref, () => {
    const inputCoreElement = inputCoreRef.current?.element || null;
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
      subscribeFocus(callback: (isFocus: boolean) => void) {
        setFocusSubscribeState(() => callback);
      },
    };
  });

  const setIsFirstRender = (value: boolean, useTimeOut: boolean = false) => {
    if (useTimeOut) {
      setTimeout(() => {
        setIsFirstRenderState((prev) => {
          if (value !== prev) return value;
          return prev;
        });
      }, 200);
    } else {
      setIsFirstRenderState((prev) => {
        if (value !== prev) return value;
        return prev;
      });
    }
  };

  const setWidth = useCallback((value: string | number, direction: 'left' | 'right') => {
    if (direction === 'left') {
      setLeftWidthState((prev) => {
        if (prev !== value) return value;
        return prev;
      });
    } else {
      setRightWidthState((prev) => {
        if (prev !== value) return value;
        return prev;
      });
    }
  }, []);

  const setInputValue = useCallback(
    (value: IInputInternalValueState, type: 'object' | 'boolean' | 'string', callback?: () => void) => {
      setInputValueState((prev) => {
        let isEquals: boolean;

        if (type === 'object') {
          isEquals = equals(value, prev);
        } else if (type === 'boolean') {
          isEquals = prev.checked === value.checked;
        } else {
          isEquals = prev.value === value.value;
        }

        callback?.();
        if (!isEquals) return value;
        return prev;
      });
    },
    [],
  );

  const setInputValueWithCallback = useCallback(
    (callback: (prev: IInputInternalValueState) => IInputInternalValueState) => {
      setInputValueState((prev) => callback(prev));
    },
    [],
  );

  const setInputValueFormat = useCallback((formatted: string | undefined) => {
    setInputValueFormatState((prev: InputResponseValueType) => {
      if (formatted !== prev) return formatted;
      return prev;
    });
  }, []);

  const setFocusSubscribe = useCallback((value: boolean) => {
    hasFocusRef.current = value;
  }, []);

  const setBetweenSubscribe = useCallback((beteween: ISubscribeBetween) => {
    setBetweenSubscribeState(beteween);
  }, []);

  const setShowErrorNumeric = useCallback((newModel: IErrorNumberValidation) => {
    setShowErrorNumericState((prev) => {
      const isEquals = equals(newModel, prev);

      if (!isEquals) return newModel;
      return prev;
    });
  }, []);

  const setReset = useCallback(
    (setfocus: boolean = false) => {
      if (nativeType === 'checkbox' || nativeType === 'radio') {
        const defaultValue = defaultValueRef.current as boolean | undefined;
        const value = setDefaultValueInReset ? (defaultValue ?? false) : false;

        setInputValue({ value: undefined, checked: value, files: undefined }, 'boolean');
      } else if (nativeType === 'file' || nativeType === 'image') {
        setInputValue({ value: undefined, checked: undefined, files: undefined }, 'object');
      } else {
        const defaultValue = defaultValueRef.current as string | undefined;
        const value = setDefaultValueInReset ? (defaultValue ?? '') : '';

        setInputValue({ value, checked: undefined, files: undefined }, 'string');
      }
      setShowErrorNumeric({ show: false, type: undefined });
      if (setfocus) {
        setTimeout(() => {
          inputCoreRef.current?.element?.focus();
        }, 0);
      }
    },
    [nativeType, setDefaultValueInReset, setInputValue, setShowErrorNumeric],
  );

  const setResetWithRightElement = useCallback(
    (setfocus: boolean = false) => {
      if (autocomplete?.show) inputCoreRef.current?.resetAutocomplete(false, true);

      setReset(setfocus);
    },
    [autocomplete?.show, setReset],
  );

  const onChangeFunc = useDebouncedCallback((newItem: IInputResponseEventProps<Data>) => {
    onChangeRef.current?.(newItem);
  }, waitTime);

  useEffect(() => {
    isFirstRenderRef.current = isFirstRenderState;
  }, [isFirstRenderState]);

  useLayoutEffect(() => {
    const nativeProps: ICalculateInitialInputValues = {
      checked: nativeInputsProps?.checked,
      defaultChecked: nativeInputsProps?.defaultChecked,
      defaultValue: nativeInputsProps?.defaultValue,
      formatter,
      nativeType,
      sanitize,
      value: nativeInputsProps?.value,
      maxLength,
      isFirstRender: isFirstRenderRef.current,
    };

    const { value, checked, files, defaultValue } = calculateInitialInputValues(nativeProps);

    if (isFirstRenderRef.current === true) defaultValueRef.current = defaultValue;

    if (
      (nativeType === 'checkbox' || nativeType === 'radio') &&
      ((existNativeValueOrChecked && responseEventRef.current.checked !== checked) || isFirstRenderRef.current === true)
    ) {
      setInputValue({ value: undefined, checked, files: undefined }, 'boolean');
      setIsFirstRender(false);
    } else if (
      (nativeType === 'number' || nativeType === 'range') &&
      ((existNativeValueOrChecked && responseEventRef.current.value !== value) || isFirstRenderRef.current === true)
    ) {
      setInputValue({ value, checked: undefined, files: undefined }, 'string');
      setIsFirstRender(false);
    } else if ((nativeType === 'file' || nativeType === 'image') && isFirstRenderRef.current === true) {
      setInputValue({ value: undefined, checked: undefined, files: files }, 'object');
      setIsFirstRender(false);
    } else if (
      nativeType === 'text' &&
      ((existNativeValueOrChecked && responseEventRef.current.value !== value) || isFirstRenderRef.current === true)
    ) {
      setInputValue({ value, checked: undefined, files: undefined }, 'string');
      setIsFirstRender(false);
    } else if (
      nativeType !== 'checkbox' &&
      nativeType !== 'radio' &&
      nativeType !== 'number' &&
      nativeType !== 'range' &&
      nativeType !== 'file' &&
      nativeType !== 'image' &&
      nativeType !== 'text' &&
      ((existNativeValueOrChecked && responseEventRef.current.value !== value) || isFirstRenderRef.current === true)
    ) {
      setInputValue({ value, checked: undefined, files: undefined }, 'string');
      setIsFirstRender(false);
    }
  }, [
    existNativeValueOrChecked,
    formatter,
    maxLength,
    nativeInputsProps?.checked,
    nativeInputsProps?.defaultChecked,
    nativeInputsProps?.defaultValue,
    nativeInputsProps?.value,
    nativeType,
    sanitize,
    setInputValue,
    setInputValueFormat,
  ]);

  useEffect(() => {
    if (isFirstRenderRef.current === false) {
      let value = inputValueState.value;

      if (nativeType === 'number' && value !== undefined) {
        value = sanitizeNumberInput(value, {
          ...sanitizeOptionsRef.current?.onChange,
          maxDecimalDigits: sanitizeMaxDecimalDigits.current,
        });
      }

      const model: IInputResponseEventProps<Data> = {
        value,
        checked: inputValueState.checked,
        files: inputValueState.files,
        defaultValue: defaultValueRef.current,
        data: dataRef.current,
      };

      responseEventRef.current = model;
      onChangeFunc(model);
    }
  }, [
    dataRef,
    inputValueState.checked,
    inputValueState.files,
    inputValueState.value,
    nativeType,
    onChangeFunc,
    sanitizeMaxDecimalDigits,
    sanitizeOptionsRef,
  ]);

  useEffect(() => {
    setShowErrorState((prev: boolean) => {
      const showError = showErrorValidations ?? false;
      if (showError !== prev) return showError;
      return prev;
    });
  }, [showErrorValidations]);

  useEffect(() => {
    if (!isFirstRenderRef.current && resetValue) setReset();
  }, [resetValue, setReset]);

  useEffect(() => {
    if (focusSubscribeState) {
      focusSubscribeState(hasFocusRef.current);
    }
  }, [focusSubscribeState]);

  useEffect(() => {
    if (subscribeBetweenRef.current) {
      const { inRange, isGreater, isLess } = betweenSubscribeState;
      subscribeBetweenRef.current({ inRange, isGreater, isLess });
    }
  }, [betweenSubscribeState, subscribeBetweenRef]);

  useEffect(() => {
    if (formatter && formatter.active && nativeType === 'number' && !hasFocusRef.current) {
      const formatted = numberFormatter(formatter).format(inputValueState.value ?? '');
      setInputValueFormat(formatted);
    }
  }, [formatter, inputValueState.value, nativeType, setInputValueFormat]);

  useEffect(() => {
    console.log('Component-Input');
  }, []);

  if (showSkeleton && isFirstRenderState) {
    return (
      <div
        className={cn(
          themeCore,
          themeStyle,
          'relative flex w-full content-center items-center justify-items-center gap-1 text-center',
          classNameSkeletonContainer || null,
        )}
      >
        <Skeleton className={cn('h-8 w-full rounded-sm bg-ux-skeleton/60', classNameSkeleton || null)} />
      </div>
    );
  }

  return (
    <div className={cn(themeCore, themeStyle, 'w-full space-y-1', classNamePrincipalContainer)}>
      <div className={cn('relative w-full', classNameInputContainer)}>
        <Label
          className={cn(
            labelVariants({ show: showTextLabel || showRequired || showTextRequired, gradient: true }),
            classNameLabel || null,
          )}
          htmlFor={inputCoreRef.current?.inputId}
        >
          {showTextLabel && `${textLabel} `}
          {(showRequired || showTextRequired) && (
            <span className={cn(showErrorState || showErrorNumericState.show ? 'text-destructive' : null)}>
              {showTextRequired && `${textRequired} `}
              {showRequired && '*'}
            </span>
          )}
        </Label>
        <InputCore
          ref={inputCoreRef}
          autocomplete={autocomplete}
          classNameInput={classNameInput}
          inputValue={inputValueState}
          inputValueFormat={inputValueFormatState}
          leftWidth={leftWidthState}
          maxLength={maxLength}
          nativeInputsProps={nativeInputsProps}
          numberValidations={numberValidations}
          rightWidth={rightWidthState}
          setBetweenSubscribe={setBetweenSubscribe}
          setFocusSubscribe={setFocusSubscribe}
          setInputValue={setInputValue}
          setInputValueFormat={setInputValueFormat}
          setInputValueWithCallback={setInputValueWithCallback}
          setIsFirstRender={setIsFirstRender}
          setReset={setReset}
          setShowErrorNumeric={setShowErrorNumeric}
          variantIsError={showErrorState || showErrorNumericState.show}
          variantLeftElement={leftElement?.show || leftElement?.renderContainer ? leftElement?.type : 'default'}
          formatter={formatter}
          sanitize={sanitize}
          theme={theme}
        />
        <LeftElement
          disable={nativeInputsProps?.disabled}
          element={leftElement}
          responseEventData={responseEventData}
          setWidth={setWidth}
          showError={showErrorState}
          showNumericValidationErrors={showErrorNumericState.show}
        />
        <RightElement
          disable={nativeInputsProps?.disabled}
          element={rightElement}
          maxLength={maxLength}
          responseEventData={responseEventData}
          setReset={setResetWithRightElement}
          setWidth={setWidth}
          showError={showErrorState}
          showNumericValidationErrors={showErrorNumericState.show}
        />
      </div>
      {(showErrorState || showErrorNumericState.show) && (
        <ul
          className={cn(
            'mt-2 min-w-full max-w-min list-inside list-none space-y-1 text-xs text-destructive [text-wrap-style:pretty]',
            classNameErrorContainer,
          )}
          role="alert"
          aria-live="polite"
        >
          {showErrorNumericState.type === 'between' && <li>{errorMessages?.between}</li>}
          {showErrorNumericState.type === 'max' && <li>{errorMessages?.limitsMax}</li>}
          {showErrorNumericState.type === 'min' && <li>{errorMessages?.limitsMin}</li>}
          {showErrorState && <li>{errorMessages?.custom}</li>}
        </ul>
      )}
    </div>
  );
}) as <Data, AutoCompData extends string>(
  props: IInputProps<Data, AutoCompData> & { ref?: ForwardedRef<InputForwardRefType> },
) => React.JSX.Element;
