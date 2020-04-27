import { Card, CardContent } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { CreateOrganizationInput } from '../../../api';
import { SubmitButton, SubmitError, TextField } from '../../../components/form';

export type CreateOrganizationFormProps = Pick<
  FormProps<CreateOrganizationInput>,
  'onSubmit' | 'initialValues'
> & { className?: string };

export const CreateOrganizationForm = ({
  className,
  ...props
}: CreateOrganizationFormProps) => (
  <Form {...props}>
    {({ handleSubmit }) => (
      <Card component="form" onSubmit={handleSubmit} className={className}>
        <CardContent>
          <SubmitError />
          <TextField
            name="organization.name"
            placeholder="Enter organization name"
          />
          <SubmitButton />
        </CardContent>
      </Card>
    )}
  </Form>
);
