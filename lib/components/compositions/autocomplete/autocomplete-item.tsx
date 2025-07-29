import { useEffect } from 'react';

import { cn } from '../../../lib/utils';
import { CommandItem } from '../../ui/command';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';
import { ItemsWithIdentifier } from './types/types';

interface AutocompleteItemProps {
  item: ItemsWithIdentifier;
  className?: string;
  renderGlobal?: (props: { item: ItemsWithIdentifier; isSelected: boolean }) => React.ReactNode;
}

export default function AutocompleteItem(props: AutocompleteItemProps) {
  const { item, className, renderGlobal } = props;
  const { identifier, label, disabled, render: itemRender } = item;

  const { selectedValue } = useAutocompleteContext();
  const { onSelectItem } = useAutocompleteActionsContext();

  const isSelected = selectedValue?.identifier === identifier;

  const renderContent = () => {
    const baseContent = renderGlobal ? renderGlobal({ item, isSelected }) : <span>{label}</span>;

    if (itemRender) {
      return itemRender({ item, isSelected, children: baseContent });
    }

    return baseContent;
  };

  useEffect(() => {
    console.log('Component-AutocompleteItem');
  }, []);

  return (
    <CommandItem
      value={identifier}
      data-selecteditem={isSelected}
      onMouseDown={(e) => e.preventDefault()}
      onSelect={onSelectItem}
      disabled={disabled}
      className={cn(
        'rounded-none text-sm text-foreground/80 data-[selected=true]:text-foreground data-[selected=true]:hover:text-foreground',
        isSelected ? 'bg-ux-autocomplete-item-selected/65' : null,
        className || null,
      )}
    >
      {renderContent()}
    </CommandItem>
  );
}
