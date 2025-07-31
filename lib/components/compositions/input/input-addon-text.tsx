import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { forwardRef, ReactNode } from 'react';

import Addon from '../../primitives/addon';
import { useInputActionsContext, useInputContext } from './context';

interface InputAddonTextProps {
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

export default forwardRef<HTMLSpanElement, InputAddonTextProps>(function InputAddonText(props, ref) {
  const { show = true, text, ...moreProps } = props;

  const { isInvalid } = useInputContext();
  const { disabled } = useInputActionsContext();

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
