import { INumberFormatterOptions } from 'ux-pl/utils/numbers';

interface BasePayload<Data> {
  value: string;
  initialValue: string;
  data: Data | undefined;
}

export type TextPayload<Data> = BasePayload<Data>;

export type NumericPayload<Data> = BasePayload<Data> & {
  floatValue: number | null;
  isComplete: boolean;
};

export type InputChangePayload<Data> = TextPayload<Data> | NumericPayload<Data>;

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

export interface ISanitize {
  maxDecimalDigits?: number;
  allowNegative?: boolean;
  decimalSeparator?: '.' | ',';
}

export type ErrorState = Map<string, string>;

export type ErrorAction =
  | { type: 'ADD_ERROR'; payload: { key: string; message: string } }
  | { type: 'REMOVE_ERROR'; payload: { key: string } }
  | { type: 'CLEAR_ERRORS' };

export const ErrorKeys = Object.freeze({
  maxLength: 'max_length',
  limitsMin: 'limits_min',
  limitsMax: 'limits_max',
  between: 'between',
  custom: 'custom',
});

export interface ResolvedVariantsProps {
  between?: IValidationBetween;
  formatter?: IFormatter;
  limits?: IValidationLimits;
  maxLength?: number;
  sanitize?: ISanitize;
}
