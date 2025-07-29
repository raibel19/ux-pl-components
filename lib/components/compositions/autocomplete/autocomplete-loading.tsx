import { Command as CommandPrimitive } from 'cmdk';
import { Loader2 } from 'lucide-react';
import { ComponentPropsWithoutRef, forwardRef, ReactNode, useEffect } from 'react';

import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

interface AutocompleteLoadingProps extends ComponentPropsWithoutRef<typeof CommandPrimitive.Loading> {
  children?: ReactNode;
  showText?: boolean;
  text?: string;
}

export default forwardRef<HTMLDivElement, AutocompleteLoadingProps>(function AutocompleteLoading(props, ref) {
  const { children, showText = true, text = 'Fetching data…', ...moreProps } = props;

  const { isLoading, inputValue, isSearching } = useAutocompleteContext();
  const { minLengthRequired, setIsLoadingMounted } = useAutocompleteActionsContext();

  useEffect(() => {
    console.log('Component-AutocompleteLoading');
    setIsLoadingMounted(true);
    return () => setIsLoadingMounted(false);
  }, [setIsLoadingMounted]);

  if ((!isLoading && !isSearching) || inputValue.length < minLengthRequired) return null;

  return (
    <CommandPrimitive.Loading ref={ref} {...moreProps}>
      {children ?? (
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 size={20} className="animate-spin" />
          {showText && <p className="text-center text-sm">{text}</p>}
        </div>
      )}
    </CommandPrimitive.Loading>
  );
});
