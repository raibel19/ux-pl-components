import { forwardRef } from 'react';

import { cn } from '../../lib/utils';
import { Label as LabelScn } from '../ui/label';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  className?: string;
  htmlFor?: string;
}
export default forwardRef<HTMLLabelElement, LabelProps>(function Label(props, ref) {
  const { children, className, htmlFor, ...moreProps } = props;

  return (
    <LabelScn
      ref={ref}
      {...moreProps}
      htmlFor={htmlFor}
      className={cn('text-sm font-medium leading-none', className || null)}
    >
      {children}
    </LabelScn>
  );
});
