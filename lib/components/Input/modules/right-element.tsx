'use client';
import { CloseOutline, Warning } from '@carbon/icons-react';
import { VariantProps } from 'class-variance-authority';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { equals } from 'ux-pl/utils/object';
import { genericMemo } from 'ux-pl/utils/react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

import { elementsVariants } from '../helpers/variants';
import { IElement } from '../interfaces/input';
import { IRightElementItemsProps, IRightElementProps } from '../interfaces/internals';
import Counter from './counter';
import Elements from './elements';
import Separator from './separator';

const RightElementItem = genericMemo(
  function RightElementItem<Data>(props: IRightElementItemsProps<Data>) {
    const {
      disable,
      existLastElement,
      identifier,
      idx,
      item,
      length,
      responseEventData,
      showError,
      showNumericValidationErrors,
    } = props;
    const { show, separator } = item;

    useEffect(() => {
      console.log('Component-RightElementItem', { id: item.id, type: item.type });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        key={`containerElement-${identifier}`}
        className={cn('flex h-full items-center', !existLastElement && length === idx + 1 ? 'rounded-e-md' : null)}
      >
        <Elements
          key={`element-${identifier}`}
          disable={disable}
          element={item}
          isLastElement={!existLastElement && length === idx + 1}
          position="right"
          responseEventData={responseEventData}
          showError={showError}
          showNumericValidationErrors={showNumericValidationErrors}
        />
        <Separator
          key={`separator-${identifier}`}
          isError={showError || showNumericValidationErrors}
          isLastElement={!existLastElement && length === idx + 1}
          show={separator && show}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return equals(prevProps, nextProps);
  },
);

export default function RightElement<Data>(props: IRightElementProps<Data>) {
  const { disable, element, maxLength, responseEventData, setReset, setWidth, showError, showNumericValidationErrors } =
    props;

  const { clear, counter, error, elements } = element || {};

  const {
    show: showClear,
    className: classNameClear,
    classNameHoverContent: classNameHoverContentClear,
    classNameIcon: classNameIconClear,
    classNameTooltipContent: classNameTooltipContentClear,
    hoverContent: hoverContentClear,
    icon: iconClear,
    separator: separatorClear,
    tooltipContent: tooltipContentClear,
  } = clear || {};

  const {
    show: showCounter,
    className: classNameCounter,
    classNameInfinityIcon: classNameInfinityIconCounter,
    separator: separatorCounter,
  } = counter || {};

  const {
    show: showErrorElement,
    className: classNameError,
    classNameHoverContent: classNameHoverContentError,
    classNameIcon: classNameIconError,
    classNameTooltipContent: classNameTooltipContentError,
    hoverContent: hoverContentError,
    icon: iconError,
    tooltipContent: tooltipContentError,
  } = error || {};

  const divRef = useRef<HTMLDivElement | null>(null);

  const elementsTransform = useMemo(
    () =>
      elements?.map<IElement<Data> & { identifier: string }>((item) => ({
        ...item,
        identifier: `${item.id}_${item.type}`,
      })),
    [elements],
  );

  const existLastElement = useMemo(() => {
    const clearIsShow =
      showClear === true ? responseEventData.value !== undefined && responseEventData.value !== '' : false;
    const errorIsShow = showErrorElement === true ? showError || showNumericValidationErrors : false;

    return clearIsShow || errorIsShow;
  }, [responseEventData.value, showClear, showError, showErrorElement, showNumericValidationErrors]);

  const existLastElementForCounter = useMemo(() => {
    const existElements = elements?.some((s) => s.show) || false;
    return existLastElement || existElements;
  }, [elements, existLastElement]);

  const modelVariants = useMemo((): VariantProps<typeof elementsVariants> => {
    const errorIsShow = showErrorElement === true ? showError || showNumericValidationErrors : false;

    return {
      show: responseEventData.value === undefined || responseEventData.value === '' ? false : true,
      isError: showError || showNumericValidationErrors,
      type: 'clear',
      disable: disable || false,
      position: 'right',
      isLastElement: !errorIsShow,
    };
  }, [disable, responseEventData.value, showError, showErrorElement, showNumericValidationErrors]);

  const errorModelVariants = useMemo(
    (): VariantProps<typeof elementsVariants> => ({
      show: true,
      isError: true,
      type: 'icon',
      disable: false,
      position: 'right',
      isLastElement: true,
    }),
    [],
  );

  const renderCounter = useCallback(() => {
    const counterJsx = (
      <div className={cn('flex h-full items-center', !existLastElementForCounter ? 'rounded-e-md' : null)}>
        <Counter
          classNameCounterContainer={classNameCounter}
          classNameCounterInfinityIcon={classNameInfinityIconCounter}
          maxLength={maxLength}
          showError={showError}
          showNumericValidationErrors={showNumericValidationErrors}
          value={responseEventData.value}
          isLastElement={!existLastElementForCounter}
        />
        <Separator
          isError={showError || showNumericValidationErrors}
          isLastElement={!existLastElementForCounter}
          show={separatorCounter}
        />
      </div>
    );

    return counterJsx;
  }, [
    classNameCounter,
    classNameInfinityIconCounter,
    existLastElementForCounter,
    maxLength,
    responseEventData.value,
    separatorCounter,
    showError,
    showNumericValidationErrors,
  ]);

  const renderClear = useCallback(() => {
    const iconDefault = <CloseOutline size={18} strokeWidth={2} aria-hidden="true" className={classNameIconClear} />;
    const icon = iconClear || iconDefault;

    const clearJsx = (
      <div className={cn('flex h-full items-center', modelVariants.isLastElement || false ? 'rounded-e-md' : null)}>
        <button
          className={cn(elementsVariants(modelVariants), classNameClear || null)}
          aria-label="Clear input"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setReset?.(true);
          }}
        >
          {icon}
        </button>
        <Separator
          isError={modelVariants.isError || false}
          isLastElement={modelVariants.isLastElement || false}
          show={separatorClear && responseEventData.value !== undefined && responseEventData.value !== ''}
        />
      </div>
    );

    if (hoverContentClear) {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>{clearJsx}</HoverCardTrigger>
          <HoverCardContent className={cn('w-80', classNameHoverContentClear || null)}>
            {hoverContentClear}
          </HoverCardContent>
        </HoverCard>
      );
    }

    if (tooltipContentClear) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{clearJsx}</TooltipTrigger>
            <TooltipContent className={classNameTooltipContentClear}>{tooltipContentClear}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return clearJsx;
  }, [
    classNameClear,
    classNameHoverContentClear,
    classNameIconClear,
    classNameTooltipContentClear,
    hoverContentClear,
    iconClear,
    modelVariants,
    responseEventData.value,
    separatorClear,
    setReset,
    tooltipContentClear,
  ]);

  const renderError = useCallback(() => {
    const iconDefault = <Warning size={18} strokeWidth={2} aria-hidden={true} className={classNameIconError} />;
    const icon = iconError || iconDefault;

    const errorJsx = (
      <div className={cn(elementsVariants(errorModelVariants), 'pointer-events-auto', classNameError || null)}>
        {icon}
      </div>
    );

    if (hoverContentError) {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>{errorJsx}</HoverCardTrigger>
          <HoverCardContent className={cn('w-80', classNameHoverContentError || null)}>
            {hoverContentError}
          </HoverCardContent>
        </HoverCard>
      );
    }

    if (tooltipContentError) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{errorJsx}</TooltipTrigger>
            <TooltipContent className={classNameTooltipContentError}>{tooltipContentError}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div className={cn(elementsVariants(errorModelVariants), classNameError || null)}>{icon}</div>;
  }, [
    classNameError,
    classNameHoverContentError,
    classNameIconError,
    classNameTooltipContentError,
    errorModelVariants,
    hoverContentError,
    iconError,
    tooltipContentError,
  ]);

  useEffect(
    () => {
      if (divRef.current) {
        const divWidth = divRef.current.offsetWidth;
        setWidth(`${divWidth + 7}px`, 'right');
      }
    },
    // Aunque no se use props dentro del useeffect este debería de ir en las dependencias ya que el valor del state debería de cambiar cada que cambie.
    [setWidth, props],
  );

  useEffect(() => {
    console.log('Component-RightElement');
  }, []);

  return (
    <div ref={divRef} className={'pointer-events-none absolute inset-y-0 end-0 flex items-center'}>
      {showCounter && renderCounter()}
      {elementsTransform?.map((item, idx) => (
        <RightElementItem
          key={item.identifier}
          disable={disable}
          existLastElement={existLastElement}
          identifier={item.identifier}
          idx={idx}
          item={item}
          length={elementsTransform.length}
          responseEventData={responseEventData}
          showError={showError}
          showNumericValidationErrors={showNumericValidationErrors}
        />
      ))}
      {showClear && !disable && renderClear()}
      {showErrorElement && (showError || showNumericValidationErrors) && renderError()}
    </div>
  );
}
