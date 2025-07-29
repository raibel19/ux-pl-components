import AutocompleteGroup from './autocomplete-group';
import AutocompleteHeader from './autocomplete-header';
import AutocompleteHeaderClearButton from './autocomplete-header-clear-button';
import AutocompleteInput from './autocomplete-input';
import AutocompleteInputWrapper from './autocomplete-input-wrapper';
import AutocompleteLabel from './autocomplete-label';
import AutocompleteList from './autocomplete-list';
import AutocompleteListVirtualize from './autocomplete-list-virtualize';
import AutocompleteLoading from './autocomplete-loading';
import AutocompleteMessages from './autocomplete-messages';
import AutocompletePopover from './autocomplete-popover';
import AutocompleteRoot from './autocomplete-root';

type AutocompleteHeaderComponent = typeof AutocompleteHeader & {
  ClearButton: typeof AutocompleteHeaderClearButton;
};

type AutocompleteComponent = typeof AutocompleteRoot & {
  Group: typeof AutocompleteGroup;
  Header: AutocompleteHeaderComponent;
  Input: typeof AutocompleteInput;
  InputWrapper: typeof AutocompleteInputWrapper;
  Label: typeof AutocompleteLabel;
  List: typeof AutocompleteList;
  ListVirtualize: typeof AutocompleteListVirtualize;
  Loading: typeof AutocompleteLoading;
  Messages: typeof AutocompleteMessages;
  Popover: typeof AutocompletePopover;
};

const Header = AutocompleteHeader as AutocompleteHeaderComponent;
Header.ClearButton = AutocompleteHeaderClearButton;

const Autocomplete = AutocompleteRoot as AutocompleteComponent;
Autocomplete.Group = AutocompleteGroup;
Autocomplete.Header = Header;
Autocomplete.Input = AutocompleteInput;
Autocomplete.InputWrapper = AutocompleteInputWrapper;
Autocomplete.Label = AutocompleteLabel;
Autocomplete.List = AutocompleteList;
Autocomplete.ListVirtualize = AutocompleteListVirtualize;
Autocomplete.Loading = AutocompleteLoading;
Autocomplete.Messages = AutocompleteMessages;
Autocomplete.Popover = AutocompletePopover;

export { Autocomplete };
