import { Virtualizer, ScrollToOptions } from '@tanstack/virtual-core';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { ItemsWithIdentifier } from '../types/types';

interface UseListVirtualizeScrollProps {
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLDivElement>;
  isOpen: boolean;
  preSelectedValue: string | undefined;
  filteredItems: [string, ItemsWithIdentifier][];
  identifier: string | undefined;
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function useListVirtualizeScroll(props: UseListVirtualizeScrollProps) {
  const { rowVirtualizer, filteredItems, identifier, isOpen, preSelectedValue, parentRef } = props;

  const isWheelScrollRef = useRef<boolean>(false);

  const scrollToIndex = useCallback(
    (index: number, options: ScrollToOptions) => {
      rowVirtualizer.scrollToIndex(index, options);
    },
    [rowVirtualizer],
  );

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => {
        rowVirtualizer.measure();
      });

      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [isOpen, rowVirtualizer]);

  useLayoutEffect(() => {
    if (!isOpen || !filteredItems.length || isWheelScrollRef.current) return;

    const id = requestAnimationFrame(() => {
      let indexToScroll: number = -1;

      if (identifier) {
        indexToScroll = filteredItems.findIndex((item) => item[1].identifier === identifier);
      }

      if (indexToScroll !== -1) {
        scrollToIndex(indexToScroll, { align: 'auto' });
      }
    });

    return () => cancelAnimationFrame(id);
  }, [identifier, filteredItems, isOpen, scrollToIndex]);

  useEffect(() => {
    if (!isOpen || !filteredItems.length || isWheelScrollRef.current) return;

    const id = requestAnimationFrame(() => {
      let indexToScroll: number = -1;

      if (preSelectedValue) {
        indexToScroll = filteredItems.findIndex((item) => item[1].identifier === preSelectedValue);
      }

      if (indexToScroll !== -1) {
        scrollToIndex(indexToScroll, { align: 'auto' });
      }
    });

    return () => cancelAnimationFrame(id);
  }, [filteredItems, isOpen, scrollToIndex, preSelectedValue]);

  useEffect(() => {
    if (!isOpen || !parentRef.current || !isWheelScrollRef.current) return;

    const root = parentRef.current;

    const id = requestAnimationFrame(() => {
      // Durante la navegación, confiamos en que cmdk actualiza data-selected="true" en el ítem correcto. Hacemos scroll a ESE ítem.
      const selectedItem = root.querySelector<HTMLElement>('[data-selected="true"]');

      if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest' });
    });

    return () => cancelAnimationFrame(id);
    //NOTA: ES IMPORTANTE QUE NO SE ELIMINE preSelectedValue DE LAS DEPENDENCIAS, YA QUE SI NO, NO SE ACTUALIZA EL SCROLL CORRECTAMENTE.
  }, [preSelectedValue, isOpen, parentRef]);

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
