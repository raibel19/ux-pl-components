import AutocompleteAddonButton from './autocomplete-addon-button';
import AutocompleteAddonError from './autocomplete-addon-error';
import AutocompleteAddonIcon from './autocomplete-addon-icon';
import AutocompleteAddonSeparator from './autocomplete-addon-separator';
import AutocompleteAddonText from './autocomplete-addon-text';
import AutocompleteErrors from './autocomplete-errors';
import AutocompleteGroup from './autocomplete-group';
import AutocompleteHeader from './autocomplete-header';
import AutocompleteHeaderClearButton from './autocomplete-header-clear-button';
import AutocompleteInput from './autocomplete-input';
import AutocompleteInputWrapper from './autocomplete-input-wrapper';
import AutocompleteLabel from './autocomplete-label';
import AutocompleteLeftAddon from './autocomplete-left-addon';
import AutocompleteList from './autocomplete-list';
import AutocompleteListVirtualize from './autocomplete-list-virtualize';
import AutocompleteLoading from './autocomplete-loading';
import AutocompleteMessages from './autocomplete-messages';
import AutocompletePopover from './autocomplete-popover';
import AutocompleteRightAddon from './autocomplete-right-addon';
import AutocompleteRoot from './autocomplete-root';

type AutocompleteHeaderComponent = typeof AutocompleteHeader & {
  ClearButton: typeof AutocompleteHeaderClearButton;
};

type AutocompleteAddonsComponent = {
  Button: typeof AutocompleteAddonButton;
  Separator: typeof AutocompleteAddonSeparator;
  Error: typeof AutocompleteAddonError;
  Icon: typeof AutocompleteAddonIcon;
  Text: typeof AutocompleteAddonText;
};

type AutocompleteComponent = typeof AutocompleteRoot & {
  Addons: AutocompleteAddonsComponent;
  Group: typeof AutocompleteGroup;
  Header: AutocompleteHeaderComponent;
  Input: typeof AutocompleteInput;
  InputWrapper: typeof AutocompleteInputWrapper;
  Label: typeof AutocompleteLabel;
  LeftAddons: typeof AutocompleteLeftAddon;
  List: typeof AutocompleteList;
  ListVirtualize: typeof AutocompleteListVirtualize;
  Loading: typeof AutocompleteLoading;
  Messages: typeof AutocompleteMessages;
  Popover: typeof AutocompletePopover;
  RightAddons: typeof AutocompleteRightAddon;
  Errors: typeof AutocompleteErrors;
};

const Header = AutocompleteHeader as AutocompleteHeaderComponent;
Header.ClearButton = AutocompleteHeaderClearButton;

const Addons = {} as AutocompleteAddonsComponent;
Addons.Button = AutocompleteAddonButton;
Addons.Error = AutocompleteAddonError;
Addons.Separator = AutocompleteAddonSeparator;
Addons.Icon = AutocompleteAddonIcon;
Addons.Text = AutocompleteAddonText;

const Autocomplete = AutocompleteRoot as AutocompleteComponent;
Autocomplete.Addons = Addons;
Autocomplete.Group = AutocompleteGroup;
Autocomplete.Header = Header;
Autocomplete.Input = AutocompleteInput;
Autocomplete.InputWrapper = AutocompleteInputWrapper;
Autocomplete.Label = AutocompleteLabel;
Autocomplete.LeftAddons = AutocompleteLeftAddon;
Autocomplete.List = AutocompleteList;
Autocomplete.ListVirtualize = AutocompleteListVirtualize;
Autocomplete.Loading = AutocompleteLoading;
Autocomplete.Messages = AutocompleteMessages;
Autocomplete.Popover = AutocompletePopover;
Autocomplete.RightAddons = AutocompleteRightAddon;
Autocomplete.Errors = AutocompleteErrors;

export { Autocomplete };
