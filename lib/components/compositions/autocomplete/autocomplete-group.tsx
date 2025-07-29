import { Command, CommandList } from '../../ui/command';
import { Popover } from '../../ui/popover';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

interface AutocompleteGroupProps {
  children: React.ReactNode;
}

export default function AutocompleteGroup(props: AutocompleteGroupProps) {
  const { children } = props;

  const { isOpen, preSelectedValue } = useAutocompleteContext();
  const { onTooglePopover, onPreSelectItem } = useAutocompleteActionsContext();

  return (
    <Popover open={isOpen} onOpenChange={onTooglePopover}>
      <Command
        shouldFilter={false}
        value={preSelectedValue}
        onValueChange={onPreSelectItem}
        className="[&_label]:hidden"
      >
        {!isOpen && <CommandList aria-hidden="true" className="hidden" />}
        {children}
      </Command>
    </Popover>
  );
}
