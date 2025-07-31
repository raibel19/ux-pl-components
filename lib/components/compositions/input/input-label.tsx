import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import Label from '../../primitives/label';
import { useInputActionsContext, useInputContext } from './context';

interface InputLabelProps {
  className?: string | undefined;
  classNameRequired?: string;
  classNameText?: string;
  classNameTextRequired?: string;
  isRequired?: boolean;
  showText?: boolean;
  text?: string;
  textRequired?: string;
}

export default forwardRef<HTMLLabelElement, InputLabelProps>(function InputLabel(props, ref) {
  const {
    className,
    classNameRequired,
    classNameText,
    classNameTextRequired,
    isRequired = false,
    showText = true,
    text,
    textRequired,
  } = props;
  const { isInvalid } = useInputContext();
  const { id, disabled } = useInputActionsContext();

  if (!showText && !textRequired && !isRequired) return null;

  return (
    <Label
      ref={ref}
      htmlFor={id}
      className={cn(
        disabled && 'cursor-not-allowed',
        'absolute left-0 top-0 z-[1] -mt-2 ml-2 bg-background px-2 text-xs font-normal text-foreground',
        className || null,
      )}
      aria-disabled={disabled}
    >
      {showText && <span className={cn('pe-2', classNameText || null)}>{text}</span>}
      {textRequired && isRequired && (
        <span className={cn(isInvalid && 'text-destructive', 'pe-2', classNameTextRequired || null)}>
          {textRequired}
        </span>
      )}
      {isRequired && <span className={cn(isInvalid && 'text-destructive', classNameRequired || null)}>*</span>}
    </Label>
  );
});
