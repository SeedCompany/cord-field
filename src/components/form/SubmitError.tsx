import { Typography, TypographyProps } from '@material-ui/core';
import * as React from 'react';
import { useFormState } from 'react-final-form';

/**
 * Standard styling for displaying form submission errors.
 * If no children are passed, component is display the form's submitErrors
 * if it is a string.
 */
export const SubmitError = ({ children, ...rest }: TypographyProps) => {
  const { submitErrors } = useFormState({
    subscription: {
      submitErrors: true,
    },
  });
  if (!children && (!submitErrors || typeof submitErrors !== 'string')) {
    return null;
  }
  return (
    <Typography color="error" {...rest}>
      {children || submitErrors}
    </Typography>
  );
};
