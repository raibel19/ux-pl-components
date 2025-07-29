import { forwardRef } from 'react';

import { cn } from '../../../lib/utils';
import { CommandEmpty } from '../../ui/command';
import { useAutocompleteActionsContext, useAutocompleteContext } from './context';

interface AutocompleteMessagesProps {
  className?: string;
  initialMessage?: string;
  noResultMessage?: string;
  minLengthMessage?: string;
  loadingMessage?: string;
}

export default forwardRef<HTMLDivElement, AutocompleteMessagesProps>(function AutocompleteMessages(props, ref) {
  const {
    className,
    initialMessage = 'Escriba para mostrar sugerencias',
    minLengthMessage = 'Escriba almenos {minLength} carácteres',
    noResultMessage = 'No existen sugerencias',
    loadingMessage = 'Fetching data…',
  } = props;

  const { isLoading, inputValue, filteredItems, isSearching } = useAutocompleteContext();
  const { minLengthRequired, isLoadingMounted } = useAutocompleteActionsContext();
  const valueLength = inputValue.length;

  if ((isLoading || isSearching) && valueLength >= minLengthRequired && isLoadingMounted) {
    return null;
  }

  let message: string = '';
  let isEmpty: boolean = false;

  if ((isLoading || isSearching) && valueLength >= minLengthRequired && !isLoadingMounted) {
    message = loadingMessage;
  } else if (valueLength === 0 && filteredItems.size === 0) {
    message = initialMessage;
  } else if (valueLength < minLengthRequired) {
    message = minLengthMessage.replace('{minLength}', String(minLengthRequired));
  } else if (valueLength >= minLengthRequired && filteredItems.size === 0) {
    message = noResultMessage;
    isEmpty = true;
  } else if (filteredItems.size === 0) {
    message = noResultMessage;
    isEmpty = true;
  } else {
    return null;
  }

  const Component = isEmpty ? CommandEmpty : 'div';

  return (
    <Component
      ref={ref}
      className={cn('py-6 text-center text-sm', className || null)}
      onMouseDown={(e) => e.preventDefault()}
    >
      {message}
    </Component>
  );
});
