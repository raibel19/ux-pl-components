import { ComponentPropsWithoutRef, forwardRef, ReactNode, useEffect } from 'react';

import { cn } from '../../../lib/utils';
import { CommandList } from '../../ui/command';
import { PopoverContent } from '../../ui/popover';
import autocompleteStyle from './autocomplete.module.css';
import { useAutocompleteActionsContext } from './context';
import useTheme from './hooks/use-theme';

interface AutocompletePopoverProps extends ComponentPropsWithoutRef<typeof PopoverContent> {
  children: ReactNode;
  className?: string;
}

export default forwardRef<HTMLDivElement, AutocompletePopoverProps>(function AutocompletePopover(props, ref) {
  const { children, className, ...moreProps } = props;

  const { theme } = useAutocompleteActionsContext();
  const { themeCore, themeStyle } = useTheme({ style: autocompleteStyle, theme });

  useEffect(() => {
    console.log('Component-AutocompletePopover');
  }, []);

  return (
    <PopoverContent
      ref={ref}
      {...moreProps}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={(e) => {
        if (e.target instanceof Element && e.target.hasAttribute('cmdk-input')) {
          e.preventDefault();
        }
      }}
      className={cn(themeCore, themeStyle, 'w-[--radix-popover-trigger-width] p-0', className || null)}
    >
      <CommandList>{children}</CommandList>
    </PopoverContent>
  );
});
