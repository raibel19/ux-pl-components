import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import FieldMessage from '../../primitives/field-message';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

interface AutocompleteErrorsProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  customMessageError?: string;
}

export default forwardRef<HTMLUListElement, AutocompleteErrorsProps>(function AutocompleteErrors(props, ref) {
  const { className, customMessageError, ...moreProps } = props;
  const { isInvalid } = useAutocompleteContext();
  const { errors } = useAutocompleteActionsContext();

  const newErrors = [...errors];

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
