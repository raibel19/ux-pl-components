import { Check } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { CommandItem } from '@/components/ui/command';

import { equals } from '@/lib/helpers/object';
import { genericMemo } from '@/lib/helpers/react';
import { cn } from '@/lib/utils';

import { IAutocompleteListItemProps } from '../interfaces/internals';

export default genericMemo(
  function AutocompleteListItem<AutoCompData extends string>(
    props: Omit<IAutocompleteListItemProps<AutoCompData>, 'labelSelected'>,
  ) {
    const {
      classNamePopoverScrollArea,
      handleOnSelect,
      identifier,
      inputSelectedValueState,
      itemIconSelected,
      labelSuggestion,
      showIconSelected,
      disable,
    } = props;

    const isSelected = useMemo(() => inputSelectedValueState === identifier, [identifier, inputSelectedValueState]);

    const renderIcon = useCallback(() => {
      if (itemIconSelected) {
        return (
          <div
            className={cn(
              'mr-2 h-4 w-4',
              isSelected ? 'opacity-100' : 'opacity-0',
              classNamePopoverScrollArea?.classNameItemIcon || null,
            )}
          >
            {itemIconSelected}
          </div>
        );
      }
      return (
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            isSelected ? 'opacity-100' : 'opacity-0',
            classNamePopoverScrollArea?.classNameItemIcon || null,
          )}
        />
      );
    }, [classNamePopoverScrollArea?.classNameItemIcon, isSelected, itemIconSelected]);

    return (
      <CommandItem
        value={identifier}
        data-selecteditem={isSelected}
        onMouseDown={(e) => e.preventDefault()}
        onSelect={handleOnSelect}
        disabled={disable}
        className={cn(
          'rounded-none text-sm text-foreground/80 data-[selected=true]:text-foreground data-[selected=true]:hover:text-foreground',
          isSelected ? 'border-y bg-accent/40' : null,
          classNamePopoverScrollArea?.classNameItem || null,
        )}
      >
        {showIconSelected && renderIcon()}
        {labelSuggestion}
      </CommandItem>
    );
  },
  (prevProps, nextProps) => {
    return equals(prevProps, nextProps);
  },
);
