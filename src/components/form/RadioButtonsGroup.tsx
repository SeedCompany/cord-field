import { Box, FormControlLabel, Radio } from '@mui/material';
import { ChangeEvent } from 'react';
import { useField } from 'react-final-form';
import { FieldData } from './CheckboxesGroup';
import { FieldGroup } from './FieldGroup';

interface RadioButtonsGroupProps {
  fieldsData: FieldData[];
  name: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  marginBottom?: number;
  title: string;
}

export const RadioButtonsGroup = ({
  fieldsData,
  name,
  labelPlacement,
  title,
  marginBottom = 0,
}: RadioButtonsGroupProps) => {
  const {
    input: { value, onChange },
  } = useField(name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box marginBottom={marginBottom}>
      <Box>
        <label>
          <b>{title}</b>
        </label>
      </Box>
      <FieldGroup prefix={name}>
        {fieldsData.map((field) => (
          <FormControlLabel
            key={field.id}
            control={
              <Radio
                checked={value === field.id}
                onChange={handleChange}
                value={field.id}
                name={name}
                inputProps={{ 'aria-label': field.id }}
              />
            }
            label={field.displayName}
            labelPlacement={labelPlacement}
          />
        ))}
      </FieldGroup>
    </Box>
  );
};
