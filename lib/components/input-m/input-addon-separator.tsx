import { cn } from '../../lib/utils';
import { Separator } from '../ui/separator';
import { useInputContext } from './context';
import { separatorVariants } from './variants/input-addon-separator.variants';

interface InputAddonSeparatorProps {
  show?: boolean;
  className?: string;
}

export default function InputAddonSeparator(props: InputAddonSeparatorProps) {
  const { show = true, className } = props;
  const { isInvalid } = useInputContext();

  if (!show) return null;

  return (
    <Separator className={cn(separatorVariants({ isError: isInvalid }), className || null)} orientation="vertical" />
  );
}
