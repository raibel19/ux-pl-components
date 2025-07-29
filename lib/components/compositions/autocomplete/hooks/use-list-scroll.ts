import { useEffect, useLayoutEffect } from 'react';

import { ItemsWithIdentifier } from '../types/types';

interface UseListScrollProps {
  isOpen: boolean;
  preSelectedValue: string | undefined;
  identifier: string | undefined;
  filteredItems: Map<string, ItemsWithIdentifier>;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export default function useListScroll(props: UseListScrollProps) {
  const { filteredItems, identifier, isOpen, preSelectedValue, scrollAreaRef } = props;
  useLayoutEffect(() => {
    if (!isOpen) return;

    const id = requestAnimationFrame(() => {
      if (!scrollAreaRef.current) return;

      const root = scrollAreaRef.current;
      let itemToScroll = null;

      // Prioridad 1: Intentamos scroll al ítem que tiene el atributo personalizado data-selecteditem="true"
      itemToScroll = root.querySelector<HTMLElement>('[data-selecteditem="true"]');

      // Prioridad 2: Si no encontramos el ítem con data-selecteditem (ej: selección inicial sin valor previo),
      //              o si data-selecteditem no funciona, intentamos scroll al ítem que coincida con inputSelectedValueState por data-value
      if (!itemToScroll && identifier) {
        itemToScroll = root.querySelector<HTMLElement>(`[data-value="${identifier}"]`);
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
    //NOTA: ES IMPORTANTE QUE NO SE ELIMINE filteredItems DE LAS DEPENDENCIAS, YA QUE SI NO, NO SE ACTUALIZA EL SCROLL CORRECTAMENTE.
  }, [isOpen, identifier, filteredItems, scrollAreaRef]);

  useEffect(() => {
    if (!isOpen || !scrollAreaRef.current) return;

    const root = scrollAreaRef.current;

    const id = requestAnimationFrame(() => {
      // Durante la navegación, confiamos en que cmdk actualiza data-selected="true" en el ítem correcto. Hacemos scroll a ESE ítem.
      const selectedItem = root.querySelector<HTMLElement>('[data-selected="true"]');

      if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest' });
    });

    return () => cancelAnimationFrame(id);
    //NOTA: ES IMPORTANTE QUE NO SE ELIMINE preSelectedValue DE LAS DEPENDENCIAS, YA QUE SI NO, NO SE ACTUALIZA EL SCROLL CORRECTAMENTE.
  }, [preSelectedValue, isOpen, scrollAreaRef]);
}
