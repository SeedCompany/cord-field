import { Typography, TypographyProps } from '@material-ui/core';
import * as React from 'react';
import { useFormState } from 'react-final-form';

/**
 * Standard styling for displaying form submission errors.
 * If no children are passed, component is display the form's submitErrors
 * if it is a string.
 */
export const SubmitError = ({ children, ...rest }: TypographyProps) => {
  const { submitError } = useFormState({
    subscription: {
      submitError: true,
    },
  });
  return (
    <Typography color="error" variant="body2" align="center" {...rest}>
      {children || submitError || <br />}
    </Typography>
  );
};
