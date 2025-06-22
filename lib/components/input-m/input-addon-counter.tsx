import { InfinitySymbol } from '@carbon/icons-react';

import { cn } from '../../lib/utils';
import { useInputContext } from './context';
import { counterVariants } from './variants/input-addon-counter.variants';

interface InputAddonCounterProps {
  className?: string;
  classNameContainer?: string;
  show?: boolean;
}

export default function InputAddonCounter(props: InputAddonCounterProps) {
  const { className, classNameContainer, show = true } = props;

  const { value, maxLength, isInvalid } = useInputContext();

  if (!show) return null;

  const currentLnegth = value?.length || 0;

  return (
    <div
      className={cn(counterVariants({ isError: isInvalid }), classNameContainer || null)}
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
}
