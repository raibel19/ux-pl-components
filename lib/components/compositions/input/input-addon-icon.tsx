import { Search } from '@carbon/icons-react';
import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { forwardRef, ReactNode } from 'react';
import React from 'react';

import { cn } from '../../../lib/utils';
import Addon from '../../primitives/addon';
import { useInputActionsContext, useInputContext } from './context';

interface InputAddonIconProps {
  className?: string | undefined;
  classNameHoverContent?: string | undefined;
  classNameIcon?: string | undefined;
  classNameTooltipContent?: string | undefined;
  hoverConfig?: Omit<HoverCardProps, 'children'>;
  hoverContent?: ReactNode;
  icon?: React.ReactElement | undefined;
  show?: boolean;
  tooltipConfig?: Omit<TooltipProps, 'children'>;
  tooltipContent?: ReactNode;
  tooltipProviderConfig?: Omit<TooltipProviderProps, 'children'>;
}

export default forwardRef<HTMLDivElement, InputAddonIconProps>(function InputAddonIcon(props, ref) {
  const { classNameIcon, icon, show = true, ...moreProps } = props;

  const { isInvalid } = useInputContext();
  const { disabled } = useInputActionsContext();

  if (!show) return null;

  let iconElement: React.ReactElement;

  if (icon) {
    const existingClassName = icon.props.className || '';
    iconElement = React.cloneElement(icon, {
      className: cn('aspect-square h-[clamp(1.13rem,55%,2rem)]', existingClassName, classNameIcon),
    });
  } else {
    iconElement = (
      <Search
        size={18}
        strokeWidth={2}
        aria-hidden="true"
        className={cn('aspect-square h-[clamp(1.13rem,55%,2rem)]', classNameIcon)}
      />
    );
  }

  return (
    <Addon
      as={'div'}
      ref={ref}
      variant={{ isError: isInvalid, type: 'icon', isDisabled: disabled }}
      {...moreProps}
      onMouseDown={(e) => e.preventDefault()}
      aria-disabled={disabled}
    >
      {iconElement}
    </Addon>
  );
});
