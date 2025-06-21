import { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { useInputContext } from './context';
import { labelVariants } from './variants/input-label.variants';

interface InputLabelProps {
  classNameLabel?: string | undefined;
  showRequired?: boolean;
  showTextLabel?: boolean;
  showTextRequired?: boolean;
  textLabel?: string;
  textRequired?: string;
}

export default function InputLabel(props: InputLabelProps) {
  const { showRequired, showTextLabel, showTextRequired, textLabel, textRequired, classNameLabel } = props;
  const { isInvalid, id } = useInputContext();

  useEffect(() => {
    console.log('Component-InputLabel');
  }, [props]);

  return (
    <Label
      className={cn(
        labelVariants({ show: showTextLabel || showRequired || showTextRequired, gradient: true }),
        classNameLabel || null,
      )}
      htmlFor={id}
    >
      {showTextLabel && `${textLabel} `}
      {(showRequired || showTextRequired) && (
        <span className={cn(isInvalid ? 'text-destructive' : null)}>
          {showTextRequired && `${textRequired} `}
          {showRequired && '*'}
        </span>
      )}
    </Label>
  );
}
