import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import FieldMessage from '../../primitives/field-message';
import { useInputContext } from './context';

interface InputErrorsProps {
  className?: string;
}

export default forwardRef<HTMLUListElement, InputErrorsProps>(function InputErrors(props, ref) {
  const { className } = props;
  const { errors, isInvalid } = useInputContext();

  if (!isInvalid || !errors.length) return null;

  return (
    <FieldMessage
      ref={ref}
      variant={{ type: 'error', size: 'sm' }}
      messages={errors}
      className={cn('mt-2 min-w-full max-w-min [text-wrap-style:pretty]', className || null)}
    />
  );
});
