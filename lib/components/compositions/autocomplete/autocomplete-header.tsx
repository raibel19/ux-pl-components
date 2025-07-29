import { forwardRef, ReactNode, useEffect } from 'react';

import { cn } from '../../../lib/utils';
import { Separator } from '../../ui/separator';

interface AutocompleteHeaderProps {
  children?: ReactNode;
  className?: string;
  showSeparator?: boolean;
}

export default forwardRef<HTMLDivElement, AutocompleteHeaderProps>(function AutocompleteHeader(props, ref) {
  const { children, className, showSeparator = true } = props;

  useEffect(() => {
    console.log('Component-AutocompleteHeader');
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          'sticky top-0 z-10 min-h-8 content-center rounded-t-sm bg-ux-autocomplete-header px-9 py-1.5 text-xs font-medium text-foreground',
          className || null,
        )}
        onMouseDown={(e) => e.preventDefault()}
      >
        {children}
      </div>
      {showSeparator && <Separator orientation="horizontal" className="bg-ux-autocomplete-header-separator/70" />}
    </>
  );
});
