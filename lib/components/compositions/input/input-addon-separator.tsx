import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import { Separator } from '../../ui/separator';
import { useInputContext } from './context';
import { separatorVariants } from './input-addon-separator.variants';

interface InputAddonSeparatorProps {
  show?: boolean;
  className?: string;
}

export default forwardRef<HTMLDivElement, InputAddonSeparatorProps>(function InputAddonSeparator(props, ref) {
  const { show = true, className } = props;
  const { isInvalid, disabled } = useInputContext();

  if (!show) return null;

  return (
    <Separator
      ref={ref}
      className={cn(separatorVariants({ isInvalid, disabled }), className || null)}
      orientation="vertical"
    />
  );
});
