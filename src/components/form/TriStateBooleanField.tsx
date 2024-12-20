import { EnumField, EnumFieldProps } from './EnumField';

export type TriStateBooleanProps = Omit<
  EnumFieldProps<string, false>,
  'children' | 'options'
> & {
  options?: Array<boolean | null>;
  getLabel?: (v: boolean | null) => string;
};

export const TriStateBooleanField = (props: TriStateBooleanProps) => (
  <EnumField
    options={[true, false, null] as any}
    getLabel={(v: any) => (v ? 'Yes' : v === false ? 'No' : 'Unknown')}
    {...props}
  />
);
