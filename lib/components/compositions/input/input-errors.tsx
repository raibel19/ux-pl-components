import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import FieldMessage from '../../primitives/field-message';
import { useInputActionsContext, useInputContext } from './context';

interface InputErrorsProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  customMessageError?: string;
}

export default forwardRef<HTMLUListElement, InputErrorsProps>(function InputErrors(props, ref) {
  const { className, customMessageError, ...moreProps } = props;
  const { isInvalid } = useInputContext();
  const { errors } = useInputActionsContext();

  const newErrors = errors;

  if (customMessageError && isInvalid) {
    newErrors.push(customMessageError);
  }

  if (!isInvalid || !newErrors.length) return null;

  return (
    <FieldMessage
      ref={ref}
      {...moreProps}
      variant={{ type: 'error', size: 'sm' }}
      messages={newErrors}
      className={cn('mt-2 min-w-full max-w-min [text-wrap-style:pretty]', className || null)}
    />
  );
});
