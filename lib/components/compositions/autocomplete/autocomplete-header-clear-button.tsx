import { Close } from '@carbon/icons-react';
import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

interface AutocompleteHeaderClearButtonProps {
  className?: string;
  classNameIcon?: string;
}

export default forwardRef<HTMLButtonElement, AutocompleteHeaderClearButtonProps>(
  function AutocompleteHeaderClearButton(props, ref) {
    const { className, classNameIcon } = props;

    const { lastValidSelection, isLoading } = useAutocompleteContext();
    const { onReset } = useAutocompleteActionsContext();

    if (!lastValidSelection || isLoading) return null;

    return (
      <div className={cn('absolute inset-y-0 right-0 flex items-center pe-1.5', className || null)}>
        <button
          ref={ref}
          className={cn(
            'pointer-events-auto text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70',
          )}
          aria-label="clear input"
          onMouseDown={(e) => e.preventDefault}
        >
          <Close className={classNameIcon} size={18} strokeWidth={2} aria-hidden="true" onClick={onReset} />
        </button>
      </div>
    );
  },
);
