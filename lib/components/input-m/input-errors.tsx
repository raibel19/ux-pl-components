import { cn } from '../../lib/utils';
import { useInputContext } from './context';

interface InputErrorsProps {
  className?: string;
}

export default function InputErrors(props: InputErrorsProps) {
  const { className } = props;
  const { errors, isInvalid } = useInputContext();

  if (!isInvalid || !errors.length) return null;

  return (
    <ul
      className={cn(
        'mt-2 min-w-full max-w-min list-inside list-none space-y-1 text-xs text-destructive [text-wrap-style:pretty]',
        className || null,
      )}
      role="alert"
      aria-live="polite"
    >
      {errors.map((err, idx) => (
        <li key={idx}>{err}</li>
      ))}
    </ul>
  );
}
