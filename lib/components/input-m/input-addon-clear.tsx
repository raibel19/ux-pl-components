import { CloseOutline } from '@carbon/icons-react';
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

export default function InputAddonClear(props: InputAddonClearProps) {
  const {
    className,
    classNameHoverContent,
    classNameIcon,
    classNameTooltipContent,
    hoverConfig,
    hoverContent,
    icon,
    resetToInitialValue = false,
    show = true,
    tooltipConfig,
    tooltipContent,
    tooltipProviderConfig,
    showAddonSeparatorLeft,
    showAddonSeparatorRight,
  } = props;

  const { isInvalid, onReset, value } = useInputContext();

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

  const variants = elementsVariants({
    disable: false,
    isError: isInvalid,
    type: 'clear',
  });

  const coreClearJsx = (
    <button
      className={cn(variants, className || null)}
      aria-label="Clear"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onReset(resetToInitialValue)}
    >
      {iconElement}
    </button>
  );

  let element = coreClearJsx;

  if (tooltipContent) {
    element = (
      <TooltipProvider {...tooltipProviderConfig}>
        <Tooltip {...tooltipConfig}>
          <TooltipTrigger asChild className="pointer-events-auto">
            {coreClearJsx}
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
          {coreClearJsx}
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
