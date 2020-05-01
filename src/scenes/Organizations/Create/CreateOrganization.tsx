import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Except } from 'type-fest';
import { handleFormError, useCreateOrganizationMutation } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { sleep } from '../../../util';
import {
  CreateOrganizationForm,
  CreateOrganizationFormProps as Props,
} from './CreateOrganizationForm';

export const CreateOrganization = (props: Except<Props, 'onSubmit'>) => {
  const [createOrg] = useCreateOrganizationMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [close, setClose] = useState(false);
  const submit: Props['onSubmit'] = async (input) => {
    try {
      setClose(true);
      await sleep(5000);
      const org = await createOrg({
        variables: { input },
      });
      const action = () => (
        <ButtonLink
          color="inherit"
          to={`/organizations/${org.data.createOrganization.organization.id}`}
        >
          View
        </ButtonLink>
      );
      enqueueSnackbar(`Created organization: ${input.organization.name}`, {
        variant: 'success',
        action,
      });
      setClose(false);
    } catch (e) {
      setClose(false);
      return await handleFormError(e);
    }
  };

  return <CreateOrganizationForm close={close} {...props} onSubmit={submit} />;
};
