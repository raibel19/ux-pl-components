import { InfinitySymbol } from '@carbon/icons-react';
import { useCallback, useEffect, useState } from 'react';

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
  const [counterInternal, setCounterInternal] = useState<number>(0);

  const counterFunc = useCallback(
    (
      event: React.FormEvent<HTMLInputElement> | undefined,
      value: string | undefined = undefined,
      useValue: boolean = false,
    ) => {
      const currentValue = !useValue ? (event?.target as HTMLInputElement).value : value;
      const maxLengthReal = maxLength === 0 ? Infinity : maxLength;
      let length = 0;

      if (currentValue && maxLengthReal !== undefined && currentValue.length > maxLengthReal) {
        length = maxLengthReal;
      } else if (currentValue) {
        length = currentValue.length;
      }

      setCounterInternal((prev) => {
        if (length !== prev) return length;
        return prev;
      });
    },
    [maxLength],
  );

  useEffect(() => {
    counterFunc(undefined, value, true);
  }, [counterFunc, value]);

  if (!show) return null;

  return (
    <div
      className={cn(counterVariants({ isError: isInvalid }), classNameContainer || null)}
      aria-live="polite"
      role="status"
    >
      {counterInternal}/
      {maxLength === 0 ? (
        <InfinitySymbol size={18} strokeWidth={2} aria-hidden={true} className={className} />
      ) : (
        maxLength
      )}
    </div>
  );
}
