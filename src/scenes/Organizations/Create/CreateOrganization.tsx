import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { handleFormError, useCreateOrganizationMutation } from '../../../api';
import {
  CreateOrganizationForm,
  CreateOrganizationFormProps as Props,
} from './CreateOrganizationForm';

export const CreateOrganization = (props: Except<Props, 'onSubmit'>) => {
  const [createOrg] = useCreateOrganizationMutation();
  const { enqueueSnackbar } = useSnackbar();

  const submit: Props['onSubmit'] = async (input) => {
    try {
      await createOrg({
        variables: { input },
      });
      enqueueSnackbar(
        `Successfully created org with name: ${input.organization.name}`,
        {
          variant: 'success',
        }
      );
      // should be navigated to new org created.
    } catch (e) {
      return await handleFormError(e);
    }
  };

  return <CreateOrganizationForm {...props} onSubmit={submit} />;
};
