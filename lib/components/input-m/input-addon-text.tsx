import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useInputContext } from './context';
import { elementsVariants } from './variants/input-addon.variants';

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

export default function InputAddonText(props: InputAddonTextProps) {
  const {
    className,
    classNameHoverContent,
    classNameTooltipContent,
    hoverConfig,
    hoverContent,
    show = true,
    text,
    tooltipConfig,
    tooltipContent,
    tooltipProviderConfig,
  } = props;

  const { isInvalid } = useInputContext();

  if (!show) return null;

  const variants = elementsVariants({
    disable: false,
    isError: isInvalid,
    type: 'text',
  });

  const coreTextJsx = <span className={cn(variants, className || null)}>{text}</span>;

  if (tooltipContent) {
    return (
      <TooltipProvider {...tooltipProviderConfig}>
        <Tooltip {...tooltipConfig}>
          <TooltipTrigger asChild className="pointer-events-auto">
            {coreTextJsx}
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
          {coreTextJsx}
        </HoverCardTrigger>
        <HoverCardContent className={cn('pointer-events-auto w-full', classNameHoverContent || null)}>
          {hoverContent}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return coreTextJsx;
}
