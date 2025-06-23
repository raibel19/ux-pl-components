import { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '../../lib/utils';
import { messageVariants } from './field-message.variants';

interface FieldMessageProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
  messages?: string[];
  variant: VariantProps<typeof messageVariants>;
}

export default forwardRef<HTMLUListElement, FieldMessageProps>(function FieldMessage(props, ref) {
  const { className, messages, variant, ...moreProps } = props;

  if (!messages || !messages.length) return null;

  const variants = messageVariants(variant);

  return (
    <ul ref={ref} {...moreProps} className={cn(variants, className || null)} role="alert" aria-live="polite">
      {messages?.map((msg, idx) => <li key={idx}>{msg}</li>)}
    </ul>
  );
});
