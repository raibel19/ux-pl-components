import { INumberFormatterOptions } from 'ux-pl/utils/numbers';

export interface InputChangePayload<Data> {
  value: string;
  //   checked: boolean | undefined;
  //   files: Map<string, File> | undefined;
  //   defaultValue: string | number | boolean | undefined;
  initialValue: string;
  data: Data | undefined;
}

export type InputType = 'text' | 'number';

export type InputTheme = 'default' | 'inherit' | (string & {});

export interface ISubscribeBetween {
  inRange: boolean;
  isGreater: boolean;
  isLess: boolean;
}

export interface IFormatter extends INumberFormatterOptions {
  active?: boolean;
}

export interface IValidationLimits {
  max?: number;
  maxMessageError?: string;
  min?: number;
  minMessageError?: string;
}

export interface IValidationBetween {
  max: number;
  min: number;
  messageError?: string;
  subscribeBetween?: (_: { isLess: boolean; isGreater: boolean; inRange: boolean }) => void;
}

export interface ISanitizeConfig {
  maxDecimalDigits?: number;
  removeDecimalPoint?: boolean;
  removeDecimalPointIfSingleCharacter?: boolean;
  removeDotIfLastCharacter?: boolean;
  removeNegativeIfSingleCharacter?: boolean;
  removeNegativeSign?: boolean;
}

export interface ISanitize {
  initialValue?: ISanitizeConfig;
  maxDecimalDigits?: number;
  onChangeEvent?: ISanitizeConfig;
  whileTyping?: ISanitizeConfig;
}

export type ErrorState = Map<string, string>;

export type ErrorAction =
  | { type: 'ADD_ERROR'; payload: { key: string; message: string | string[] } }
  | { type: 'REMOVE_ERROR'; payload: { key: string } }
  | { type: 'CLEAR_ERRORS' };

export const ErrorKeys = Object.freeze({
  maxLength: 'max_length',
  limitsMin: 'limits_min',
  limitsMax: 'limits_max',
  between: 'between',
  custom: 'custom',
});
