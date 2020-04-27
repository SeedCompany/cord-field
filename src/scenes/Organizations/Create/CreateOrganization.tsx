import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Except } from 'type-fest';
import { handleFormError, useCreateOrganizationMutation } from '../../../api';
import { useSession } from '../../../components/Session';
import {
  CreateOrganizationForm,
  CreateOrganizationFormProps as Props,
} from './CreateOrganizationForm';

export const CreateOrganization = (props: Except<Props, 'onSubmit'>) => {
  const [createOrg] = useCreateOrganizationMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [session, sessionLoading] = useSession();

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate('/login');
    }
  }, [navigate, session, sessionLoading]);

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
