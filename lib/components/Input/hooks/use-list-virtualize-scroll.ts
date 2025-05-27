import { Virtualizer, ScrollToOptions } from '@tanstack/virtual-core';
import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { IAutocompleteItemsExtend } from '../interfaces/internals';

interface IProps<AutoCompData extends string> {
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLDivElement>;
  openState: boolean;
  commandValueState: string;
  itemEntries: [string, IAutocompleteItemsExtend<AutoCompData>][];
  inputSelectedValueState: string;
  parentRef: MutableRefObject<HTMLDivElement | null>;
}

export default function useListVirtualizeScroll<AutoCompData extends string>(props: IProps<AutoCompData>) {
  const { rowVirtualizer, openState, commandValueState, itemEntries, inputSelectedValueState, parentRef } = props;

  const isWheelScrollRef = useRef<boolean>(false);

  const scrollToIndex = useCallback(
    (index: number, options: ScrollToOptions) => {
      rowVirtualizer.scrollToIndex(index, options);
    },
    [rowVirtualizer],
  );

  useEffect(() => {
    if (openState) {
      const id = requestAnimationFrame(() => {
        rowVirtualizer.measure();
      });

      return () => cancelAnimationFrame(id);
    }
  }, [openState, rowVirtualizer]);

  useLayoutEffect(() => {
    if (!openState || !itemEntries.length || isWheelScrollRef.current) return;

    const id = requestAnimationFrame(() => {
      let indexToScroll: number = -1;

      if (inputSelectedValueState) {
        indexToScroll = itemEntries.findIndex((item) => item[1].identifier === inputSelectedValueState);
      }

      if (indexToScroll !== -1) {
        scrollToIndex(indexToScroll, { align: 'auto' });
      }
    });

    return () => cancelAnimationFrame(id);
  }, [inputSelectedValueState, itemEntries, openState, scrollToIndex]);

  useEffect(() => {
    if (!openState || !itemEntries.length || isWheelScrollRef.current) return;

    const id = requestAnimationFrame(() => {
      let indexToScroll: number = -1;

      if (commandValueState) {
        indexToScroll = itemEntries.findIndex((item) => item[1].identifier === commandValueState);
      }

      if (indexToScroll !== -1) {
        scrollToIndex(indexToScroll, { align: 'auto' });
      }
    });

    return () => cancelAnimationFrame(id);
  }, [itemEntries, openState, scrollToIndex, commandValueState]);

  useEffect(() => {
    if (!openState || !parentRef.current || !isWheelScrollRef.current) return;

    const root = parentRef.current;

    const id = requestAnimationFrame(() => {
      // Durante la navegación, confiamos en que cmdk actualiza data-selected="true" en el ítem correcto. Hacemos scroll a ESE ítem.
      const selectedItem = root.querySelector<HTMLElement>('[data-selected="true"]');

      if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest' });
    });

    return () => cancelAnimationFrame(id);
    //NOTA: ES IMPORTANTE QUE NO SE ELIMINE commandValueState DE LAS DEPENDENCIAS, YA QUE SI NO, NO SE ACTUALIZA EL SCROLL CORRECTAMENTE.
  }, [commandValueState, openState, parentRef]);

  useEffect(() => {
    const root = parentRef.current;
    if (!root) return;

    let id: NodeJS.Timeout | undefined = undefined;
    const handleScroll = () => {
      isWheelScrollRef.current = true;

      if (id) clearTimeout(id);

      id = setTimeout(() => {
        isWheelScrollRef.current = false;
      }, 200);
    };

    root.addEventListener('scroll', handleScroll);

    return () => {
      root.removeEventListener('scroll', handleScroll);
      if (id) clearTimeout(id);
    };
  }, [parentRef]);
}
