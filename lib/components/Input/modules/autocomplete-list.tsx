import { useMemo, useRef } from 'react';

import { CommandGroup } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/lib/utils';

import useListScroll from '../hooks/use-list-scroll';
import { IAutocompleteListProps } from '../interfaces/internals';
import AutocompleteListItem from './autocomplete-list-item';

export default function AutocompleteList<AutoCompData extends string>(props: IAutocompleteListProps<AutoCompData>) {
  const {
    classNamePopoverScrollArea,
    commandValueState,
    handleOnSelect,
    hidden,
    inputSelectedValueState,
    itemIconSelected,
    itemsState,
    openState,
    showIconSelected,
  } = props;

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const itemEntries = useMemo(() => Array.from(itemsState.entries()), [itemsState]);

  useListScroll({ commandValueState, inputSelectedValueState, itemsState, openState, scrollAreaRef });

  return (
    <ScrollArea
      ref={scrollAreaRef}
      type="always"
      className={cn(
        'flex max-h-48 flex-col rounded-none',
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
        className={cn('px-0', classNamePopoverScrollArea?.classNameGroup)}
      >
        {itemEntries.map(([key, { labelSuggestion, disable }]) => (
          <AutocompleteListItem
            key={key}
            classNamePopoverScrollArea={classNamePopoverScrollArea}
            handleOnSelect={handleOnSelect}
            identifier={key}
            itemIconSelected={itemIconSelected}
            labelSuggestion={labelSuggestion}
            inputSelectedValueState={inputSelectedValueState}
            showIconSelected={showIconSelected}
            disable={disable}
          />
        ))}
      </CommandGroup>
    </ScrollArea>
  );
}
