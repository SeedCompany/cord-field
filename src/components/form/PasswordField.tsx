import { IconButton, IconButtonProps, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import React, { ComponentType, FC, useState } from 'react';
import { Except } from 'type-fest';
import { TextField, TextFieldProps } from './TextField';

export type PasswordFieldProps = Except<TextFieldProps, 'type' | 'name'> & {
  name?: string;
  VisibilityToggle?: ComponentType<ToggleProps>;
  VisibilityToggleProps?: Partial<ToggleProps>;
};
export const PasswordField: FC<PasswordFieldProps> = ({
  name = 'password',
  VisibilityToggle,
  VisibilityToggleProps,
  InputProps,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const Toggle = VisibilityToggle || PasswordIconToggle;

  return (
    <TextField
      name={name}
      label="Password"
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
  >
    {show ? <VisibilityOff /> : <Visibility />}
  </IconButton>
);
