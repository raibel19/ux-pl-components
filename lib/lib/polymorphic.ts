/**
 * @summary Define un objeto genérico de la forma más segura posible.
 * @description Es un alias para `Record<PropertyKey, unknown>`. `PropertyKey` representa cualquier clave de objeto válida (`string | number | symbol`). `unknown` es la versión segura de `any`, lo que obliga a verificar el tipo de una propiedad antes de poder usarla.
 * @example
 * ```ts
 * const miObjeto: ObjectUnknown = { nombre: 'Ana', edad: 30 };
 * // Esto daría un error en un entorno con chequeo de tipos:
 * // console.log(miObjeto.nombre.toUpperCase());
 *
 * if (typeof miObjeto.nombre === 'string')
 * {
 *  // Esto es seguro y correcto.
 *  console.log(miObjeto.nombre.toUpperCase());
 * }
 * ```
 */
export type ObjectUnknown = Record<PropertyKey, unknown>;

/**
 * @summary Define el "contrato" o "plantilla" que cada componente polimórfico debe seguir.
 * @property {ObjectUnknown} props - Un objeto que contiene las propiedades personalizadas y únicas del componente.
 * @property {React.ElementType} defaultComponent - El tipo de componente o etiqueta HTML que se renderizará por defecto si no se proporciona una prop `as`.
 * @example
 * // Para un componente de texto, el TypeMap podría ser:
 * // type TextTypeMap = {
 * //   props: { color: 'red' | 'blue', weight: 'bold' | 'normal' },
 * //   defaultComponent: 'span', // Por defecto, será un <span>
 * // }
 */
interface OverridableTypeMap {
  props: ObjectUnknown;
  defaultComponent: React.ElementType;
}

/**
 * @summary Una versión "inteligente" de `Omit` que funciona correctamente con uniones de tipos.
 * @description En TypeScript, este tipo utiliza una técnica de tipos condicionales para asegurar que si se le pasa una unión (ej. `TipoA | TipoB`), la operación `Omit` se aplique a cada miembro de la unión por separado. Es crucial para el correcto funcionamiento del polimorfismo.
 * @example
 * // type Circulo = { kind: 'circulo', radius: number };
 * // type Cuadrado = { kind: 'cuadrado', side: number };
 * // type Forma = Circulo | Cuadrado;
 * // type PropsDeForma = DistributiveOmit<Forma, 'kind'>;
 * // El resultado sería: { radius: number } | { side: number }
 */
type DistributiveOmit<T, K extends keyof ObjectUnknown> = T extends ObjectUnknown ? Omit<T, K> : never;

/**
 * @summary Fusiona dos tipos de objeto (`T` y `U`), dando prioridad a las propiedades de `U` si hay nombres repetidos.
 * @description Este tipo toma todas las propiedades de `T` excepto aquellas que también existen en `U`, y luego las combina con todas las propiedades de `U`. El resultado es un nuevo tipo fusionado.
 * @example
 * // type PropsBase = { color: string, size: number };
 * // type PropsNuevas = { size: string, disabled: boolean };
 * // type PropsFinales = Overwrite<PropsBase, PropsNuevas>;
 * // El resultado sería: { color: string; size: string; disabled: boolean; }
 * // La propiedad `size` ha sido sobrescrita para ser de tipo `string`.
 */
export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

/**
 * Props defined on the component.
 */
type BaseProps<M extends OverridableTypeMap> = M['props'];

/**
 * @summary Calcula el tipo de las props de un componente cuando se usa SIN la prop `as`.
 * @description Combina las props personalizadas del componente (definidas en el `TypeMap`) con todas las props nativas de su `defaultComponent`.
 */
export type DefaultComponentProps<M extends OverridableTypeMap> = BaseProps<M> &
  DistributiveOmit<React.ComponentPropsWithRef<M['defaultComponent']>, keyof BaseProps<M>>;

/**
 * Own props of the component augmented with props of the root component.
 */
export type PolymorphicProps<
  TypeMap extends OverridableTypeMap,
  RootComponent extends React.ElementType,
> = TypeMap['props'] &
  DistributiveOmit<React.ComponentPropsWithRef<RootComponent>, keyof TypeMap['props']> & {
    as?: React.ElementType;
  };

/**
 * @summary Calcula el tipo de las props de un componente cuando se usa CON la prop `as`.
 * @description Combina las props personalizadas del componente con todas las props nativas del elemento `C` que se pasó en la prop `as`.
 */
type OverrideProps<M extends OverridableTypeMap, C extends React.ElementType> = BaseProps<M> &
  DistributiveOmit<React.ComponentPropsWithRef<C>, keyof BaseProps<M>>;

/**
 * @summary La interfaz final que se aplica a un componente de React para hacerlo polimórfico y con seguridad de tipos.
 * @description Este tipo describe un componente que se puede llamar de dos maneras (lo que en TypeScript se conoce como sobrecarga de funciones):
 * * **1. Con la prop `as`:**
 * Si se llama al componente y se le pasa la prop `as` (ej. `as="a"`), entonces aceptará todas las props personalizadas del componente MÁS todas las props nativas del elemento `<a>` (como `href`, `target`, etc.).
 * @example
 * <MiComponente as="a" href="/ruta" miPropPersonalizada="valor" />
 *
 * **2. Sin la prop `as`:**
 * Si se llama al componente sin la prop `as`, entonces aceptará todas las props personalizadas del componente MÁS todas las props nativas de su `defaultComponent` (definido en el `TypeMap`).
 * @example
 * // Si el defaultComponent es 'div':
 * <MiComponente miPropPersonalizada="valor" /> // Acepta props de <div>
 */
export interface OverridableComponent<M extends OverridableTypeMap> {
  <C extends React.ElementType>(
    props: {
      as: C;
    } & OverrideProps<M, C>,
  ): React.JSX.Element | null;
  (props: DefaultComponentProps<M>): React.JSX.Element | null;
  propType?: ObjectUnknown;
}
