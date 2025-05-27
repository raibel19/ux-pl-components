export type InputResponseDefaultValueType = string | number | boolean | undefined;
export type InputResponseValueType = string | undefined;

export interface IInputResponseEventProps<Data> {
  value: string | undefined;
  checked: boolean | undefined;
  files: Map<string, File> | undefined;
  defaultValue: string | number | boolean | undefined;
  data: Data | undefined;
}
