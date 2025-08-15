import { ErrorAction, ErrorState, ISanitize, ISubscribeBetween } from '../types/types';

/**
 * Función que valida si el número escrito no es menor al minínimo permitodo.
 * @param value - String a validar.
 * @param min - Número minimo a validar.
 * @returns boolean
 *  - true: El valor ingresado es menor al mínimo.
 *  - false: El valor ingresaso no es menor al mínimo
 * @example
 * isMinExceeded('5', 10) --> "true ya que el 5 es menor al 10"
 */
export const isMinExceeded = (value: string, min: number | undefined = undefined): boolean => {
  if (min === undefined || value === '') return false;
  return Number(value) < min;
};

/**
 * Función que valida si el número escrito no es mayor al máximo permitodo.
 * @param value - String a validar.
 * @param min - Número máximo a validar.
 * @returns boolean
 *  - true: El valor ingresado es mayor al máximo.
 *  - false: El valor ingresaso no es máximo al máximo.
 * @example
 * isMaxExceeded('10', 5) --> "true ya que el 10 es mayor al 5"
 */
export const isMaxExceeded = (value: string, max: number | undefined = undefined): boolean => {
  if (!max || value === '') return false;
  return Number(value) > max;
};

/**
 * Función que valida si un número se encuentra dentro de un rango de mínimo y máximo.
 * @param value - Streing a validar.
 * @param between - Valores min y max pera el rango.
 * @returns Un objeto con dos propiedades --> { beteween: ISubscribeBetween | undefined; isInvalidRange: boolean }:
 *  - beteween: objeto el cual tiene las siguientes propiedades { isLess: boolean, isGreater: boolean, inRange: boolean };
 *  - isInvalidRange: regresa un 'true' cuando el valor ingresado es menor o mayor al rango y 'false' cuando se ecnuentra dentro del rango.
 */
export const isBetweenExceeded = (
  value: string,
  between: { min: number; max: number } | undefined = undefined,
): { beteween: ISubscribeBetween | undefined; isInvalidRange: boolean } => {
  if (!between || value === '') return { beteween: undefined, isInvalidRange: false };

  const valueNumber = Number(value);
  let invalidRange: boolean = false;
  const response: ISubscribeBetween = { isLess: false, isGreater: false, inRange: false };

  if (valueNumber < between.min) {
    response.isLess = true;
    invalidRange = true;
  } else {
    response.isLess = false;
  }

  if (valueNumber > between.max) {
    response.isGreater = true;
    invalidRange = true;
  } else {
    response.isGreater = false;
  }

  if (valueNumber >= between.min && valueNumber <= between.max) {
    response.inRange = true;
  } else {
    response.inRange = false;
  }
  return { beteween: response, isInvalidRange: invalidRange };
};

/**
 * Función que valida si un string no pasa de un límite de carácteres.
 * @param value - String a validar.
 * @param maxLength - Cantidad de carácteres permitidos.
 * @returns boolean
 *  - true: el string tiene mas carácteres de los permitidos
 *  - false: el string esta dentro de la cantidad máxima de carácteres permitidos.
 */
export const isMaxLengthExceeded = (value: string, maxLength: number | undefined = undefined): boolean => {
  if (!maxLength) return false;
  return value.length > maxLength;
};

export const isPartial = (value: string, decimalSeparator: ISanitize['decimalSeparator'] = '.') => {
  if (!value) return false;
  if (value === '-') return true;
  if (value === decimalSeparator) return true;
  if (value.endsWith(decimalSeparator)) return true;
  return false;
};

export const sanitize = (value: string, sanitize?: ISanitize, maxLength?: number) => {
  const { allowNegative = false, decimalSeparator = '.', maxDecimalDigits } = sanitize || {};

  // // 1. Manejo de borrado completo
  // if (!value) return { value: '', update: true };

  // // 2. Manejo de casos intermedios por ejemplo: '-', '.'
  // // 2.1 Caso el cual se empieza escribiendo un negativo.
  // if (allowNegative && value === '-') return { value: '-', update: false };
  // // 2.2 Caso en el cual se escribe un punto/coma al final.
  // if (
  //   maxDecimalDigits !== 0 &&
  //   value.endsWith(decimalSeparator) &&
  //   value.indexOf(decimalSeparator) === value.lastIndexOf(decimalSeparator)
  // )
  //   return { value, update: false };

  // 3. Sanitización principal
  // 3.1 Se crea un regex para limpiar todo lo que no sea un número o separador.
  const regex = new RegExp(`[^0-9${decimalSeparator}-]`, 'g');
  let sanitized = value.replace(regex, '');

  // 3.2 Si no se permiten negativos eliminamos el signo.
  if (!allowNegative) sanitized = sanitized.replace(/-/g, '');
  // En caso contrario nos aseguramos que solamente exista uno al principio.
  else sanitized = sanitized.replace(/(?!^)-/g, '');

  // 3.3 Permitir un solo separador decimal.
  const separatorRegex = new RegExp(`\\${decimalSeparator}`, 'g');
  const separatorCount = (sanitized.match(separatorRegex) || []).length;

  if (separatorCount > 1) {
    const firstIndex = sanitized.indexOf(decimalSeparator);
    sanitized = sanitized.replace(separatorRegex, (_, offset: number) =>
      offset === firstIndex ? decimalSeparator : '',
    );
  }

  // 4 Aplicando límite de dcimales
  if (maxDecimalDigits !== undefined) {
    const parts = sanitized.split(decimalSeparator);
    if (parts[1] && parts[1].length > maxDecimalDigits) {
      parts[1] = parts[1].substring(0, maxDecimalDigits);
      sanitized = parts.join(decimalSeparator);
    }
  }

  // 5 Aplicando maxLength
  if (maxLength && sanitized.length > maxLength) sanitized = sanitized.slice(0, maxLength);

  return sanitized;
};

export const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'ADD_ERROR': {
      const { key, message } = action.payload;

      if (state.get(key) === message || message === '') return state;

      const newState = new Map(state);
      newState.set(key, message);
      return newState;
    }
    case 'REMOVE_ERROR': {
      const { key } = action.payload;

      if (!state.has(key)) return state;

      const newState = new Map(state);
      newState.delete(key);
      return newState;
    }
    case 'CLEAR_ERRORS': {
      if (!state.size) return state;
      return new Map();
    }
    default:
      return state;
  }
};
