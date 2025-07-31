import { useMemo, useRef } from 'react';

import { cn } from '../../../lib/utils';
import { CommandGroup } from '../../ui/command';
import { ScrollArea } from '../../ui/scroll-area';
import AutocompleteItem from './autocomplete-item';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';
import useListScroll from './hooks/use-list-scroll';
import { ItemsWithIdentifier } from './types/types';

interface AutocompleteListProps {
  className?: string;
  classNameGroup?: string;
  classNameItem?: string;
  children?: (props: { item: ItemsWithIdentifier; isSelected: boolean }) => React.ReactNode;
}

export default function AutocompleteList(props: AutocompleteListProps) {
  const { className, classNameGroup, classNameItem, children } = props;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { filteredItems, isLoading, isOpen, selectedValue, preSelectedValue, inputValue, isSearching } =
    useAutocompleteContext();
  const { minLengthRequired } = useAutocompleteActionsContext();

  const itemsToRender = useMemo(() => Array.from(filteredItems.values()), [filteredItems]);
  const identifier = selectedValue?.identifier;
  const hidden = filteredItems.size === 0 || inputValue.length < minLengthRequired || isLoading || isSearching;

  useListScroll({ filteredItems, identifier, isOpen, preSelectedValue, scrollAreaRef });

  return (
    <ScrollArea
      ref={scrollAreaRef}
      type="always"
      className={cn(
        'flex max-h-48 flex-col rounded-none',
        'suggestionScrollArea',
        hidden && 'hidden',
        className || null,
      )}
      onMouseDown={(e) => e.preventDefault()} // Evitar que el scroll capture el evento y tome el foco
      tabIndex={-1} // Evita que el elemento reciba foco mediante tabulación
    >
      <CommandGroup onMouseDown={(e) => e.preventDefault()} className={cn('px-0', classNameGroup || null)}>
        {itemsToRender.map((item) => (
          <AutocompleteItem key={item.identifier} item={item} className={classNameItem} renderGlobal={children} />
        ))}
      </CommandGroup>
    </ScrollArea>
  );
}
