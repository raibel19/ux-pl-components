import { Search } from '@carbon/icons-react';
import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';
import React from 'react';

import { cn } from '../../lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useInputContext } from './context';
import { InputChangePayload } from './types/types';
import { elementsVariants } from './variants/input-addon.variants';

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

export default function InputAddonButton(props: InputAddonButtonProps) {
  const {
    className,
    classNameHoverContent,
    classNameIcon,
    classNameTooltipContent,
    hoverConfig,
    hoverContent,
    icon,
    onClick,
    show = true,
    text,
    tooltipConfig,
    tooltipContent,
    tooltipProviderConfig,
  } = props;

  const { isInvalid, value, data, initialValueRef } = useInputContext();

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

  const variants = elementsVariants({
    disable: false,
    isError: isInvalid,
    type: 'button',
  });

  const coreButtonJsx = (
    <button
      className={cn(variants, className || null)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onClick?.({ data, value, initialValue: initialValueRef.current })}
    >
      {text ?? iconElement}
    </button>
  );

  if (tooltipContent) {
    return (
      <TooltipProvider {...tooltipProviderConfig}>
        <Tooltip {...tooltipConfig}>
          <TooltipTrigger asChild className="pointer-events-auto">
            {coreButtonJsx}
          </TooltipTrigger>
          <TooltipContent className={cn('pointer-events-auto', classNameTooltipContent)}>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hoverContent) {
    return (
      <HoverCard {...hoverConfig}>
        <HoverCardTrigger asChild className="pointer-events-auto">
          {coreButtonJsx}
        </HoverCardTrigger>
        <HoverCardContent className={cn('pointer-events-auto w-full', classNameHoverContent || null)}>
          {hoverContent}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return coreButtonJsx;
}
