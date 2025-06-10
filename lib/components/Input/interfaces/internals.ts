import { VariantProps } from 'class-variance-authority';
import { HTMLInputTypeAttribute, InputHTMLAttributes, MutableRefObject, ReactNode } from 'react';

import { inputVariants } from '../helpers/variants';
import { IInputResponseEventProps, InputResponseValueType } from './index';
import {
  IAutocomplete,
  IAutoCompleteItems,
  IElement,
  IFormatter,
  IInputProps,
  IInputValidations,
  IInputValidationsSanitize,
  IRightElement,
  ISubscribeBetween,
} from './input';

export type IInputInternalValueState = Omit<IInputResponseEventProps<unknown>, 'defaultValue' | 'data'>;

type DirectionType = 'left' | 'right';

interface IElementBasicProps<Data> {
  disable: boolean | undefined;
  element: IElement<Data> | undefined;
  showError: boolean;
  showNumericValidationErrors: boolean;
  responseEventData: IInputResponseEventProps<Data>;
}

export interface ILeftElementProps<Data> extends IElementBasicProps<Data> {
  setWidth: (value: string | number, direction: DirectionType) => void;
}

export interface IRightElementProps<Data> extends Omit<IElementBasicProps<Data>, 'element'> {
  element: IRightElement<Data> | undefined;
  maxLength: number | undefined;
  setReset: (setfocus?: boolean) => void;
  setWidth: (value: string | number, direction: DirectionType) => void;
}

export interface IRightElementItemsProps<Data> extends Omit<IElementBasicProps<Data>, 'element'> {
  existLastElement: boolean;
  identifier: string;
  idx: number;
  item: IElement<Data>;
  length: number;
}

export interface IElementsProps<Data> extends IElementBasicProps<Data> {
  isLastElement: boolean;
  position: DirectionType;
}

export interface ICounterProps {
  classNameCounterContainer: string | undefined;
  classNameCounterInfinityIcon: string | undefined;
  isLastElement: boolean;
  maxLength: number | undefined;
  showError: boolean;
  showNumericValidationErrors: boolean;
  value: InputResponseValueType;
}

export interface IErrorNumberValidation {
  show: boolean;
  type: 'min' | 'max' | 'between' | undefined;
}

export interface ISeparator {
  isError: boolean;
  isLastElement: boolean;
  show: boolean | undefined;
}

export interface ISkeleton {
  className: string | undefined;
  copyCount?: number;
}

export interface IInputPropsValue {
  value: string | undefined;
  checked: boolean | undefined;
}

export interface IAutocompleteProps<Data, AutoCompData extends string> {
  data: IAutocomplete<AutoCompData>;
  handleBlurInput: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  handleFocusInput: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  resetInput: (setfocus?: boolean) => void;
  setInputValue: (
    value: IInputInternalValueState,
    type: 'object' | 'boolean' | 'string',
    callback?: () => void,
  ) => void;
  setIsFirstRender: (value: boolean, useTimeOut?: boolean) => void;
  validateStringLength: (value: string) => boolean;
  valueInput: InputResponseValueType;
  nativeInputsProps: IInputProps<Data, AutoCompData>['nativeInputsProps'];
  variantIsError: VariantProps<typeof inputVariants>['isError'];
  variantLeftElement: VariantProps<typeof inputVariants>['leftElement'];
  classNameInput: string | undefined;
  leftWidth: string | number;
  rightWidth: string | number;
}

export type AutocompleteForwardRefType = {
  element: HTMLInputElement | null;
  reset: (resetInput?: boolean, resetOpen?: boolean) => void;
};

export interface IAutocompleteItemsExtend<AutoCompData extends string> extends IAutoCompleteItems<AutoCompData> {
  identifier: string;
}

export interface IAutocompleteInputProps<Data, AutoCompData extends string> {
  autocompleteProps: Pick<
    IAutocompleteProps<Data, AutoCompData>,
    | 'classNameInput'
    | 'handleBlurInput'
    | 'handleFocusInput'
    | 'leftWidth'
    | 'nativeInputsProps'
    | 'rightWidth'
    | 'setInputValue'
    | 'setIsFirstRender'
    | 'validateStringLength'
    | 'valueInput'
    | 'variantIsError'
    | 'variantLeftElement'
  >;
  inputSelectedValueState: string;
  itemsState: Map<string, IAutocompleteItemsExtend<AutoCompData>>;
  minLingthValue: number;
  onBlurConfig: IAutocomplete<AutoCompData>['onBlurConfig'];
  prevInputSelectedValueRef: MutableRefObject<string>;
  reset: ({ resetInput, resetOpen }: IResetFnc) => void;
  setIsLoadingFnc: (value: boolean) => void;
  setOpenFnc: (value: boolean | undefined, func?: ((prev: boolean) => boolean | undefined | void) | undefined) => void;
}

export type IAutocompleteInputForwardRefType = {
  element: HTMLInputElement | null;
};

interface IAutocompleteListBaseProps<AutoCompData extends string> {
  classNamePopoverScrollArea: IAutocomplete<AutoCompData>['classNamePopoverScrollArea'];
  handleOnSelect: (identifier: string) => void;
  hidden: boolean;
  inputSelectedValueState: string;
  itemIconSelected: ReactNode;
  itemsState: Map<string, IAutocompleteItemsExtend<AutoCompData>>;
  showIconSelected: boolean | undefined;
}

export interface IAutocompleteListVirtualizerProps<AutoCompData extends string>
  extends IAutocompleteListBaseProps<AutoCompData> {
  commandValueState: string;
  openState: boolean;
}

export interface IAutocompleteListProps<AutoCompData extends string> extends IAutocompleteListBaseProps<AutoCompData> {
  commandValueState: string;
  openState: boolean;
}

export interface IAutocompleteListItemProps<AutoCompData extends string>
  extends IAutocompleteItemsExtend<AutoCompData> {
  classNamePopoverScrollArea: IAutocomplete<AutoCompData>['classNamePopoverScrollArea'];
  disable?: boolean;
  handleOnSelect: (identifier: string) => void;
  inputSelectedValueState?: string;
  itemIconSelected: ReactNode;
  showIconSelected?: boolean;
}

export interface IAutocompleteListHeaderProps<AutoCompData extends string> {
  classNamePopoverHeader: IAutocomplete<AutoCompData>['classNamePopoverHeader'];
  inputSelectedValueState: string;
  messages: IAutocomplete<AutoCompData>['messages'];
  reset: ({ resetInput, resetOpen }: IResetFnc) => void;
}

export interface IInputCoreProps<Data, AutoCompData extends string> {
  autocomplete: IAutocomplete<AutoCompData> | undefined;
  classNameInput: string | undefined;
  formatter?: IFormatter;
  inputValue: IInputInternalValueState;
  inputValueFormat: InputResponseValueType;
  leftWidth: string | number;
  maxLength: number | undefined;
  nativeInputsProps: IInputProps<Data, AutoCompData>['nativeInputsProps'];
  numberValidations: IInputValidations['number'];
  rightWidth: string | number;
  sanitize?: IInputValidationsSanitize;
  setBetweenSubscribe: (beteween: ISubscribeBetween) => void;
  setFocusSubscribe: (value: boolean) => void;
  setInputValue: (
    value: IInputInternalValueState,
    type: 'object' | 'boolean' | 'string',
    callback?: () => void,
  ) => void;
  setInputValueFormat: (formatted: string | undefined) => void;
  setInputValueWithCallback: (callback: (prev: IInputInternalValueState) => IInputInternalValueState) => void;
  setIsFirstRender: (value: boolean, useTimeOut?: boolean) => void;
  setReset: (setfocus?: boolean) => void;
  setShowErrorNumeric: (newModel: IErrorNumberValidation) => void;
  variantIsError: VariantProps<typeof inputVariants>['isError'];
  variantLeftElement: VariantProps<typeof inputVariants>['leftElement'];
}

export type InputCoreForwardRefType = {
  element: HTMLInputElement | null;
  inputId: string;
  resetAutocomplete: (resetInput?: boolean, resetOpen?: boolean) => void;
};

export interface ICalculateInitialInputValues {
  checked: InputHTMLAttributes<HTMLInputElement>['checked'];
  defaultChecked: InputHTMLAttributes<HTMLInputElement>['defaultChecked'];
  defaultValue: InputHTMLAttributes<HTMLInputElement>['defaultValue'];
  formatter: IFormatter | undefined;
  isFirstRender: boolean;
  maxLength: number | undefined;
  nativeType: HTMLInputTypeAttribute | undefined;
  sanitize: IInputValidationsSanitize | undefined;
  value: InputHTMLAttributes<HTMLInputElement>['value'];
}

export interface IResetFnc {
  resetInput?: boolean;
  resetOpen?: boolean;
}

export const nonOpeningKeys = [
  // Modificadores (no abren por sí solos)
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'CapsLock',
  'NumLock',
  // Navegación
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Tab',
  // Teclas de Función
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  // Enter y Escape
  'Enter',
  'Escape',
];
