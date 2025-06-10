import { IbmDb2, Search } from '@carbon/icons-react';
import { VariantProps } from 'class-variance-authority';
import { useEffect, useMemo } from 'react';
import React from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

import { elementsVariants } from '../helpers/variants';
import { IElementsProps } from '../interfaces/internals';

export default function Elements<Data>(props: IElementsProps<Data>) {
  const { disable, element, showError, showNumericValidationErrors, position, isLastElement, responseEventData } =
    props;
  const {
    className,
    classNameIcon,
    icon,
    onClick,
    renderContainer,
    show,
    text,
    type,
    hoverContent,
    classNameHoverContent,
    tooltipContent,
    classNameTooltipContent,
  } = element || {};

  const elementIcon = useMemo(() => {
    let iconJSX =
      position === 'left' ? (
        <Search
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className={cn('h-[clamp(1.13rem,55%,2rem)] w-[clamp(1.13rem,55%,2rem)]', classNameIcon)}
        />
      ) : (
        <IbmDb2
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className={cn('h-[clamp(1.13rem,55%,2rem)] w-[clamp(1.13rem,55%,2rem)]', classNameIcon)}
        />
      );

    if (icon) {
      const existingClassName = icon.props.className || '';
      iconJSX = React.cloneElement(icon, {
        className: cn('h-[clamp(1.13rem,55%,2rem)] w-[clamp(1.13rem,55%,2rem)]', existingClassName, classNameIcon),
      });
    }

    return iconJSX;
  }, [classNameIcon, icon, position]);

  const modelVariants = useMemo(
    (): VariantProps<typeof elementsVariants> => ({
      show,
      isError: showError || showNumericValidationErrors,
      type,
      disable: disable || false,
      position,
      isLastElement,
    }),
    [disable, isLastElement, position, show, showError, showNumericValidationErrors, type],
  );

  const renderButton = useMemo(() => {
    const buttonJsx = (
      <button
        className={cn(elementsVariants(modelVariants), className || null)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onClick?.({ item: responseEventData })}
      >
        {elementIcon}
      </button>
    );

    if (hoverContent) {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>{buttonJsx}</HoverCardTrigger>
          <HoverCardContent className={cn('w-80', classNameHoverContent || null)}>{hoverContent}</HoverCardContent>
        </HoverCard>
      );
    }

    if (tooltipContent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonJsx}</TooltipTrigger>
            <TooltipContent className={classNameTooltipContent}>{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonJsx;
  }, [
    className,
    classNameHoverContent,
    classNameTooltipContent,
    elementIcon,
    hoverContent,
    modelVariants,
    onClick,
    responseEventData,
    tooltipContent,
  ]);

  const renderIcon = useMemo(() => {
    const isDisabled = modelVariants.disable || false;
    const iconJsx = (
      <div
        className={cn(elementsVariants(modelVariants), !isDisabled && 'pointer-events-auto', className || null)}
        onMouseDown={(e) => e.preventDefault()}
      >
        {elementIcon}
      </div>
    );

    if (hoverContent) {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>{iconJsx}</HoverCardTrigger>
          <HoverCardContent className={cn('w-80', classNameHoverContent || null)}>{hoverContent}</HoverCardContent>
        </HoverCard>
      );
    }

    if (tooltipContent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{iconJsx}</TooltipTrigger>
            <TooltipContent className={classNameTooltipContent}>{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div className={cn(elementsVariants(modelVariants), className || null)}>{elementIcon}</div>;
  }, [
    className,
    classNameHoverContent,
    classNameTooltipContent,
    elementIcon,
    hoverContent,
    modelVariants,
    tooltipContent,
  ]);

  const renderText = useMemo(() => {
    const isDisabled = modelVariants.disable || false;
    const textJsx = (
      <span className={cn(elementsVariants(modelVariants), !isDisabled && 'pointer-events-auto', className || null)}>
        {text}
      </span>
    );

    if (hoverContent) {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>{textJsx}</HoverCardTrigger>
          <HoverCardContent className={cn('w-80', classNameHoverContent || null)}>{hoverContent}</HoverCardContent>
        </HoverCard>
      );
    }

    if (tooltipContent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{textJsx}</TooltipTrigger>
            <TooltipContent className={classNameTooltipContent}>{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <span className={cn(elementsVariants(modelVariants), className || null)}>{text}</span>;
  }, [className, classNameHoverContent, classNameTooltipContent, hoverContent, modelVariants, text, tooltipContent]);

  useEffect(() => {
    console.log('Component-Elements');
  }, []);

  return (
    <>
      {renderContainer && renderContainer(elementIcon)}
      {type === 'button' && renderButton}
      {type === 'icon' && renderIcon}
      {type === 'text' && renderText}
    </>
  );
}
