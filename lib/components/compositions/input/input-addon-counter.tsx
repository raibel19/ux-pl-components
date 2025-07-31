import { InfinitySymbol } from '@carbon/icons-react';
import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import { useInputActionsContext, useInputContext } from './context';

interface InputAddonCounterProps {
  className?: string;
  classNameContainer?: string;
  show?: boolean;
}

export default forwardRef<HTMLDivElement, InputAddonCounterProps>(function InputAddonCounter(props, ref) {
  const { className, classNameContainer, show = true } = props;

  const { value, isInvalid } = useInputContext();
  const { maxLength } = useInputActionsContext();

  if (!show) return null;

  const currentLnegth = value?.length || 0;

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none inset-y-0 flex h-full items-center justify-center border-t border-transparent text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50',
        isInvalid && 'text-destructive',
        classNameContainer || null,
      )}
      aria-live="polite"
      role="status"
    >
      {currentLnegth}/
      {maxLength === 0 || maxLength === undefined ? (
        <InfinitySymbol size={18} strokeWidth={2} aria-hidden={true} className={className} />
      ) : (
        maxLength
      )}
    </div>
  );
});
