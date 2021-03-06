import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import {
  CreateOrganizationDocument,
  CreateOrganizationMutation,
} from './CreateOrganization.generated';
import {
  CreateOrganizationForm,
  CreateOrganizationFormProps,
} from './CreateOrganizationForm';

type CreateOrganizationProps = Except<
  CreateOrganizationFormProps<
    CreateOrganizationMutation['createOrganization']['organization']
  >,
  'onSubmit'
>;

export const CreateOrganization = (props: CreateOrganizationProps) => {
  const [createOrg] = useMutation(CreateOrganizationDocument);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CreateOrganizationForm
      onSuccess={(org) =>
        enqueueSnackbar(`Created organization: ${org.name.value}`, {
          variant: 'success',
        })
      }
      {...props}
      onSubmit={async (input) => {
        const { data } = await createOrg({
          variables: { input },
        });
        return data!.createOrganization.organization;
      }}
    />
  );
};
