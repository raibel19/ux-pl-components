import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { forwardRef, ReactNode } from 'react';

import Addon from '../../primitives/addon';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

interface AutocompleteAddonTextProps {
  className?: string | undefined;
  classNameHoverContent?: string | undefined;
  classNameTooltipContent?: string | undefined;
  hoverConfig?: Omit<HoverCardProps, 'children'>;
  hoverContent?: ReactNode;
  show?: boolean;
  text: string;
  tooltipConfig?: Omit<TooltipProps, 'children'>;
  tooltipContent?: ReactNode;
  tooltipProviderConfig?: Omit<TooltipProviderProps, 'children'>;
}

export default forwardRef<HTMLSpanElement, AutocompleteAddonTextProps>(function AutocompleteAddonText(props, ref) {
  const { show = true, text, ...moreProps } = props;

  const { isInvalid } = useAutocompleteContext();
  const { disabled } = useAutocompleteActionsContext();

  if (!show) return null;

  return (
    <Addon
      as={'span'}
      ref={ref}
      variant={{ isError: isInvalid, type: 'text', isDisabled: disabled }}
      {...moreProps}
      onMouseDown={(e) => e.preventDefault()}
      aria-disabled={disabled}
    >
      {text}
    </Addon>
  );
});
