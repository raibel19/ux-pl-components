import { numberFormatter } from '@/lib/helpers/numbers';

import { IInputResponseEventProps, InputResponseDefaultValueType, InputResponseValueType } from '../interfaces';
import { ICalculateInitialInputValues } from '../interfaces/internals';
import { isMaxLengthExceeded, sanitizeNumberInput } from './utils';

const validateMaxLengtNumbers = (value: string, maxLength: number | undefined) => {
  if (maxLength === 0) return false;
  const isExceeded = isMaxLengthExceeded(value, maxLength);
  return isExceeded;
};

export const calculateInitialInputValues = <Data>(props: ICalculateInitialInputValues) => {
  const {
    checked: checkedProp,
    defaultChecked: defaultCheckedProp,
    defaultValue: defaultValueProp,
    formatter: formatterProp,
    nativeType: nativeTypeProp,
    sanitize: sanitizeProp,
    value: valueProp,
    maxLength: maxLengthProp,
    isFirstRender: isFirstRenderProp,
  } = props;

  const nativeType = nativeTypeProp!;
  const sanitizeOptions = sanitizeProp;
  const formatterOptions = formatterProp;

  let initialValue: IInputResponseEventProps<Data>['value'] = undefined;
  let initialChecked: IInputResponseEventProps<Data>['checked'] = undefined;
  let initialFiles: IInputResponseEventProps<Data>['files'] = undefined;

  let currentDefaultValue: InputResponseDefaultValueType = undefined;
  let initialValueFormat: InputResponseValueType = '';

  if (nativeType === 'checkbox' || nativeType === 'radio') {
    const checked = checkedProp;
    const defaultChecked = defaultCheckedProp;
    const value = checked !== undefined ? checked : (defaultChecked ?? false);

    if (isFirstRenderProp) currentDefaultValue = value;
    initialChecked = value;
  } else if (nativeType === 'number' || nativeType === 'range') {
    const currentValue = valueProp;
    const defaultValue = defaultValueProp;
    const resolvedValue = currentValue !== undefined ? currentValue : (defaultValue ?? '');
    let value = '';
    let valueFormatted = '';

    if (typeof resolvedValue === 'number') value = resolvedValue.toString();
    if (typeof resolvedValue === 'string') value = resolvedValue.trim();

    value = sanitizeNumberInput(value, {
      ...sanitizeOptions?.onPropertyEntry,
      maxDecimalDigits: sanitizeOptions?.maxDecimalDigits,
    });

    if (nativeType !== 'range') {
      if (validateMaxLengtNumbers(value, maxLengthProp)) {
        value = '';
        valueFormatted = '';
      } else {
        const formatted = numberFormatter(formatterOptions).format(value);
        valueFormatted = formatted;
      }
      initialValueFormat = valueFormatted;
    }

    if (isFirstRenderProp) currentDefaultValue = value;
    initialValue = value;
  } else if (nativeType === 'file' || nativeType === 'image') {
    if (isFirstRenderProp) currentDefaultValue = undefined;
    initialFiles = undefined;
  } else if (nativeType === 'text') {
    const currentValue = valueProp;
    const defaultValue = defaultValueProp;
    const resolvedValue = currentValue !== undefined ? currentValue : (defaultValue ?? '');
    let value = '';

    if (typeof resolvedValue === 'number') value = resolvedValue.toString();
    if (typeof resolvedValue === 'string') value = resolvedValue.trim();
    if (validateMaxLengtNumbers(value, maxLengthProp)) value = '';

    if (isFirstRenderProp) currentDefaultValue = value;
    initialValue = value;
  } else if (
    nativeType !== 'checkbox' &&
    nativeType !== 'radio' &&
    nativeType !== 'number' &&
    nativeType !== 'range' &&
    nativeType !== 'file' &&
    nativeType !== 'image' &&
    nativeType !== 'text'
  ) {
    const currentValue = valueProp;
    const defaultValue = defaultValueProp;
    const resolvedValue = currentValue !== undefined ? currentValue : (defaultValue ?? '');
    let value = '';

    if (typeof resolvedValue === 'number') value = resolvedValue.toString();
    if (typeof resolvedValue === 'string') value = resolvedValue.trim();

    if (isFirstRenderProp) currentDefaultValue = value;
    initialValue = value;
  }

  return {
    value: initialValue,
    checked: initialChecked,
    files: initialFiles,
    defaultValue: currentDefaultValue,
    valueFormat: initialValueFormat,
  };
};
