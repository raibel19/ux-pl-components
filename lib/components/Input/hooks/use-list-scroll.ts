import { RefObject, useEffect, useLayoutEffect } from 'react';

import { IAutocompleteItemsExtend } from '../interfaces/internals';

interface IProps<AutoCompData extends string> {
  commandValueState: string;
  openState: boolean;
  scrollAreaRef: RefObject<HTMLDivElement | null>;
  inputSelectedValueState: string;
  itemsState: Map<string, IAutocompleteItemsExtend<AutoCompData>>;
}

export default function useListScroll<AutoCompData extends string>(props: IProps<AutoCompData>) {
  const { commandValueState, openState, scrollAreaRef, inputSelectedValueState, itemsState } = props;

  useLayoutEffect(() => {
    if (!openState) return;

    const id = requestAnimationFrame(() => {
      if (!scrollAreaRef.current) return;

      const root = scrollAreaRef.current;
      let itemToScroll = null;

      // Prioridad 1: Intentamos scroll al ítem que tiene el atributo personalizado data-selecteditem="true"
      itemToScroll = root.querySelector<HTMLElement>('[data-selecteditem="true"]');

      // Prioridad 2: Si no encontramos el ítem con data-selecteditem (ej: selección inicial sin valor previo),
      //              o si data-selecteditem no funciona, intentamos scroll al ítem que coincida con inputSelectedValueState por data-value
      if (!itemToScroll && inputSelectedValueState) {
        itemToScroll = root.querySelector<HTMLElement>(`[data-value="${inputSelectedValueState}"]`);
      }

      // Prioridad 3: Si aún no encontramos un ítem (ej: apertura inicial sin valor seleccionado),
      //             hacemos scroll al ítem que cmdk ha marcado con data-selected="true" (normalmente el primero en la inicialización)
      if (!itemToScroll) {
        itemToScroll = root.querySelector<HTMLElement>('[data-selected="true"]');
      }

      // Si encontramos un ítem para hacer scroll, lo hacemos
      if (itemToScroll) itemToScroll.scrollIntoView({ block: 'nearest' });
    });

    return () => cancelAnimationFrame(id);
    //NOTA: ES IMPORTANTE QUE NO SE ELIMINE itemsState DE LAS DEPENDENCIAS, YA QUE SI NO, NO SE ACTUALIZA EL SCROLL CORRECTAMENTE.
  }, [openState, inputSelectedValueState, itemsState, scrollAreaRef]);

  useEffect(() => {
    if (!openState || !scrollAreaRef.current) return;

    const root = scrollAreaRef.current;

    const id = requestAnimationFrame(() => {
      // Durante la navegación, confiamos en que cmdk actualiza data-selected="true" en el ítem correcto. Hacemos scroll a ESE ítem.
      const selectedItem = root.querySelector<HTMLElement>('[data-selected="true"]');

      if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest' });
    });

    return () => cancelAnimationFrame(id);
    //NOTA: ES IMPORTANTE QUE NO SE ELIMINE commandValueState DE LAS DEPENDENCIAS, YA QUE SI NO, NO SE ACTUALIZA EL SCROLL CORRECTAMENTE.
  }, [commandValueState, openState, scrollAreaRef]);
}
