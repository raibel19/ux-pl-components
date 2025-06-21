import { Warning } from '@carbon/icons-react';
import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import React from 'react';
import { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useInputContext } from './context';
import InputAddonSeparator from './input-addon-separator';
import { elementsVariants } from './variants/input-addon.variants';

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

export default function InputAddonError(props: InputAddonErrorProps) {
  const {
    className,
    classNameHoverContent,
    classNameIcon,
    classNameTooltipContent,
    hoverConfig,
    hoverContent,
    icon,
    show = true,
    tooltipConfig,
    tooltipContent,
    tooltipProviderConfig,
    showAddonSeparatorLeft,
    showAddonSeparatorRight,
  } = props;

  const { isInvalid } = useInputContext();

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

  const variants = elementsVariants({
    disable: false,
    isError: isInvalid,
    type: 'icon',
  });

  const coreErrorJsx = (
    <div className={cn(variants, className || null)} onMouseDown={(e) => e.preventDefault()}>
      {iconElement}
    </div>
  );

  let element = coreErrorJsx;

  if (tooltipContent) {
    element = (
      <TooltipProvider {...tooltipProviderConfig}>
        <Tooltip {...tooltipConfig}>
          <TooltipTrigger asChild className="pointer-events-auto">
            {coreErrorJsx}
          </TooltipTrigger>
          <TooltipContent className={cn('pointer-events-auto', classNameTooltipContent)}>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hoverContent) {
    element = (
      <HoverCard {...hoverConfig}>
        <HoverCardTrigger asChild className="pointer-events-auto">
          {coreErrorJsx}
        </HoverCardTrigger>
        <HoverCardContent className={cn('pointer-events-auto w-full', classNameHoverContent || null)}>
          {hoverContent}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <>
      {showAddonSeparatorLeft && <InputAddonSeparator />}
      {element}
      {showAddonSeparatorRight && <InputAddonSeparator />}
    </>
  );
}
