import { ErrorAction, ErrorState, ISanitizeConfig, ISubscribeBetween } from '../types/types';

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
 * Función para sanitizar un string, esta sanitización se centra en validaciones para números.
 * @param value - String a sanitizar
 * @param config - Opciones para configurar el resultado de la sanitación
 * @returns String sanitizado
 */
export const sanitizeNumber = (value: string, config: ISanitizeConfig = {}): string => {
  const {
    removeDecimalPoint = false,
    removeNegativeSign = false,
    removeDotIfLastCharacter = true,
    removeDecimalPointIfSingleCharacter = true,
    removeNegativeIfSingleCharacter = true,
    maxDecimalDigits = undefined,
  } = config;
  let numericValue = value.replace(/[^0-9.-]/g, '');

  if (maxDecimalDigits !== undefined) {
    const regex = new RegExp(`^([-+]?(?:\\d+)?(?:\\.\\d{0,${maxDecimalDigits}})?).*$`);
    numericValue = numericValue.replace(regex, '$1');

    // Si el último caracter es un punto lo elimina.
    if (maxDecimalDigits === 0) numericValue = numericValue.replace(/\.$/, '');
  }

  if (removeDecimalPoint) {
    // Eliminamos todos puntos.
    numericValue = numericValue.replace(/\./g, '');
  } else {
    numericValue = numericValue
      // Marcamos el primer punto encontrado.
      .replace('.', 'x')
      // Eliminamos otros puntos.
      .replace(/\./g, '')
      // Restauramos el primer punto.
      .replace('x', '.');
  }

  if (removeNegativeSign) {
    // Eliminamos todos guiones.
    numericValue = numericValue.replace(/-/g, '');
  } else {
    // Eliminamos guiones que no están al inicio.
    numericValue = numericValue.replace(/(?!^)-/g, '');
  }

  if (removeDotIfLastCharacter) {
    // Si el último caracter es un punto lo elimina.
    numericValue = numericValue.replace(/\.$/, '');
  }

  if (removeDecimalPointIfSingleCharacter && numericValue === '.') {
    numericValue = '';
  }

  if (removeNegativeIfSingleCharacter && numericValue === '-') {
    numericValue = '';
  }

  return numericValue;
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

export const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  const newState = new Map(state);

  switch (action.type) {
    case 'ADD_ERROR': {
      const messages = action.payload.message;
      const errors = Array.isArray(messages) ? messages : [messages];
      const validMessages = errors.filter((msg) => msg.trim() !== '');

      if (!validMessages.length) return newState;

      validMessages.forEach((item) => newState.set(action.payload.key, item));
      return newState;
    }
    case 'REMOVE_ERROR': {
      newState.delete(action.payload.key);
      return newState;
    }
    case 'CLEAR_ERRORS': {
      return new Map();
    }
    default:
      return state;
  }
};
