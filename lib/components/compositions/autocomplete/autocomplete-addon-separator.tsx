import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import { Separator } from '../../ui/separator';
import { separatorVariants } from './autocomplete-addon-separator.variants';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

interface AutocompleteAddonSeparatorProps {
  show?: boolean;
  className?: string;
}

export default forwardRef<HTMLDivElement, AutocompleteAddonSeparatorProps>(
  function AutocompleteAddonSeparator(props, ref) {
    const { show = true, className } = props;
    const { isInvalid } = useAutocompleteContext();
    const { disabled } = useAutocompleteActionsContext();

    if (!show) return null;

    return (
      <Separator
        ref={ref}
        className={cn(separatorVariants({ isInvalid, disabled }), className || null)}
        orientation="vertical"
      />
    );
  },
);
