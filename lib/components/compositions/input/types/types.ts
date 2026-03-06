import { INumberFormatterOptions } from '@pl-core/utils/numbers';

interface BasePayload<Data> {
  value: string;
  initialValue: string;
  data: Data;
}

export type TextPayload<Data> = BasePayload<Data> & {
  inputType: 'text';
};

export type NumericPayload<Data> = BasePayload<Data> & {
  inputType: 'number';
  floatValue: number | undefined;
  isComplete: boolean;
};

export type InputChangePayload<Data> = TextPayload<Data> | NumericPayload<Data>;

export type InputType = 'text' | 'number';

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

interface BaseSanitize {
  allowNegative?: boolean;
}

export type ISanitize = BaseSanitize &
  (
    | {
        maxDecimalDigits?: 0;
        decimalSeparator?: '.' | ',';
      }
    | {
        maxDecimalDigits: number;
        decimalSeparator: '.' | ',';
      }
  );

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

export type Timeout = ReturnType<typeof setTimeout>;
