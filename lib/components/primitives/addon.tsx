import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { VariantProps } from 'class-variance-authority';
import { forwardRef, ReactNode } from 'react';

import { OverridableComponent, PolymorphicProps } from '../../lib/polymorphic';
import { cn } from '../../lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { elementsVariants } from './addon.variants';

type Props = {
  children: ReactNode;
  className?: string | undefined;
  classNameHoverContent?: string | undefined;
  classNameTooltipContent?: string | undefined;
  hoverConfig?: Omit<HoverCardProps, 'children'>;
  hoverContent?: ReactNode;
  show?: boolean;
  tooltipConfig?: Omit<TooltipProps, 'children'>;
  tooltipContent?: ReactNode;
  tooltipProviderConfig?: Omit<TooltipProviderProps, 'children'>;
  variant: VariantProps<typeof elementsVariants>;
};

type AddonTypeMap = {
  props: Props;
  defaultComponent: 'div';
};

type AddonProps<Root extends React.ElementType = AddonTypeMap['defaultComponent']> = PolymorphicProps<
  AddonTypeMap,
  Root
>;

export default forwardRef(function Addon(props: AddonProps, ref) {
  const {
    as: Component = 'div',
    children,
    className,
    classNameHoverContent,
    classNameTooltipContent,
    hoverConfig,
    hoverContent,
    show = true,
    tooltipConfig,
    tooltipContent,
    tooltipProviderConfig,
    variant,
    ...moreProps
  } = props;

  if (!show) return null;

  const variants = elementsVariants(variant);

  const coreJsx = (
    <Component
      ref={ref}
      {...moreProps}
      className={cn((tooltipContent || hoverContent) && 'pointer-events-auto', variants, className)}
    >
      {children}
    </Component>
  );

  if (tooltipContent) {
    return (
      <TooltipProvider {...tooltipProviderConfig}>
        <Tooltip {...tooltipConfig}>
          <TooltipTrigger asChild>{coreJsx}</TooltipTrigger>
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
        <HoverCardTrigger asChild>{coreJsx}</HoverCardTrigger>
        <HoverCardContent className={cn('pointer-events-auto w-full', classNameHoverContent || null)}>
          {hoverContent}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return coreJsx;
}) as OverridableComponent<AddonTypeMap>;
