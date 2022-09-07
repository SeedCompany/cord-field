import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, IconButtonProps, InputAdornment } from '@mui/material';
import { ComponentType, useState } from 'react';
import { Except } from 'type-fest';
import { TextField, TextFieldProps } from './TextField';

export type PasswordFieldProps = Except<TextFieldProps, 'type' | 'name'> & {
  name?: string;
  VisibilityToggle?: ComponentType<ToggleProps>;
  VisibilityToggleProps?: Partial<ToggleProps>;
};
export const PasswordField = ({
  name = 'password',
  VisibilityToggle,
  VisibilityToggleProps,
  InputProps,
  ...rest
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  const Toggle = VisibilityToggle || PasswordIconToggle;

  return (
    <TextField
      name={name}
      label="Password"
      placeholder="Enter Password"
      required={true}
      {...rest}
      type={visible ? 'text' : 'password'}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <Toggle
              show={visible}
              onClick={() => setVisible(!visible)}
              {...VisibilityToggleProps}
            />
          </InputAdornment>
        ),
      }}
      inputProps={{
        ...rest.inputProps,
        'data-private': 'redact', // Hide in LogRocket
      }}
    />
  );
};

export interface ToggleProps extends IconButtonProps {
  show: boolean;
  onClick: () => void;
}
export const PasswordIconToggle = ({ show, onClick, ...rest }: ToggleProps) => (
  <IconButton
    aria-label="Toggle password visibility"
    {...rest}
    edge="end"
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
  >
    {show ? <VisibilityOff /> : <Visibility />}
  </IconButton>
);
