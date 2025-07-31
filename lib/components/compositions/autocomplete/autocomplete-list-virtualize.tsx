import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { cn } from '../../../lib/utils';
import { CommandGroup } from '../../ui/command';
import AutocompleteItem from './autocomplete-item';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';
import useListVirtualizeScroll from './hooks/use-list-virtualize-scroll';
import { ItemsWithIdentifier } from './types/types';

interface AutocompleteListVirtualizeProps {
  className?: string;
  classNameGroup?: string;
  classNameItem?: string;
  children?: (props: { item: ItemsWithIdentifier; isSelected: boolean }) => React.ReactNode;
}

export default function AutocompleteListVirtualize(props: AutocompleteListVirtualizeProps) {
  const { children, className, classNameGroup, classNameItem } = props;
  const parentRef = useRef<HTMLDivElement | null>(null);

  const { filteredItems, isLoading, isOpen, selectedValue, preSelectedValue, inputValue, isSearching } =
    useAutocompleteContext();
  const { minLengthRequired, registerKeydownOverride, onPreSelectItem } = useAutocompleteActionsContext();

  const items = useMemo(() => Array.from(filteredItems.values()), [filteredItems]);
  const itemsIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item, idx) => map.set(item.identifier, idx));
    return map;
  }, [items]);

  const identifier = selectedValue?.identifier;
  const hidden = filteredItems.size === 0 || inputValue.length < minLengthRequired || isLoading || isSearching;

  const findNextEnabledIndex = (currentIndex: number, items: ItemsWithIdentifier[], direction: string) => {
    const len = items.length;
    const directionValue = direction === 'ArrowDown' ? 1 : -1;

    let nextIndex = currentIndex;
    let tries = 0; //evitar bucles infinitos si todos los items estuvieran deshabilitados.

    do {
      nextIndex = (nextIndex + directionValue + len) % len;
      tries++;
    } while (items[nextIndex]?.disabled && tries < len);
    return nextIndex;
  };

  const handleArrowNavigation = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.preventDefault();

      if (!items.length) return;

      const currentIdentifier = preSelectedValue;
      const currentIndex = currentIdentifier ? (itemsIndexMap.get(currentIdentifier) ?? -1) : -1;
      const nextEnabledIndex = findNextEnabledIndex(currentIndex, items, event.key);

      if (nextEnabledIndex !== currentIndex) {
        const nextItem = items[nextEnabledIndex];
        if (nextItem) onPreSelectItem(nextItem.identifier);
      }
    },
    [items, itemsIndexMap, onPreSelectItem, preSelectedValue],
  );

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: filteredItems.size,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 1,
    paddingStart: 4,
    paddingEnd: 4,
    scrollPaddingStart: 4,
    measureElement: (element) => {
      return element.scrollHeight;
    },
  });

  useListVirtualizeScroll({
    filteredItems: items,
    identifier,
    isOpen,
    preSelectedValue,
    rowVirtualizer,
    parentRef,
  });

  const rowItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const unregisterUp = registerKeydownOverride('ArrowUp', handleArrowNavigation);
    const unregisterDown = registerKeydownOverride('ArrowDown', handleArrowNavigation);

    return () => {
      unregisterUp();
      unregisterDown();
    };
  }, [handleArrowNavigation, registerKeydownOverride]);

  return (
    <div
      ref={parentRef}
      className={cn(
        'max-h-44 w-full overflow-auto rounded-none',
        'suggestionScrollArea',
        hidden && 'hidden',
        className || null,
      )}
      onMouseDown={(e) => e.preventDefault()} // Evitar que el scroll capture el evento y tome el foco
      tabIndex={-1} // Evita que el elemento reciba foco mediante tabulación
    >
      {/* {!hidden && <CommandItem value="-" className="hidden" />} */}
      <CommandGroup
        onMouseDown={(e) => e.preventDefault()}
        className={cn('relative w-full px-0', classNameGroup)}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          //   console.log('Render row:', virtualRow.index, 'Total visible:', rowItems.length);
          return (
            <div
              key={item.identifier}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              className={cn('absolute left-0 top-0 w-full')}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <AutocompleteItem item={item} className={classNameItem} renderGlobal={children} />
            </div>
          );
        })}
      </CommandGroup>
    </div>
  );
}
