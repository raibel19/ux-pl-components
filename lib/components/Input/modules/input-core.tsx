import { ForwardedRef, forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef } from 'react';
import { createFileList, fileHash } from 'ux-pl/utils/file';
import { numberFormatter } from 'ux-pl/utils/numbers';

import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import {
  isBetweenExceeded,
  isMaxExceeded,
  isMaxLengthExceeded,
  isMinExceeded,
  sanitizeNumberInput,
} from '../helpers/utils';
import { inputVariants } from '../helpers/variants';
import {
  AutocompleteForwardRefType,
  IErrorNumberValidation,
  IInputCoreProps,
  IInputPropsValue,
  InputCoreForwardRefType,
} from '../interfaces/internals';
import Autocomplete from './autocomplete';

export default forwardRef(function InputCore<Data, AutoCompData extends string>(
  props: IInputCoreProps<Data, AutoCompData>,
  ref: ForwardedRef<InputCoreForwardRefType>,
) {
  const {
    autocomplete,
    classNameInput,
    formatter,
    inputValue,
    inputValueFormat,
    leftWidth,
    maxLength,
    nativeInputsProps,
    numberValidations,
    rightWidth,
    sanitize,
    setBetweenSubscribe,
    setFocusSubscribe,
    setInputValue,
    setInputValueFormat,
    setInputValueWithCallback,
    setIsFirstRender,
    setReset,
    setShowErrorNumeric,
    variantIsError,
    variantLeftElement,
  } = props;

  const betweenOptions = numberValidations?.between;
  const fileMultiple = nativeInputsProps?.multiple;
  const limitsOptions = numberValidations?.limits;
  const nativeType = nativeInputsProps!.type;
  const onBlur = nativeInputsProps?.onBlur;
  const onFocus = nativeInputsProps?.onFocus;

  const id = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<AutocompleteForwardRefType>(null);

  const inputId = useMemo(() => (nativeInputsProps?.id ? nativeInputsProps.id : id), [id, nativeInputsProps?.id]);

  const inputPropsValues = useMemo((): IInputPropsValue => {
    if (nativeType === 'checkbox' || nativeType === 'radio') {
      return { value: undefined, checked: inputValue.checked ?? false };
    }

    if (nativeType === 'file' || nativeType === 'image') {
      return { value: undefined, checked: undefined };
    }

    return { value: inputValueFormat || inputValue.value, checked: undefined };
  }, [inputValue.checked, inputValue.value, inputValueFormat, nativeType]);

  useImperativeHandle(ref, () => {
    const autoCompRef = autoCompleteRef.current;
    const autoCompIsShow = autocomplete?.show ?? false;

    return {
      element: autoCompIsShow ? (autoCompRef?.element ?? null) : inputRef.current,
      inputId,
      resetAutocomplete: (isResetInput = false, resetOpen = false) => {
        if (autoCompRef) autoCompRef.reset(isResetInput, resetOpen);
      },
    };
  });

  const validateBetweenNumbers = useCallback(
    (valueSantize: string) => {
      let resetInput = false;
      let showError = false;
      let errorType: IErrorNumberValidation['type'] = undefined;

      if (!valueSantize || !betweenOptions) return { resetInput, showError, errorType };

      const { reset, showError: showErrorBetween } = betweenOptions;
      const response = isBetweenExceeded(valueSantize, betweenOptions);
      const isInvalidRange = response.isInvalidRange;

      if (response.beteween) {
        setBetweenSubscribe(response.beteween);
      }

      if (isInvalidRange) {
        if (reset) resetInput = true;
        if (showErrorBetween) showError = true;
        errorType = 'between';
      }

      return { resetInput, showError, errorType };
    },
    [betweenOptions, setBetweenSubscribe],
  );

  const validateLimitsNumbers = useCallback(
    (valueSantize: string) => {
      let resetInput = false;
      let showError = false;
      let errorType: IErrorNumberValidation['type'] = undefined;

      if (valueSantize && limitsOptions) {
        const { max, min, reset, showError: showErrorLimits } = limitsOptions;
        const isMinExceededValue = isMinExceeded(valueSantize, min);
        const isMaxExceededValue = isMaxExceeded(valueSantize, max);

        if (isMinExceededValue || isMaxExceededValue) {
          if (reset) resetInput = true;
          if (showErrorLimits) showError = true;
          if (isMinExceededValue) errorType = 'min';
          else errorType = 'max';
        }
      }

      return { resetInput, showError, errorType };
    },
    [limitsOptions],
  );

  const validateNumericOnBlur = useCallback(
    (value: string) => {
      const valueSantize = sanitizeNumberInput(value);
      let resetInput = false;
      let showError = false;
      let errorType: IErrorNumberValidation['type'] = undefined;

      const resultsBetween = validateBetweenNumbers(valueSantize);
      if (resultsBetween.errorType === 'between') {
        resetInput = resultsBetween.resetInput;
        showError = resultsBetween.showError;
        errorType = resultsBetween.errorType;
      }

      const resultLimit = validateLimitsNumbers(valueSantize);
      if (resultLimit.errorType === 'max' || resultLimit.errorType === 'min') {
        resetInput = resultLimit.resetInput;
        showError = resultLimit.showError;
        errorType = resultLimit.errorType;
      }

      if ((valueSantize && betweenOptions) || (valueSantize && limitsOptions)) {
        setShowErrorNumeric({ show: showError, type: errorType });
      } else {
        setShowErrorNumeric({ show: false, type: undefined });
      }

      if (resetInput) {
        setInputValue({ value: '', checked: undefined, files: undefined }, 'string');
        setInputValueFormat('');
      } else {
        const formatted = numberFormatter(formatter).format(valueSantize);
        setInputValueFormat(formatted);
      }
    },
    [
      betweenOptions,
      formatter,
      limitsOptions,
      setInputValue,
      setInputValueFormat,
      setShowErrorNumeric,
      validateBetweenNumbers,
      validateLimitsNumbers,
    ],
  );

  const validateStringLength = useCallback(
    (value: string) => {
      if (maxLength === 0) return false;
      const isExceeded = isMaxLengthExceeded(value, maxLength);
      return isExceeded;
    },
    [maxLength],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      onFocus?.(event);
      setFocusSubscribe(true);

      if (nativeType === 'number') {
        setInputValueFormat('');
      }
    },
    [nativeType, onFocus, setFocusSubscribe, setInputValueFormat],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      onBlur?.(event);
      setFocusSubscribe(false);

      if (nativeType !== 'number') return;

      validateNumericOnBlur(event.target.value);
    },
    [nativeType, onBlur, setFocusSubscribe, validateNumericOnBlur],
  );

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked, files } = event.target;
      let newValue: string | boolean | FileList | undefined;

      switch (nativeType) {
        case 'checkbox':
        case 'radio':
          newValue = checked;
          break;
        case 'file':
          newValue = files ? createFileList(Array.from(files)) : undefined;
          break;
        case 'number':
          newValue = sanitizeNumberInput(value, {
            ...sanitize?.onInput,
            maxDecimalDigits: sanitize?.maxDecimalDigits,
          });
          // Detener si se excede el máximo de caracteres
          if (validateStringLength(newValue)) return;
          break;
        case 'text':
          newValue = value;
          // Detener si se excede el máximo de caracteres
          if (validateStringLength(newValue)) return;
          break;
        default:
          newValue = value;
          break;
      }

      setIsFirstRender(false);

      if (newValue instanceof FileList) {
        const newFilesMapList = new Map<string, File>();
        const filesArray = Array.from(newValue);
        const promises = filesArray.map((item) => fileHash(item));

        await Promise.all(promises).then((hashes) => {
          for (const [idx, hash] of hashes.entries()) {
            newFilesMapList.set(hash, filesArray[idx]);
          }
        });

        setInputValueWithCallback((prev) => {
          if (newFilesMapList.size === 0) return prev;

          if (!fileMultiple) {
            return { value: undefined, checked: undefined, files: newFilesMapList };
          }

          const clonePrev = prev.files ? new Map(prev.files) : new Map<string, File>();

          newFilesMapList.forEach((file, hash) => {
            if (!clonePrev.has(hash)) clonePrev.set(hash, file);
          });

          if (clonePrev.size === prev.files?.size) return prev;
          return { value: undefined, checked: undefined, files: clonePrev };
        });
      } else if (typeof newValue === 'boolean') {
        setInputValue({ value: undefined, checked: newValue, files: undefined }, 'boolean');
      } else {
        setInputValue({ value: newValue, checked: undefined, files: undefined }, 'string');
      }
    },
    [
      fileMultiple,
      nativeType,
      sanitize?.maxDecimalDigits,
      sanitize?.onInput,
      setInputValue,
      setInputValueWithCallback,
      setIsFirstRender,
      validateStringLength,
    ],
  );

  useEffect(() => {
    console.log('Component-InputCore');
  }, []);

  return (
    <>
      {autocomplete?.show ? (
        <Autocomplete
          ref={autoCompleteRef}
          data={autocomplete}
          handleBlurInput={handleBlur}
          handleFocusInput={handleFocus}
          resetInput={setReset}
          setInputValue={setInputValue}
          setIsFirstRender={setIsFirstRender}
          validateStringLength={validateStringLength}
          valueInput={inputValue.value}
          nativeInputsProps={nativeInputsProps}
          variantIsError={variantIsError}
          variantLeftElement={variantLeftElement}
          classNameInput={classNameInput}
          leftWidth={leftWidth}
          rightWidth={rightWidth}
        />
      ) : (
        <Input
          ref={inputRef}
          {...nativeInputsProps}
          id={inputId}
          {...inputPropsValues}
          defaultValue={undefined}
          defaultChecked={undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          type={nativeType === 'number' ? 'text' : (nativeType ?? 'text')}
          inputMode={nativeType === 'number' ? 'decimal' : 'text'}
          className={cn(
            inputVariants({
              leftElement: variantLeftElement,
              isError: variantIsError,
            }),
            classNameInput || null,
          )}
          style={{ '--leftWidth': `${leftWidth}`, '--rightWidth': `${rightWidth}` } as React.CSSProperties}
        />
      )}
    </>
  );
}) as <Data, AutoCompData extends string>(
  props: IInputCoreProps<Data, AutoCompData> & { ref: ForwardedRef<InputCoreForwardRefType> },
) => React.JSX.Element;
