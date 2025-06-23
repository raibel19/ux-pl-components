import InputAddonButton from './input-addon-button';
import InputAddonClear from './input-addon-clear';
import InputAddonCounter from './input-addon-counter';
import InputAddonError from './input-addon-error';
import InputAddonIcon from './input-addon-icon';
import InputAddonSeparator from './input-addon-separator';
import InputAddonText from './input-addon-text';
import InputContent from './input-content';
import InputControl from './input-control';
import InputErrors from './input-errors';
import InputGroup from './input-group';
import InputLabel from './input-label';
import InputLeftAddon from './input-left-addon';
import InputRightAddon from './input-right-addon';
import InputRoot from './input-root';
import InputSkeleton from './input-skeleton';

export const Input = Object.assign(InputGroup, {
  ButtonAddon: InputAddonButton,
  ClearAddon: InputAddonClear,
  Content: InputContent,
  Control: InputControl,
  CounterAddon: InputAddonCounter,
  ErrorAddon: InputAddonError,
  Errors: InputErrors,
  IconAddon: InputAddonIcon,
  Label: InputLabel,
  LeftAddons: InputLeftAddon,
  RightAddons: InputRightAddon,
  Root: InputRoot,
  SeparatorAddon: InputAddonSeparator,
  Skeleton: InputSkeleton,
  TextAddon: InputAddonText,
});
