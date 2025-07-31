import { CloseOutline } from '@carbon/icons-react';
import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import React, { forwardRef } from 'react';
import { ReactNode } from 'react';

import { cn } from '../../../lib/utils';
import Addon from '../../primitives/addon';
import { useInputActionsContext, useInputContext } from './context';
import InputAddonSeparator from './input-addon-separator';

interface InputAddonClearProps {
  className?: string | undefined;
  classNameHoverContent?: string | undefined;
  classNameIcon?: string | undefined;
  classNameTooltipContent?: string | undefined;
  hoverConfig?: Omit<HoverCardProps, 'children'>;
  hoverContent?: ReactNode;
  icon?: React.ReactElement | undefined;
  resetToInitialValue?: boolean;
  show?: boolean;
  showAddonSeparatorLeft?: boolean;
  showAddonSeparatorRight?: boolean;
  tooltipConfig?: Omit<TooltipProps, 'children'>;
  tooltipContent?: ReactNode;
  tooltipProviderConfig?: Omit<TooltipProviderProps, 'children'>;
}

export default forwardRef<HTMLButtonElement, InputAddonClearProps>(function InputAddonClear(props, ref) {
  const {
    classNameIcon,
    icon,
    resetToInitialValue = false,
    show = true,
    showAddonSeparatorLeft,
    showAddonSeparatorRight,
    ...moreProps
  } = props;

  const { isInvalid, value } = useInputContext();
  const { onReset, disabled } = useInputActionsContext();

  if (!show || value.length === 0) return null;

  let iconElement: React.ReactElement;

  if (icon) {
    const existingClassName = icon.props.className || '';
    iconElement = React.cloneElement(icon, {
      className: cn('aspect-square h-[clamp(1.13rem,55%,2rem)]', existingClassName, classNameIcon),
    });
  } else {
    iconElement = (
      <CloseOutline
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
        as={'button'}
        ref={ref}
        variant={{ isError: isInvalid, type: 'clear', isDisabled: disabled }}
        {...moreProps}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onReset(resetToInitialValue)}
        aria-disabled={disabled}
      >
        {iconElement}
      </Addon>
      {showAddonSeparatorRight && <InputAddonSeparator />}
    </>
  );
});
