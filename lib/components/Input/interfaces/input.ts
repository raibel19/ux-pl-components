import { ComponentPropsWithoutRef, Dispatch, ReactNode, SetStateAction } from 'react';
import { INumberFormatterOptions } from 'ux-pl/utils/numbers';

import { IInputResponseEventProps } from '.';

export interface ISubscribeBetween {
  /**
   * El valor es menor al rango permitido.
   */
  isLess: boolean;
  /**
   * El valor es mayor al rango permitido.
   */
  isGreater: boolean;
  /**
   * El valor se encuentra dentro del rango permitido.
   */
  inRange: boolean;
}

export interface IInputValidationsBetween {
  /**
   * Valor mínimo que se puede ingresar.
   */
  min: number;
  /**
   * Valor máximo que se puede ingresar.
   */
  max: number;
  /**
   * Resetea el Input cuando el número no se encuentra dentro del rango de min y max.
   * @default false
   */
  reset?: boolean;
  /**
   * true: Pasa el input a modo error, es decir, pintando el border y los textos de color rojo siempre y cuando no se cumplan los rangos establecidos.
   *
   * false: Aunque no se cumplan los rangos establecidos no pasara el input a modo error.
   *
   * <strong style="color:red">Nota:</strong> Esta prop aunque se llama igual no es la misma que "validations -> showError", esta prop solamente controlará el error de between.
   *
   * <strong style="color:red">Nota:</strong> El cambio se vera al momento de perder el foco en el Input.
   * @default false
   */
  showError?: boolean;
  /**
    * Funcion de subscripcion el cual nos indicará si el numero ingresado es menor, mayor o esta dentro del rango establecido en las props min y max.
    * 
    * <strong style="color:red">Nota:</strong> La llamada de de esta funcion de subscripción siempre se hará cuando el input pierda el foco.
    * @param isLess Indica si el número ingresado es menor a la prop min.
    * @param isGreater Indica si el número ingresado es mayor a la prop max.
    * @param inRange Indica si el número ingresado se encuentra dentro del rango min y max.
    * @default undefined
    * @returns void
    * @example
    * validations={{
       between: {
         min: 5,
         max: 15,
         subscribeBetween: (isLess, isGreater, inRange) => {
           console.log('subscribeBetween', {
             isLess,
             isGreater,
             inRange,
           });
         },
         reset: false,
         showError: true,
       },
     }} 
    */
  subscribeBetween?: (_: { isLess: boolean; isGreater: boolean; inRange: boolean }) => void;
}

export interface IInputValidationsLimits {
  /**
   * Valor mínimo que se puede ingresar.
   *
   * <strong style="color:red">Nota:</strong> Esta validacion solamente funciona con el tipo del input numérico y se activa cuando pierde el foco.
   *
   * <strong style="color:red">Nota:</strong> Si se requiere crear un rango para validar usar la prop "between"
   *
   * <strong style="color:red">Nota:</strong> A diferencia de "max" el valor de 0 si cuenta como valor mínimo.
   * @default undefined
   * @example
   * 10 ===> No podrá ingresar un número menor a este.
   */
  min?: number;
  /**
   * Valor máximo que se puede ingresar.
   *
   * <strong style="color:red">Nota:</strong> Esta validacion solamente funciona con el tipo del input numérico y se activa cuando pierde el foco.
   *
   * <strong style="color:red">Nota:</strong> Si se requiere crear un rango para validar usar la prop "between"
   *
   * <strong style="color:red">Nota:</strong> Si no se requiere esta validación se tiene que asignar el valor de 0 o dejar undefined.
   * @default undefined
   * @example
   * 10 ====> No podrá ingresar un número mayor a este.
   */
  max?: number;
  /**
   * Resetea el Input cuando el número sea menor o mayor a los valores establecidos en las props min y max.
   * @default
   * false
   */
  reset?: boolean;
  /**
   * true: Pasa el input a modo error, es decir, pintando el border y los textos de color rojo siempre y cuando no se cumplan alguna de las validaciones establecidas.
   *
   * false: Aunque no pase las validaciones no pasara el input a modo error.
   *
   * <strong style="color:red">Nota:</strong> Esta prop aunque se llama igual no es la misma que "validations -> showError", esta prop solamente controlará el error de limits.
   *
   * <strong style="color:red">Nota:</strong> El cambio se vera al momento de perder el foco en el Input.
   * @default
   * true
   */
  showError?: boolean;
}

export interface ISanitizeNumberInputOptions {
  /**
   * true: Elimina el punto decimal
   *
   * false: conserva el punto decimal.
   * @default
   * Prop propertyEntry: false;
   * Prop onChange: false;
   * Función sanitizeNumberInput: false;
   */
  removeDecimalPoint?: boolean;
  /**
   * true: Elimina el simbolo negativo
   *
   * false: conserva el simbolo negativo.
   * @default
   * Prop propertyEntry: false;
   * Prop onChange: false;
   * Función sanitizeNumberInput: false;
   */
  removeNegativeSign?: boolean;
  /**
   * true: Si el ultimo carácter es un punto lo elimina
   *
   * false: si el último caracter es un punto lo conserva
   * @default
   * Prop propertyEntry: true;
   * Prop onChange: false;
   * Función sanitizeNumberInput: true;
   */
  removeDotIfLastCharacter?: boolean;
  /**
   * true: Si el texto es '.' elimina el punto
   *
   * false: Si el texto es '.' converva el punto.
   * @default
   * Prop propertyEntry: true;
   * Prop onChange: false;
   * Función sanitizeNumberInput: true;
   * @example
   * '.' ===> '';
   */
  removeDecimalPointIfSingleCharacter?: boolean;
  /**
   * true: Si el texto es '-' elimina el negativo
   *
   * false: Si el texto es '-' converva el negativo.
   * @default
   * Prop propertyEntry: true;
   * Prop onChange: false;
   * Función sanitizeNumberInput: true;
   * @example
   * '-' ===> '';
   */
  removeNegativeIfSingleCharacter?: boolean;
  /**
   * Número máximo de decimales permitidos.
   *
   * @default
   * Prop propertyEntry: 2;
   * Prop onChange: 2;
   * Función sanitizeNumberInput: 2;
   */
  maxDecimalDigits?: number;
}

export interface IInputValidationsSanitize {
  /**
   * Número máximo de decimales permitidos.
   *
   * Nota: La funcionalidad de esta propiedad se centra en controlar los decimales de las configuraciónes que tenemos disponibles ("propertyEntry" y "onChange"), por lo tanto el valor ingresado en esta propiedad se usará y afectará a estas configuraciones.
   *
   * @default
   * Prop propertyEntry: 2;
   * Prop onChange: 2;
   */
  maxDecimalDigits?: number;
  /**
   * Configuración de la sanitización relacionada a los valores de entrada del input, en este caso "value" y "defaultValue".
   *
   * Aunque el componente permita colocar "value" y "defaultValue" al mismo tiempo, tenemos que tener presente que "value" siempre tendrá mas peso.
   *
   * Nota: Tenemos que recordar que la funcionalidad principal de la sanitización es como su nombre lo indica es sanitizar el texto de entrada, por lo tanto si no le importa quitar puntos o negativos al texto de entrada, solamente deje todas propiedades en false o elimine esta propiedade de su configuración.
   *
   * Al tener todos los valores en false se enfocará solamente en la sanitización es decir si entra un string "123p32k..4l" el resultado sera "12332.4".
   *
   * En cambio si le importa eliminar puntos o negativos hay que tener presente el comportamiento del input al aplicar esta configuració y la de "onInput" y de "onChange".
   *
   * Vamos a explicar un poco esto:
   *
   * 1. Si el input tiene un valor controlado.
   *
   * > Es decir estas usando un useState para controlar la prop de "value", se tiene que tener en consideración la configuración de la sanitización de "onInput" y de "onChange".
   *
   * > ¿Porque se tiene que tener en consideración la prop "onInput" y "onChange"?
   *
   * >> Primero repasemos que hacen estas dos:
   *
   * >> onInput: La sanitización se aplica cuando se escribe un caracter y no la palabra completa, esta propiedad tiene los valores
   * "removeDotIfLastCharacter", "removeDecimalPointIfSingleCharacter" y "removeNegativeIfSingleCharacter" en false por lo cual nos permite escribir un negativos o decimales, en cambio si sus valores fueran true no nos dejaría, porque como se mencionó por cada caracter escrito se ejecuta la sanitización
   *
   * >> onChange: La sanitización se aplica cuando se manda a llamar al onchange interno del componente es decir si en el input tenemos ".", "-" y "23." el valor regresado en el evento "onChange" donde tengas implementado el input
   * sera "", "", "23", ya que en su configuración por default "removeDotIfLastCharacter", "removeDecimalPointIfSingleCharacter" y "removeNegativeIfSingleCharacter" se encuentran en true.
   *
   * >> Ahora supongamos que temos esta configuración:
   *
   * >> "onInput" dejamos esas 3 propiedades con su valor por default que es false.
   *
   * >> "onChange" las cambiamos los valores a las 3 propiedades de true a false, ya que, su default para las 3 propiedades es true.
   *
   * >> "onPropertyEntry" dejamos esas 3 propiedades con su valor por default que es true.
   *
   * >> ¿ que crees que pase ?.
   *
   * >> Bueno, supongamos que queremos escribir un número decimal y escribimos esto "123." y al terminar de escribir el punto final se manda a llamar al evento "onchange" interno (siempre y cuando el tiempo del debounce se termine),
   * como se tiene un valor controlado, al momento de entrar en la función "onchange" (en el componente donde lo estes implementando), se toma ese valor y se setea en el useState (esto es lo que comunmente se hace al tener un valor controlado).
   * por lo cual tu useState tendrá un valor distinto y este nuevo valor se volverá a enviar al input.
   *
   * >> ¿ pero que pasa ?
   *
   * >> Recordemos que en este caso se tiene una configuración en "onPropertyEntry" donde no permitimos negativos ni puntos.
   * por lo caul la sanitizacioón hara que el valor resultate sea "123", entonces aunque tengas configurado poder escribir decimales en el input con la prop "onInput", al final nunca prodrás hacerlo.
   *
   * >> ¿ porque sucede esto ?
   *
   * >> Porque el useState seteamos "123." y al momento de enviar ese valor al input se sanitiza y nos da como resultado "123" después internamente se valida el nuevo valor contra el valor enviado en el onChange que es "123."
   * al notar la diferencia se setea el valor "123" en el input inpidiendo que puedas escribir un decimal (siempre y cuando se termine el tiempo del debounce).
   *
   * >> En cambio si tomamos la misma configuración de arriba con la diferencia de que esas 3 propiedades de "onChange" la dejamos en true, en pocas palabras su valor por default.
   *
   * >> ¿ que crees que pase ?.
   *
   * >> Si tomamos el mismo ejemplo "123." lo que hará es que antes de que se mande el valor al evento onChange donde tienes implementado, se sanitizará y el resultado será "123", por lo tanto cuando obtengas el valor en tu onChange será "123"
   *
   * >> ¿ Y que diferencia tiene si al final se puede sanitizar con "onPropertyEntry" y se manda el valor sanitizado al input ?
   *
   * >> Bien la diferencia es que si lo haces de esta segunda forma internamente se validará el valor que se regresa en el "onChange" con el valor de entrada que es el "value".
   *
   * >> Entondes de esta segunda no se volverá a setear el valor en el input permitiendo poder escribir decimales.
   *
   * >> ¿ eso significa que la configuración de "onChange" debe ser igual a la de "onPropertyEntry"?
   *
   * >> No necesariamente, todo esto que se explicó es para un caso con valores controlados, en este caso si deberían ser iguales per si tiene un caso donde no tiene un valor controlado, puede tener configuraciones diferentes.
   *
   * 2. Si el input no tiene un valor controlado.
   *
   * 3. A pesar de todo esto hay que entender que tambien se pueden usar por separado segun sus necesidades, por ejemplo si solo ocupa controlar lo que se escribe en el input puede configurar "onPropertyEntry" y "onChange" con todo false.
   * y pasa lo mismo con las demas propiedades.
   *
   * 4. Segun sus necesidades tiene la opción de configurar la sanitización en diferentes partes.
   *
   * > Este caso es totalmente distinto que el anterior, ya que como no contamos con un valor contralo podemos tener diferentes configuraciones en "onPropertyEntry", "onInput" y "onChange" y nunca chocarán las dos.
   *
   * @default
   * {
   *   // true: Elimina el punto decimal
   *   // false: conserva el punto decimal.
   *   removeDecimalPoint: false,
   *   // true: Elimina el símbolo negativo
   *   // false: conserva el símbolo negativo.
   *   removeNegativeSign: false,
   *   // true: Si el último carácter es un punto, lo elimina
   *   // false: si el último carácter es un punto, lo conserva.
   *   removeDotIfLastCharacter: true,
   *   // true: Si el texto es '.', elimina el punto
   *   // false: Si el texto es '.', conserva el punto.
   *   removeDecimalPointIfSingleCharacter: true,
   *   // true: Si el texto es '-', elimina el negativo
   *   // false: Si el texto es '-', conserva el negativo.
   *   removeNegativeIfSingleCharacter: true,
   * }
   */
  onPropertyEntry?: Omit<ISanitizeNumberInputOptions, 'maxDecimalDigits'>;
  /**
   * Configuración de la sanitización relacionada a la interacción con el input, es decir siempre que se escriba en el.
   *
   * <strong style="color:red">Nota:</strong> A diferencia de la prop "propertyEntry" las últimas 3 opciones:
   *
   * "removeDotIfLastCharacter", "removeDecimalPointIfSingleCharacter" y "removeNegativeIfSingleCharacter"
   *
   * tienen el valor de false.
   *
   * Esto es por el simple echo de que esta prop esta enfocada a la interacción con el usuario, es decir:
   *
   * si el usuario quiere escribir un número negativo por ejemplo '-21', por el simple echo de escribir el simbolo negativo como primer carácter esto se enviaría al sanitizador y si tenemos la propiedad "removeNegativeIfSingleCharacter" con el valor true
   * se sanitizaría y nunca podríamos escribir un número negativo.
   *
   * Esto mismo pasa con las demas propiedades "removeDotIfLastCharacter" y "removeDecimalPointIfSingleCharacter".
   *
   * En pocas palabras la sanitización de esta propiedad siempre se ejecutará al escribir un solo caracter.
   *
   * @default
   * {
   *   // true: Elimina el punto decimal
   *   // false: conserva el punto decimal.
   *   removeDecimalPoint: false,
   *   // true: Elimina el símbolo negativo
   *   // false: conserva el símbolo negativo.
   *   removeNegativeSign: false,
   *   // true: Si el último carácter es un punto, lo elimina
   *   // false: si el último carácter es un punto, lo conserva.
   *   removeDotIfLastCharacter: false,
   *   // true: Si el texto es '.', elimina el punto
   *   // false: Si el texto es '.', conserva el punto.
   *   removeDecimalPointIfSingleCharacter: false,
   *   // true: Si el texto es '-', elimina el negativo
   *   // false: Si el texto es '-', conserva el negativo.
   *   removeNegativeIfSingleCharacter: false
   * }
   */
  onInput?: Omit<ISanitizeNumberInputOptions, 'maxDecimalDigits'>;
  /**
   *
   * @default
   * {
   *   // true: Elimina el punto decimal
   *   // false: conserva el punto decimal.
   *   removeDecimalPoint: false,
   *   // true: Elimina el símbolo negativo
   *   // false: conserva el símbolo negativo.
   *   removeNegativeSign: false,
   *   // true: Si el último carácter es un punto, lo elimina
   *   // false: si el último carácter es un punto, lo conserva.
   *   removeDotIfLastCharacter: true,
   *   // true: Si el texto es '.', elimina el punto
   *   // false: Si el texto es '.', conserva el punto.
   *   removeDecimalPointIfSingleCharacter: true,
   *   // true: Si el texto es '-', elimina el negativo
   *   // false: Si el texto es '-', conserva el negativo.
   *   removeNegativeIfSingleCharacter: true
   * }
   */
  onChange?: Omit<ISanitizeNumberInputOptions, 'maxDecimalDigits'>;
}

interface IInputValidationsErrorMessages {
  /**
   * Mensaje de error que se mostrará cuando no se cumpla la valicación del límite establecido en la propiedad 'Min' que se encuentra dentro de 'limits'
   * @default
   * 'El valor es menor al mínimo permitido'
   */
  limitsMin?: string;
  /**
   * Mensaje de error que se mostrará cuando no se cumpla la validación del límite establecido en la propiedad 'Max' que se encuentra dentro de 'limits'
   * @default
   * 'El valor es mayor al máximo permitido'
   */
  limitsMax?: string;
  /**
   * Mensaje de error que se mostrará cuando no se cumpla la validacion de rangos establecidos que se encuentran dentro de 'between'
   * @default
   * 'El valor no encuentra en el rango permitido'
   */
  between?: string;
  /**
   * Mensaje de error generico el cual se usa en combinación con la prop 'showError' que se encuentra dentro de validations -> showError.
   * @default
   * ''
   */
  custom?: string;
}

export interface IInputValidations {
  number?: {
    /**
     * Valores mínimos y máximos que se pueden ingresar.
     *
     * <strong style="color:red">Nota:</strong> Estas validaciones solamente funcionan con el tipo del input numérico.
     *
     * Ejemplo:
     * ```ts
     * limits: {
     *  min: 15,
     *  max: 90,
     *  reset: true,
     *  showError: true,
     * }
     * ```
     *
     * Esto hara lo siguiente:
     *
     * El valor 'min' validará que el valor escrito no sea menor a 15, en dado caso que este sea menor el input hará lo siguiente:
     * 1. Pasará al modo error ya que tenemos la prop 'showError: true', - Nota: Si el valor fuera false, no pasaría el input al modo error.
     * 2. Reseteará el input ya que tenemos la prop 'reset: true', - Nota: Si el valor fuera false, no resetearía el input.
     *
     * De esta misma forma puede funcionar el valor máximo.
     *
     * <strong style="color:red">Nota:</strong> Por default primero aplica las reglas de la prop 'between' por lo cual siempre aparecerán primero los mensajes de error de esta prop en caso dado de que existan dichas reglas.
     * @default
     * limits: {
     *   min: undefined,
     *   max: undefined,
     *   reset: false,
     *   showError: true,
     * }
     */
    limits?: IInputValidationsLimits;
    /**
     * Rango de valores mínimo y máximo que se puede ingresar.
     *
     * <strong style="color:red">Nota:</strong> Esta validacion solamente funciona con el tipo del input numérico.
     *
     * Ejemplo:
     * ```ts
     * between: {
     *  min: 10,
     *  max: 100,
     *  showError: true,
     *  reset: false,
     * },
     * ```
     *
     * Esto hara lo siguiente:
     *
     * Se validará que los valores escritos se encuentren dentro del rango 10-100, en caso dado que el valor no se encuentre dentro de este rango hará lo siguiente:
     * 1. Pasará al modo error ya que tenemos la prop 'showError: true', - Nota: Si el valor fuera false, no pasaría el input al modo error.
     * 2. Reseteará el input ya que tenemos la prop 'reset: true', - Nota: Si el valor fuera false, no resetearía el input.
     *
     * <strong style="color:red">Nota:</strong> Por default se aplican estas reglas de 'between' antes que las de la prop 'limits', por lo cual siempre aparecerán primero los mensajes de error de esta prop.
     * @default undefined
     */
    between?: IInputValidationsBetween;
  };
  /**
   * Cantidad máxima de carácteres a escribir.
   *
   * <strong style="color:red">Nota:</strong> Si no se requiere un máximo de carácteres se puede enviar el valor 0 para que ignore esta validación.
   *
   * <strong style="color:red">Nota:</strong> Esta prop solo funciona cuando el input es de tipo 'text', 'number' o 'range'
   *
   * @default 50
   */
  maxLength?: number;
  /**
   * Si es true pintara el border del input de color rojo
   * @default false
   */
  showError?: boolean;
  /**
   * Mensajes que se muestran debajo del input.
   */
  errorMessages?: IInputValidationsErrorMessages;
  /**
   * Clase perzonalidada para el contenedor de los errores.
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn(
   *   'mt-2 min-w-full max-w-min list-inside list-none space-y-1 text-xs text-destructive [text-wrap-style:pretty]',
   *   showErrorState || showNumericValidationErrorsState.show ? '' : 'hidden',
   *   classNameErrorContainer,
   * )
   * ```
   */
  classNameErrorContainer?: string | undefined;
}

interface IInputClassNames {
  /**
   * Clase personalizada para el contenedor principal
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn('space-y-2', classNamePrincipalContainer)
   * ```
   */
  classNamePrincipalContainer?: string | undefined;
  /**
   * Clase personalizada para el contenedor del input.
   *
   * En este contenedor no entran los errores que se visualizan debajo del input.
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn('relative', classNameInputContainer)
   * ```
   */
  classNameInputContainer?: string | undefined;
  /**
   * Clase personalizada para el label
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn(labelVariants({ show: showLabel }), classNameLabel || null)
   * ```
   *
   * labelVariants:
   * ```ts
   * [
   *   'absolute',
   *   'left-0',
   *   'top-0',
   *   'z-[1]',
   *   '-mt-2',
   *   'ml-2',
   *   'bg-primary',
   *   'px-1.5',
   *   'text-xs',
   *   'text-input-foreground',
   * ],
   * {
   *   variants: {
   *     show: {
   *       false: 'hidden',
   *     },
   *   },
   * }
   * ```
   */
  classNameLabel?: string | undefined;
  /**
   * Clase personalizada para el input
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn(
   *   inputVariants({
   *     leftElement: leftElement?.show || leftElement?.renderContainer
   *       ? leftElement?.type
   *       : 'default',
   *     isError: showErrorState || showNumericValidationErrorsState.show,
   *   }),
   *   classNameInput || null,
   * )
   * ```
   *
   * inputVariants:
   * ```ts
   * [
   *   'w-full',
   *   'placeholder:text-gray-400',
   *   'focus-visible:ring-1',
   *   'focus-visible:ring-slate-300',
   *   'focus-visible:ring-offset-0',
   *   'pe-[--rightWidth]',
   * ],
   * {
   *   variants: {
   *     leftElement: {
   *       button: 'ps-9',
   *       icon: 'ps-9',
   *       text: 'ps-[--leftWidth]',
   *       clear: 'ps-[--leftWidth]',
   *       default: '',
   *     },
   *     isError: {
   *       true: [
   *         'border-destructive/80',
   *         'text-destructive',
   *         'focus-visible:border-destructive/80',
   *         'focus-visible:ring-destructive/20',
   *       ],
   *     },
   *   },
   *   defaultVariants: {
   *     leftElement: 'default',
   *     isError: false,
   *   },
   * },
   * ```
   */
  classNameInput?: string | undefined;
  /**
   * Clase personalizada para el contenedor del skeleton
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn(
   *   'relative w-full content-center justify-items-center text-center',
   *   classNameSkeletonContainer || null,
   * )
   * ```
   */
  classNameSkeletonContainer?: string | undefined;
  /**
   * Clase personalizada para el skeleton
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn('h-10 w-full bg-input/60', classNameSkeleton || null)
   * ```
   */
  classNameSkeleton?: string | undefined;
}

export interface IElement<Data> {
  /**
   * Identificar unico.
   *
   * Este identificador es necesario para renderizar, controlar y mejorar el rendemiendo de los elementos.
   */
  id: string;
  /**
   * Muestra u oculta el elemento.
   * @default
   * false
   */
  show: boolean;
  /**
   * Icono a mostrar en el elemento.
   * @default
   * para leftElement:
   * ```ts
   * <Search size={18} strokeWidth={2} aria-hidden="true" className={classNameIcon} />
   * ```
   * para rigthElement:
   * ```ts
   * <IbmDb2 size={18} strokeWidth={2} aria-hidden="true" className={classNameIcon} />
   * ```
   */
  icon?: React.ReactElement | undefined;
  /**
   * Clase personalizada para el elemento.
   *
   * Cuando el tipo es 'button' esta clase se aplica al boton que contiene el icono.
   *
   * Cuando el tipo es 'icon' esta clase se aplica al contenedor del icono.
   *
   * Cuando el tipo es 'text' esta clase se aplica al contenedor del texto.
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn(elementsVariants(modelVariants), className || null)
   * ```
   *
   * elementsVariants:
   * ```ts
   * [
   *   'border-t',
   *   'border-transparent',
   *   'flex',
   *   'h-full',
   *   'inset-y-0',
   *   'items-center',
   *   'justify-center',
   * ],
   * {
   *   variants: {
   *     type: {
   *       button: [
   *         'disabled:cursor-not-allowed',
   *         'disabled:opacity-50',
   *         'disabled:pointer-events-none',
   *         'focus-visible:outline-2',
   *         'focus-visible:outline-ring/70',
   *         'focus-visible:outline',
   *         'hover:text-foreground',
   *         'outline-offset-2',
   *         'pointer-events-auto',
   *         'text-muted-foreground/80',
   *         'transition-colors',
   *       ],
   *       icon: ['peer-disabled:opacity-50', 'pointer-events-none', 'text-muted-foreground/80'],
   *       text: ['peer-disabled:opacity-50', 'pointer-events-none', 'text-muted-foreground', 'text-sm'],
   *       clear: [
   *         'disabled:cursor-not-allowed',
   *         'disabled:opacity-50',
   *         'disabled:pointer-events-none',
   *         'focus-visible:outline-2',
   *         'focus-visible:outline-ring/70',
   *         'focus-visible:outline',
   *         'focus:z-10',
   *         'hover:text-foreground',
   *         'outline-offset-2',
   *         'pointer-events-auto',
   *         'text-muted-foreground/80',
   *         'transition-colors',
   *       ],
   *     },
   *     show: {
   *       false: 'hidden',
   *     },
   *     isError: {
   *       true: ['text-destructive', 'hover:text-destructive'],
   *     },
   *     disable: {
   *       true: 'pointer-events-none',
   *     },
   *     position: {
   *       left: 'start-0 rounded-s-md ps-3',
   *       right: 'end-0 pe-3',
   *     },
   *     separator: {
   *       true: null,
   *     },
   *     isLastElement: {
   *       true: 'rounded-e-md',
   *     },
   *   },
   *   compoundVariants: [
   *     { type: 'button', isError: true, class: 'hover:text-destructive/80' },
   *     { type: 'clear', isError: true, class: 'hover:text-destructive/80' },
   *     {
   *       position: 'right',
   *       separator: true,
   *       isLastElement: false,
   *       class: [
   *         'relative',
   *         'after:absolute',
   *         'after:right-0',
   *         'after:top-1/2',
   *         'after:h-[15px]',
   *         'after:w-[1px]',
   *         'after:-translate-y-1/2',
   *         'after:content-[""]',
   *         'after:bg-muted-foreground/80',
   *         'mr-2.5',
   *       ],
   *     },
   *     {
   *       position: 'right',
   *       separator: true,
   *       isError: true,
   *       class: 'after:bg-destructive',
   *     },
   *   ],
   * }
   * ```
   */
  className?: string | undefined;
  /**
   * Clase personalizada para el icono por default.
   *
   * Esta prop aplica para los dos tipos 'button' e 'icon' siempre y cuando no se cambie de icono con la prop 'icon'.
   *
   * Esta clase solamente funciona con el icono por default si se cambia el icono con la prop 'icon' esta prop no aplica.
   * @default
   * undefined
   */
  classNameIcon?: string | undefined;
  /**
   * Texto a mostrar cuando el type es de tipo "text"
   */
  text?: string;
  /**
   * Tipo de elemento a mostrar.
   * @default
   * icon
   */
  type: 'button' | 'icon' | 'text';
  /**
   * Separador que se muestra a la derecha de cada elemento.
   *
   * Este separador solamente aparece cuando se tiene un elemento mas a la derecha.
   *
   * Si el elemento que contiene esta prop en true es el último elemento o el único no se mostrará el separador.
   * @default
   * false
   */
  separator?: boolean;
  /**
   * Contenido del hover.
   *
   * Para activar el hover basta con que esta prop no sea undefined.
   * @default
   * undefinded
   */
  hoverContent?: ReactNode;
  /**
   * Clase que aplica al contenedor del contenido del hover
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn('w-80', classNameHoverContentClear || null)
   * ```
   */
  classNameHoverContent?: string | undefined;
  /**
   * Conteneido del Tooltip
   * @default
   * undefined
   */
  tooltipContent?: ReactNode;
  /**
   * Clase que aplica al contenedor del contenido del Tooltip
   * @default
   * undefined
   */
  classNameTooltipContent?: string | undefined;
  /**
   * Renderiza un elemento completo.
   *
   * <strong style="color:red">Nota:</strong> Al usar esta prop se quedarán deshabilitadas TODAS las props a excepción de la prop 'icon'.
   *
   * @param icon Icono que se puede usar para mostrar, este param regresa el icono que se usa en la prop "icon" o en su defecto el icono por default.
   * @returns ReactNode
   */
  renderContainer?: (icon: ReactNode) => ReactNode;
  /**
   * Evento que se llama al hacer click en el elemento cuando este es de tipo 'button'.
   * @returns void
   */
  onClick?: (_: { item: IInputResponseEventProps<Data> }) => void;
}

type IClearElement = Omit<IElement<unknown>, 'text' | 'type' | 'renderContainer' | 'onClick'>;
interface ICounterElement extends Pick<IElement<unknown>, 'separator'> {
  /**
   * Activa o desactiva un contador el cual mostrará la cantidad de palabras escritas contra la cantidad que se puede escribir.
   * @example
   * 5/20
   *
   * <strong style="color:red">Nota:</strong> Esta opcion viene de la mano con la prop "maxLength" que se encuentra dentro de "validations".
   * @default false
   */
  show: boolean;
  /**
   * Clase personalizada para el contenedor del contador
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   *  cn(
   *   counterVariants({
   *     show: true,
   *     isError: showError || showNumericValidationErrors,
   *     isLastElement,
   *     separator,
   *   }),
   *   classNameCounterContainer || null,
   * )
   * ```
   *
   * counterVariants:
   * ```ts
   * [
   *   'border-t',
   *   'border-transparent',
   *   'end-0',
   *   'flex',
   *   'h-full',
   *   'inset-y-0',
   *   'items-center',
   *   'justify-center',
   *   'pe-2.5',
   *   'peer-disabled:opacity-50',
   *   'pointer-events-none',
   *   'tabular-nums',
   *   'text-muted-foreground',
   *   'text-xs',
   * ],
   * {
   *   variants: {
   *     show: {
   *       false: 'hidden',
   *     },
   *     isError: {
   *       true: ['text-destructive', 'rounded-none'],
   *     },
   *     separator: {
   *       true: null,
   *     },
   *     isLastElement: {
   *       true: 'rounded-e-md',
   *     },
   *   },
   *   compoundVariants: [
   *     {
   *       isLastElement: false,
   *       separator: true,
   *       class: [
   *         'relative',
   *         'after:absolute',
   *         'after:right-0',
   *         'after:top-1/2',
   *         'after:h-[15px]',
   *         'after:w-[1px]',
   *         'after:-translate-y-1/2',
   *         'after:content-[""]',
   *         'after:bg-muted-foreground/80',
   *         'mr-2.5',
   *       ],
   *     },
   *     {
   *       separator: true,
   *       isError: true,
   *       class: 'after:bg-destructive',
   *     },
   *   ],
   * }
   * ```
   */
  className?: string | undefined;
  /**
   * Clase personalizada para el icono de infinito del contador, que aparece cuando maxLength es = 0
   */
  classNameInfinityIcon?: string | undefined;
}
interface IErrorElement extends Omit<IElement<unknown>, 'text' | 'type' | 'renderContainer' | 'onClick' | 'separator'> {
  /**
   * Icono que se muestra cuando sucede un error tanto con las validaciones de las props 'limits', 'between' como con la prop 'showError' que se encuentra dentro de 'validations -> showError'.
   * @default
   * true
   */
  show: boolean;
  /**
   * Clase personalizada para el contenedor del icono de error
   * @default
   * undefined
   *
   * Ejemplo de uso:
   * ```ts
   * cn(elementsVariants(errorModelVariants), classNameErrorIconContainer || null)
   * ```
   */
  className?: string | undefined;
}

export interface IRightElement<Data> {
  /**
   * Arreglo de elementos a dibujar
   * @default
   * undefined
   */
  elements?: IElement<Data>[];
  /**
   * Elemento para limpiar el input
   * @default
   * ```ts
   * {
   *   show: false,
   *   className: undefined,
   *   classNameHoverContent: undefined,
   *   classNameIcon: undefined,
   *   classNameTooltipContent: undefined,
   *   hoverContent: undefined,
   *   icon: undefined,
   *   separator: false,
   *   tooltipContent: undefined,
   * }
   * ```
   */
  clear?: IClearElement;
  /**
   * Elemento que muestra un contador de carácteres escritor contra la cantidad permitida.
   * @default
   * ```ts
   * {
   *   className: undefined,
   *   classNameInfinityIcon: undefined,
   *   separator: false,
   *   show: false,
   * }
   * ```
   */
  counter?: ICounterElement;
  /**
   * Elemento que muestra un icono de error
   * @default
   * ```ts
   * {
   *   className: undefined,
   *   classNameHoverContent: undefined,
   *   classNameIcon: undefined,
   *   classNameTooltipContent: undefined,
   *   hoverContent: undefined,
   *   icon: undefined,
   *   show: true,
   *   tooltipContent: undefined,
   * }
   * ```
   */
  error?: IErrorElement;
}

export interface IAutoCompleteItems<AutoCompData extends string> {
  labelSelected: AutoCompData;
  labelSuggestion: string;
  disable?: boolean;
}
export interface IAutocomplete<AutoCompData extends string> {
  /**
   * Activa o desactiva el input con autocompletado.
   * @default
   * false
   */
  show: boolean;
  /**
   * Bandera que se utiliza para mostrar skeletons al momento de buscar una sugerencia.
   *
   * Nota: siempre debe de pasar por sus dos estados true y false.
   *
   * Usted es responsable de configurar correctamente esta propiedad.
   * @default
   * false
   */
  isLoading?: boolean;
  /**
   * Muestra u oculta los skeletons al momento de buscar una sugerencia.
   * @default
   * true
   */
  showLoading?: boolean;
  /**
   * Lista de sugerencias
   * @default
   * []
   */
  items: IAutoCompleteItems<AutoCompData>[];
  /**
   * Icono que aparece al lado izq al momento de seleccionar una sugerencia.
   * @default
   * <Check
   *   className={cn(
   *     'mr-2 h-4 w-4',
   *     inputSelectedValueState === identifier ? 'opacity-100' : 'opacity-0',
   *     classNamePopoverScrollArea?.classNameItemIcon || null,
   *   )}
   * />
   */
  itemIconSelected?: ReactNode;
  /**
   * Muestra u oculta el icono de la sugerencia seleccionada.
   */
  showIconSelected?: boolean;
  /**
   * Mínimo de carácteres a ingresar para mostrar mensajes.
   *
   * Los mensajes a mostrar que utilizan esta propiedad son "noData" y "minLengthMessage" los cuales se configuran dentro de la propiedad "messages".
   *
   * Las validaciones para mostrar los mensajesson las siguientes:
   *
   * -- loading: este se refiere al loader que se configura en la propiedad "isLoading".
   *
   * -- sugerenciasLength: se refiere a la cantidad de sugerencias mostradas la cual se configura en la propiedad "items"
   *
   * -- value: valor escrito en el input
   *
   * -- valueLength: número de carácteres del value
   *
   * noData --> !loading && !sugerenciasLength && value && valueLength >= minLengthRequired;
   *
   * minLengthMessage --> !loading && !sugerenciasLength && value && valueLength < minLengthRequired;
   *
   * Nota: Si va a configurar el llenado de "items" despues de que se escriba cierta cantidad de carácteres esta propiedad debe coincidir con la cantidad de caracteres a escribir.
   *
   * Usted es responsable de configurar correctamente esta propiedad.
   *
   * @default
   * 0
   */
  minLengthRequired?: number;
  /**
   * Obtiene el valor de la sugerencia seleccionada
   */
  setInputSelected?: Dispatch<SetStateAction<string>>;
  /**
   * Configuración del comportamiento al perder el foco
   */
  onBlurConfig?: {
    /**
     * Resetear al no seleccionar una sugerencia
     *
     * El texto escrito debe coincidir con la sugerencia seleccionada, por lo tanto si tiene una sugerencia seleccionada y tiene un texto diferente se va a resetear.
     *
     * Si no quiere que suceda eso deshabilite esta opcion y habilite "reassignSelectedSuggestion"
     *
     * Cada validación de "onBlurConfig" tiene un Orden por lo cual debe de habilitar solamente la opción que requiera:
     * 1. default
     * 2. reassignSelectedSuggestion
     * 3. resetOnNoSelection
     *
     * Nota: Hay que tener en cuenta que la propiedad "default" tiene un valor en true valga la reduncancia por defalt
     * asi que para usar esta propiedad primero deshabilite "default"
     *
     * @default
     * false
     */
    resetOnNoSelection?: boolean;
    /**
     * Reasigna la sugrencia seleccionada cuando el texto escrito no coincide con esta.
     *
     * Por ejemplo: selecciona una sugerencia y para buscar mas opciones escribe en el input al perder el foco el texto escrito no coincidirá con el valor
     * de la sugerencia seleccionada por lo tanto se volverá a setear en el input el valor de esta sugerencia.
     *
     * Cada validación de "onBlurConfig" tiene un Orden por lo cual debe de habilitar solamente la opción que requiera:
     * 1. default
     * 2. reassignSelectedSuggestion
     * 3. resetOnNoSelection
     *
     * Nota: Hay que tener en cuenta que la propiedad "default" tiene un valor en true valga la reduncancia por defalt
     * asi que para usar esta propiedad primero deshabilite "default"
     *
     * @default
     * false
     */
    reassignSelectedSuggestion?: boolean;
    /**
     * Al activar esta propiedad no tendrá algún comportamiento al perder el foco,
     * es decir el texto escrito no desaparecerá ni se volverá a setear la sugerencia seleccionada, simplemente se seguirá visualizando el texto escrito.
     *
     * Cada validación de "onBlurConfig" tiene un Orden por lo cual debe de habilitar solamente la opción que requiera:
     * 1. default
     * 2. reassignSelectedSuggestion
     * 3. resetOnNoSelection
     *
     * Nota: Hay que tener en cuenta que la propiedad "default" tiene un valor en true valga la reduncancia por defalt
     * asi que para usar otra propiedad primero deshabilite "default"
     *
     * @default
     * true
     */
    default: boolean;
  };
  /**
   * Resetear al seleccionar el item seleccionado.
   *
   * Es algo confuso pero dicho de otra forma, hace lo siguiente:
   *
   * Si tienes un item seleccionado este siempre te sige apareciendo en las sugerencias, si das click de nuevo en el item seleccionado reseteará el input.
   *
   * En pocas palabras es como si dieras click a la "x".
   *
   * @default
   * false
   */
  resetOnSameItem?: boolean;
  /**
   * Clases para el popover, que es el contenedor completo de las sugerencias junto con los mensajes y los skeletons
   */
  classNamePopover?: {
    /**
     * Clase que aplica a PopoverContent
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn('w-[--radix-popover-trigger-width] p-0', classNamePopover?.classNameContent || null)
     * ```
     */
    classNameContent?: string;
    /**
     * Clase que aplica a CommandList el cual se encuentra dentro de PopoverContent, siendo este el primer elemento.
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn(classNamePopover?.classNameList)
     * ```
     */
    classNameList?: string;
    /**
     * Clase que aplica a CommandEmpty el cual se encuentra dentro de CommandList, siendo este el primer elemento.
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn(
     *   'py-6 text-center text-sm',
     *   isLoadingState || !showMessages ? 'hidden' : null,
     *   classNamePopover?.classNameEmpty,
     * )
     * ```
     */
    classNameEmpty?: string;
    /**
     * Clase que aplica a CommandEmpty el cual se encuentra dentro de CommandList, siendo este el primer elemento.
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn('w-[--radix-popover-trigger-width] p-0', classNamePopover?.classNameContent || null)
     * ```
     */
    classNameSketetonContainer?: string;
    /**
     * Clase que aplica al contenedor de los skeletons
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn('space-y-1 px-2 py-1.5', classNamePopover?.classNameSketetonContainer || null)
     * ```
     */
    classNameSketeton?: string;
  };
  /**
   * Clases para el header del popover, que es donde se encuentra el titulo y el boton de limpiar
   */
  classNamePopoverHeader?: {
    /**
     * Clase que aplica al div padre
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn(
     *   'sticky top-0 z-10 bg-popover px-9 py-1.5 text-xs font-medium text-muted-foreground',
     *   items.length === 0 || isLoadingState ? 'hidden' : null,
     *   classNamePopoverHeader?.classNameContainer || null,
     * )
     * ```
     */
    classNameContainer?: string;
    /**
     * Clase que aplica al div contenedor del titulo y el boton de limpiar
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn('flex w-full items-center', classNamePopoverHeader?.classNameContent || null)
     * ```
     */
    classNameContent?: string;
    /**
     * Clase que aplica al boton de limpiar
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn(
     *   'pointer-events-auto absolute right-1.5 top-1.5 text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70',
     *   !inputSelectedValueState && 'hidden',
     *   classNamePopoverHeader?.classNameButton || null,
     * )
     * ```
     */
    classNameButton?: string;
    /**
     * Clase que aplica al icono que se encuentra dentro del boton
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * classNamePopoverHeader?.classNameIcon
     * ```
     */
    classNameIcon?: string;
  };
  /**
   * Clases para el scroll y las sugerencias
   */
  classNamePopoverScrollArea?: {
    /**
     * Clase que aplica al ScrollArea que es el contenedor principal donde estan las sugerencias
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn(
     *   'flex max-h-48 flex-col overflow-y-auto rounded-md',
     *   items.length === 0 || isLoadingState ? 'hidden' : null,
     *   classNamePopoverScrollArea?.classNameContainer || null,
     * )
     * ```
     */
    classNameContainer?: string;
    /**
     * Clase que aplica al CommandGroup que es el contenedor de cada item de sugerencias
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * classNamePopoverScrollArea?.classNameGroup
     * ```
     */
    classNameGroup?: string;
    /**
     * Clase que aplica al CommandGroup que es el contenedor de de la propia sugerencia es decir el que conteiene el icono y el label.
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn('mr-1.5 text-sm text-muted-foreground', classNameItem || null)
     * ```
     */
    classNameItem?: string;
    /**
     * Clase que aplica al icono de la sugerencia
     * @default
     * undefined
     *
     * Ejemplo de uso:
     * ```ts
     * cn(
     *   'mr-2 h-4 w-4',
     *   inputSelectedValueState === identifier ? 'opacity-100' : 'opacity-0',
     *   classNamePopoverScrollArea?.classNameItemIcon || null,
     * )
     * ```
     */
    classNameItemIcon?: string;
  };
  /**
   * Muestra u oculta los mensajes
   * @default
   * true
   */
  showMessages?: boolean;
  /**
   * Configuración de mensajes
   */
  messages?: {
    /**
     * Mensaje que aparece cuando no existen sugerencias
     *
     * Nota: Para mostrar correctamente el mensaje se tiene que configurar de forma correcta "minLengthRequired" y "loading".
     *
     * @default
     * 'No existen sugerencias'
     */
    noData?: string;
    /**
     * Mensaje inicial que aparece cuando el input no tiene nada escrito
     *
     * @default
     * 'Escriba para mostrar sugerencias'
     */
    initMessage?: string;
    /**
     * Mensaje que aparece cuando se tiene escrito por lo menos un caracter y no cumple con el mínimo requerido.
     *
     * Nota: Para mostrar correctamente el mensaje se tiene que configurar de forma correcta "minLengthRequired" y "loading".
     *
     * @default
     * 'Escriba almenos 5 carácteres'
     */
    minLengthMessage?: string;
    /**
     * Titulo que tendra en el header el popover de las sugerencias
     * @default
     * 'Sugerencias'
     */
    title?: string;
  };
  /**
   * Cuando tenemos una lista demasiado grande de sugerencias, renderizarla de forma normal puede ser muy costoso y bajar el rendimiento.
   *
   * Para solucionar esto, tenemos la siguiente propiedad que al asignarle un 'true' renderizará la lista con ayuda de la vistualización de tanstack.
   *
   * Link: https://tanstack.com/virtual/latest/docs/introduction
   * @default
   * false
   */
  virtualizeSuggestionsList?: boolean;
}

export type InputTheme = 'default' | 'inherit' | (string & {});

export interface IFormatter extends INumberFormatterOptions {
  /**
   * Activa o desactiva el formato del número
   * @default
   * false
   */
  active?: boolean;
}

export interface IInputProps<Data, AutoCompData extends string> extends IInputClassNames {
  /**
   * Muestra u oculta un label arriba del input.
   * @default
   * true
   */
  showTextLabel?: boolean;
  /**
   * Texto que apareceá en el label.
   *
   * Este texto es visible cuando "showTextLabel" es true.
   * @default
   * 'Input'
   */
  textLabel?: string;
  /**
   * Mostrar u ocultar el simbolo de requerido "*"
   * @default
   * false
   */
  showRequired?: boolean;
  /**
   * Muestra u oculta el texto que aparece al lado izq. del simbolo de requerido "*".
   * @default
   * false
   */
  showTextRequired?: boolean;
  /**
   * Texto que aparece al lado izq, del simbolo de requerido "*".
   *
   * Este texto es visible cuando "showTextRequired" es true.
   * @default
   * 'Completar'
   */
  textRequired?: string;
  /**
   * Configuracion de validaciones
   */
  validations?: IInputValidations;
  /**
   * Permite retornar un modelo de datos en el evento onChange.
   *
   * Esto es conveniente cuando se genera el componente de forma dinámica o cuando se ocupan datos al momento de obtener el change.
   * @default undefined
   */
  data?: Data;
  /**
   * limpia el Input. Esto encadena un evento change.
   *
   * <strong style="color:red">Nota:</strong> no olvidar volver a pasar el campo a false y solo enviar true cuando se ocupe.
   * @default false
   */
  reset?: boolean;
  /**
   * Permite setear el valor por default del input siempre que se limpie con "reset" o mediante el boton "clear" dentro de las propiedades "rightElement".
   *
   * El valor por default se toma de la propiedad "defaultValue" o en caso contrario si se maneja un valor controlado se toma del primer valor de la propiedad "value".
   *
   * Esta propiedad es útil cuando se tiene un input que se puede limpiar y se quiere volver a setear el valor por default.
   * @default
   * false
   */
  setDefaultValueInReset?: boolean;
  /**
   * Nuestra u oculta el skeleton.
   *
   * @default
   * false
   */
  showSkeleton?: boolean;
  /**
   * Elemento que se muestra a la izquierda del input.
   */
  leftElement?: IElement<Data>;
  /**
   * Elemento(s) que se muestra a la derecha del input.
   */
  rightElement?: IRightElement<Data>;
  /**
   * Configuración para el input con sugerencias.
   */
  autocomplete?: IAutocomplete<AutoCompData>;
  /**
   * Propiedades nativas del input.
   */
  nativeInputsProps?: NativeInputPropsType<Data, AutoCompData>;
  /**
   * Evento que se llama al hacer click.
   * @param {IInputResponseEventProps} item - Datos del input.
   * @returns {void}
   */
  onChange?: (_: IInputResponseEventProps<Data>) => void;
  /**
   * Tiempo de espera para llamar al onChange.
   *
   * Es decir mientras el usuario escribe en el input es posible dar un tiempo de espera, de esta forma cada que escriba no será una llamada al onchange hasta que se termine ese tiempo de espera.
   * @default
   * 800ms
   */
  waitTime?: number;
  /**
   * Configuracion de la sanitización de los valores ingresados
   *
   * <strong style="color:red">Nota:</strong> Esta configuración solamente funcionan con el tipo del input numérico.
   */
  sanitize?: IInputValidationsSanitize;
  /**
   * Opciones para el formateo de los números, este formato se basa en Intl.NumberFormat,
   *
   * "getLocale()": obtiene los locales directo del navegador por default utiliza en-US si no encuentra algun local
   *
   * "localeToCurrency": Map que contiene el local junto con la moneda que utiliza cada uno.
   * ```ts
   * [
   *   ['es-AR', 'ARS'], ['es-BO', 'BOB'], ['pt-BR', 'BRL'], ['es-CL', 'CLP'],
   *   ['es-CO', 'COP'], ['es-CR', 'CRC'], ['es-CU', 'CUP'], ['es-DO', 'DOP'],
   *   ['es-EC', 'USD'], ['es-SV', 'USD'], ['es-GT', 'GTQ'], ['es-HN', 'HNL'],
   *   ['es-MX', 'MXN'], ['es-NI', 'NIO'], ['es-PA', 'PAB'], ['es-PY', 'PYG'],
   *   ['es-PE', 'PEN'], ['es-PR', 'USD'], ['es-UY', 'UYU'], ['es-VE', 'VES'],
   *   ['en-US', 'USD'], ['en-GB', 'GBP'], ['de-DE', 'EUR'], ['ja-JP', 'JPY'],
   *   ['es-ES', 'EUR']
   * ]
   * ```
   *
   * <strong style="color:red">Nota:</strong> La prop 'options' acepta toda la configuración de Intl.NumberFormat asi que si se requiere una configuración diferente puede leer la información de este.
   *
   * <strong style="color:red">Nota:</strong> El resultado de esta configuración solamente es visible cuando el input pierde el foco, es decir, solamente es visual esta cofiguración.
   *
   * Por Ejemplo:
   *
   * Tomando los valores por default y solamente cambiando el style:'decimal' por 'currency'.
   *
   * Si escribimos el siguiente número 110.23, cuando el input pierda el foco el valor se mostrará de esta forma: $110.23, este valor es meramente visual, ya que cuando el input vuelve a obtener el foco el valor se visualizará en su formato original que es 110.23.
   *
   * El valor que se manda en el onChange siempre es el original y no el valor formateado por esta prop.
   *
   * @default
   * {
   *   locale: getLocale(),
   *   options: {
   *      currency: localeToCurrency.get(getLocale()),
   *      style: 'decimal',
   *      minimumFractionDigits: 2,
   *      maximumFractionDigits: 2
   *   }
   *   roundDecimals: true
   * }
   */
  formatter?: IFormatter;
  theme?: InputTheme;
}

export type NativeInputPropsType<Data, AutoCompData extends string> = Omit<
  ComponentPropsWithoutRef<'input'>,
  keyof IInputProps<Data, AutoCompData> | 'className'
>;

/**
 * Propuedades disponibles para la logica de ref.
 */
export type InputForwardRefType = {
  /**
   * Focus del boton
   * @returns void
   */
  focus: () => void;
  /**
   * Blur del boton
   * @returns void
   */
  blur: () => void;
  /**
   * Regresa el objeto ref
   * @returns HTMLElement | null
   */
  get: () => HTMLElement | null;
  /**
   * Funcion para subscribirce al cambio del focus
   * @param {(isFocus: boolean) => void} callback - funcion la cual se llamara cada que el focus cambie.
   * @example
   * inputRef.current?.subscribeFocus((isFocus: boolean) => {
      console.log('is Focus', isFocus);
    });
   */
  subscribeFocus(callback: (isFocus: boolean) => void): void;
};
