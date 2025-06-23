import { Warning } from '@carbon/icons-react';
import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import React, { forwardRef } from 'react';
import { ReactNode } from 'react';

import { cn } from '../../../lib/utils';
import Addon from '../../primitives/addon';
import { useInputContext } from './context';
import InputAddonSeparator from './input-addon-separator';

interface InputAddonErrorProps {
  className?: string | undefined;
  classNameHoverContent?: string | undefined;
  classNameIcon?: string | undefined;
  classNameTooltipContent?: string | undefined;
  hoverConfig?: Omit<HoverCardProps, 'children'>;
  hoverContent?: ReactNode;
  icon?: React.ReactElement | undefined;
  show?: boolean;
  showAddonSeparatorLeft?: boolean;
  showAddonSeparatorRight?: boolean;
  tooltipConfig?: Omit<TooltipProps, 'children'>;
  tooltipContent?: ReactNode;
  tooltipProviderConfig?: Omit<TooltipProviderProps, 'children'>;
}

export default forwardRef<HTMLDivElement, InputAddonErrorProps>(function InputAddonError(props, ref) {
  const { classNameIcon, icon, show = true, showAddonSeparatorLeft, showAddonSeparatorRight, ...moreProps } = props;

  const { isInvalid, disabled } = useInputContext();

  if (!show || !isInvalid) return null;

  let iconElement: React.ReactElement;

  if (icon) {
    const existingClassName = icon.props.className || '';
    iconElement = React.cloneElement(icon, {
      className: cn('aspect-square h-[clamp(1.13rem,55%,2rem)]', existingClassName, classNameIcon),
    });
  } else {
    iconElement = (
      <Warning
        size={18}
        strokeWidth={2}
        aria-hidden="true"
        className={cn('aspect-square h-[clamp(1.13rem,55%,2rem)]', classNameIcon)}
      />
    );
  }

  return (
    <>
      {showAddonSeparatorLeft && <InputAddonSeparator />}
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
      {showAddonSeparatorRight && <InputAddonSeparator />}
    </>
  );
});
