import { forwardRef, ReactNode, useEffect } from 'react';

import { cn } from '../../../lib/utils';

interface AutocompleteInputWrapperProps {
  children: ReactNode;
  className?: string;
}

export default forwardRef<HTMLDivElement, AutocompleteInputWrapperProps>(function AutocompleteInputWrapper(props, ref) {
  const { children, className } = props;

  useEffect(() => {
    console.log('Component-AutocompleteInputWrapper');
  }, []);

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      {children}
    </div>
  );
});
