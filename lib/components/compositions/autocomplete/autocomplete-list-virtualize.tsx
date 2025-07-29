import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';

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
  const { minLengthRequired } = useAutocompleteActionsContext();

  const itemsToRender = useMemo(() => Array.from(filteredItems.entries()), [filteredItems]);
  const identifier = selectedValue?.identifier;
  const hidden = filteredItems.size === 0 || inputValue.length < minLengthRequired || isLoading || isSearching;

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: filteredItems.size,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 1,
    paddingStart: 4,
    paddingEnd: 4,
    scrollPaddingStart: 4,
    measureElement: (element) => {
      console.log('measureElement: ', element.scrollHeight);
      return element.scrollHeight;
    },
  });

  useListVirtualizeScroll({
    filteredItems: itemsToRender,
    identifier,
    isOpen,
    preSelectedValue,
    rowVirtualizer,
    parentRef,
  });

  const rowItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    console.log('rowVirtualizer.getTotalSize()', rowVirtualizer.getTotalSize());
  }, [rowVirtualizer]);

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
          const [key, item] = itemsToRender[virtualRow.index];
          console.log('Render row:', virtualRow.index, 'Total visible:', rowItems.length);
          return (
            <div
              key={key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              className={cn('absolute left-0 top-0 w-full')}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              data-disabled={item.disabled ? 'true' : undefined}
              aria-disabled={item.disabled ? 'true' : undefined}
            >
              <AutocompleteItem key={key} item={item} className={classNameItem} renderGlobal={children} />
            </div>
          );
        })}
      </CommandGroup>
    </div>
  );
}
