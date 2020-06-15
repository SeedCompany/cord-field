import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { ButtonLink } from '../../../components/Routing';
import { useCreateOrganizationMutation } from './CreateOrganization.generated';
import {
  CreateOrganizationForm,
  CreateOrganizationFormProps as Props,
} from './CreateOrganizationForm';

export const CreateOrganization = (props: Except<Props, 'onSubmit'>) => {
  const [createOrg] = useCreateOrganizationMutation();
  const { enqueueSnackbar } = useSnackbar();
  const submit: Props['onSubmit'] = async (input) => {
    const res = await createOrg({
      variables: { input },
      refetchQueries: ['Organizations'],
    });
    const org = res.data!.createOrganization.organization;

    enqueueSnackbar(`Created organization: ${org.name.value}`, {
      variant: 'success',
      action: () => (
        <ButtonLink color="inherit" to={`/organizations/${org.id}`}>
          View
        </ButtonLink>
      ),
    });
  };

  return <CreateOrganizationForm {...props} onSubmit={submit} />;
};
