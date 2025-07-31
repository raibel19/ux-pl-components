import { Search } from '@carbon/icons-react';
import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { forwardRef, ReactNode } from 'react';
import React from 'react';

import { cn } from '../../../lib/utils';
import Addon from '../../primitives/addon';
import { useInputActionsContext, useInputContext } from './context';
import { InputChangePayload } from './types/types';

interface InputAddonButtonProps {
  className?: string | undefined;
  classNameHoverContent?: string | undefined;
  classNameIcon?: string | undefined;
  classNameTooltipContent?: string | undefined;
  hoverConfig?: Omit<HoverCardProps, 'children'>;
  hoverContent?: ReactNode;
  icon?: React.ReactElement | undefined;
  show?: boolean;
  text?: string;
  tooltipConfig?: Omit<TooltipProps, 'children'>;
  tooltipContent?: ReactNode;
  tooltipProviderConfig?: Omit<TooltipProviderProps, 'children'>;
  onClick?: (_: InputChangePayload<unknown>) => void;
}

export default forwardRef<HTMLButtonElement, InputAddonButtonProps>(function InputAddonButton(props, ref) {
  const { classNameIcon, icon, onClick, show = true, text, ...moreProps } = props;

  const { isInvalid, value, initialValueRef } = useInputContext();
  const { data, disabled } = useInputActionsContext();

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
      as={'button'}
      ref={ref}
      variant={{ isError: isInvalid, type: 'button', isDisabled: disabled }}
      {...moreProps}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onClick?.({ data, value, initialValue: initialValueRef.current })}
      aria-disabled={disabled}
    >
      {text ?? iconElement}
    </Addon>
  );
});
