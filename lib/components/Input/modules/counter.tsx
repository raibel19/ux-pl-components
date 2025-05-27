import { InfinitySymbol } from '@carbon/icons-react';
import { useCallback, useEffect, useId, useState } from 'react';

import { cn } from '@/lib/utils';

import { counterVariants } from '../helpers/variants';
import { ICounterProps } from '../interfaces/internals';

export default function Counter(props: ICounterProps) {
  const {
    classNameCounterContainer,
    classNameCounterInfinityIcon,
    maxLength,
    showError,
    showNumericValidationErrors,
    value,
    isLastElement,
  } = props;

  const id = useId();
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

  return (
    <div
      id={`${id}-description`}
      className={cn(
        counterVariants({
          show: true,
          isError: showError || showNumericValidationErrors,
          isLastElement,
        }),
        classNameCounterContainer || null,
      )}
      aria-live="polite"
      role="status"
    >
      {counterInternal}/
      {maxLength === 0 ? (
        <InfinitySymbol size={18} strokeWidth={2} aria-hidden={true} className={classNameCounterInfinityIcon} />
      ) : (
        maxLength
      )}
    </div>
  );
}
