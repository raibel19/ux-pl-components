import { forwardRef, ReactNode, useRef } from 'react';

import mergeRefs from '../../../lib/merge-refs';
import { cn } from '../../../lib/utils';
import { useAutocompleteActionsContext } from './context';
import useResizeObserver from './hooks/use-resize-observer';

interface AutocompleteRightAddonProps {
  children: ReactNode;
  className?: string;
}

export default forwardRef<HTMLDivElement, AutocompleteRightAddonProps>(function AutocompleteRightAddon(props, ref) {
  const { children, className } = props;

  const addonRef = useRef<HTMLDivElement>(null);
  const { setRightAddonWidth } = useAutocompleteActionsContext();

  useResizeObserver(addonRef, (entry) => {
    const divWidth = entry.contentRect.width;
    const width = divWidth ? `${divWidth + 16}px` : '0.75rem';
    setRightAddonWidth(width);
  });

  const mergeRef = mergeRefs(ref, addonRef);

  return (
    <div
      ref={mergeRef}
      className={cn('pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3', className)}
    >
      {children}
    </div>
  );
});
