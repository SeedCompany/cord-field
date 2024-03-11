import { Box, Stack } from '@mui/material';
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
}: {
  fieldsData: FieldData[];
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  prefix: string;
  title: string;
  marginBottom?: number;
}) => {
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
              name={field.id}
              label={field.displayName}
              labelPlacement={labelPlacement}
            />
          ))}
        </Stack>
      </FieldGroup>
    </Box>
  );
};
