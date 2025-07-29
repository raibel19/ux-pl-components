import { forwardRef, useEffect } from 'react';

import { cn } from '../../../lib/utils';
import Label from '../../primitives/label';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

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

export default forwardRef<HTMLLabelElement, InputLabelProps>(function AutocompleteLabel(props, ref) {
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
  const { isInvalid } = useAutocompleteContext();
  const { id, disabled } = useAutocompleteActionsContext();

  useEffect(() => {
    console.log('Component-AutocompleteLabel');
  }, [props]);

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
      {showText && <span className={cn(classNameText || null)}>{text}</span>}
      {textRequired && isRequired && (
        <span className={cn(isInvalid && 'text-destructive', classNameTextRequired || null)}>{textRequired}</span>
      )}
      {isRequired && <span className={cn(isInvalid && 'text-destructive', classNameRequired || null)}>*</span>}
    </Label>
  );
});
