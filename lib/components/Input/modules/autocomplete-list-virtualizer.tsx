import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';

import { CommandGroup } from '@/components/ui/command';

import { cn } from '@/lib/utils';

import useListVirtualizeScroll from '../hooks/use-list-virtualize-scroll';
import { IAutocompleteListVirtualizerProps } from '../interfaces/internals';
import AutocompleteListItem from './autocomplete-list-item';

export default function AutocompleteListVirtualizer<AutoCompData extends string>(
  props: IAutocompleteListVirtualizerProps<AutoCompData>,
) {
  const {
    classNamePopoverScrollArea,
    handleOnSelect,
    hidden,
    inputSelectedValueState,
    itemIconSelected,
    itemsState,
    openState,
    showIconSelected,
    commandValueState,
  } = props;
  const parentRef = useRef<HTMLDivElement | null>(null);

  const itemEntries = useMemo(() => Array.from(itemsState.entries()), [itemsState]);

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: itemsState.size,
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
    commandValueState,
    inputSelectedValueState,
    itemEntries,
    openState,
    parentRef,
    rowVirtualizer,
  });

  const rowItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn(
        'max-h-44 w-full overflow-auto rounded-none',
        'suggestionScrollArea',
        hidden && 'hidden',
        classNamePopoverScrollArea?.classNameContainer || null,
      )}
      onMouseDown={(e) => e.preventDefault()} // Evitar que el scroll capture el evento y tome el foco
      tabIndex={-1} // Evita que el elemento reciba foco mediante tabulación
    >
      {/* {!hidden && <CommandItem value="-" className="hidden" />} */}
      <CommandGroup
        onMouseDown={(e) => e.preventDefault()}
        className={cn('relative w-full px-0', classNamePopoverScrollArea?.classNameGroup)}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowItems.map((virtualRow) => {
          const [key, { labelSuggestion, disable }] = itemEntries[virtualRow.index];
          // console.log('Render row:', virtualRow.index, 'Total visible:', rowItems.length);
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
            >
              <AutocompleteListItem
                handleOnSelect={handleOnSelect}
                identifier={key}
                labelSuggestion={labelSuggestion}
                showIconSelected={showIconSelected}
                inputSelectedValueState={inputSelectedValueState}
                classNamePopoverScrollArea={classNamePopoverScrollArea}
                itemIconSelected={itemIconSelected}
                disable={disable}
              />
            </div>
          );
        })}
      </CommandGroup>
    </div>
  );
}
