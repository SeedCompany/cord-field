import { Box, Stack } from '@mui/material';
import { useField } from 'react-final-form';
import { CheckboxField } from './CheckboxField';
import { FieldGroup } from './FieldGroup';

export interface FieldData {
  id: string;
  displayName: string;
  [key: string]: any;
}

export const CheckboxesGroup = ({
  fieldsData,
  labelPlacement,
  prefix,
  title,
  marginBottom = 0,
  fieldName,
}: {
  fieldsData: FieldData[];
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  prefix: string;
  title: string;
  marginBottom?: number;
  fieldName: string;
}) => {
  const { input } = useField<string[]>(fieldName, {
    format: (value) => value,
    parse: (value) => value,
  });

  return (
    <Box marginBottom={marginBottom}>
      <Box>
        <label>
          <b>{title}</b>
        </label>
      </Box>
      <FieldGroup prefix={prefix}>
        <Stack direction="row">
          {fieldsData.map((field) => (
            <CheckboxField
              key={field.id}
              name={`${prefix}.${field.id}`}
              label={field.displayName}
              labelPlacement={labelPlacement}
              defaultValue={input.value.includes(field.id)}
              onChange={(event) => {
                const checked = event.target.checked;
                const newValue = checked
                  ? [...input.value, field.id]
                  : input.value.filter((value) => value !== field.id);
                input.onChange(newValue);
              }}
            />
          ))}
        </Stack>
      </FieldGroup>
    </Box>
  );
};
