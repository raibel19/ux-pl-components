import { Search } from '@carbon/icons-react';
import { HoverCardProps } from '@radix-ui/react-hover-card';
import { TooltipProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import { ForwardedRef, forwardRef, ReactNode, useCallback } from 'react';
import React from 'react';

import { cn } from '../../../lib/utils';
import Addon from '../../primitives/addon';
import { useAutocompleteStableContext, useAutocompleteVolatileContext } from './context';
import { AutocompleteStateChangePayload } from './types/types';

export interface AutocompleteAddonButtonProps<Data = undefined> {
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
  onClick?: (payload: Omit<AutocompleteStateChangePayload<Data>, 'type'>) => void;
}

export default forwardRef(function AutocompleteAddonButton<Data = undefined>(
  props: AutocompleteAddonButtonProps<Data>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { classNameIcon, icon, onClick, show = true, text, ...moreProps } = props;

  const { isInvalid, initialValueRef, lastValidSelection, data, disabled } = useAutocompleteStableContext<Data>();
  const { inputValue } = useAutocompleteVolatileContext();

  const onClickHandler = useCallback(() => {
    onClick?.({
      data: data as Data,
      initialValue: initialValueRef.current,
      inputValue,
      selectedValue: lastValidSelection?.value ?? '',
    });
  }, [data, initialValueRef, inputValue, lastValidSelection?.value, onClick]);

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
      onClick={onClickHandler}
      aria-disabled={disabled}
    >
      {text ?? iconElement}
    </Addon>
  );
}) as <Data = undefined>(
  props: AutocompleteAddonButtonProps<Data> & { ref?: ForwardedRef<HTMLButtonElement> },
) => React.JSX.Element;
