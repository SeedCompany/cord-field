import React from 'react';
import { Except } from 'type-fest';
import { useCreateOrganizationMutation } from '../../../api';
import {
  CreateOrganizationForm,
  CreateOrganizationFormProps as Props,
} from './CreateOrganizationForm';

export const CreateOrganization = (props: Except<Props, 'onSubmit'>) => {
  const [createOrg] = useCreateOrganizationMutation();

  const submit: Props['onSubmit'] = async (input) => {
    try {
      const res = await createOrg({
        variables: { input },
      });

      // TODO: post-login authentication (session storage, etc)
      if (res?.login.success) {
        alert(`Welcome ${res.login.user?.realFirstName.value}`);
      } else {
        alert('Login failed. Please check your email or password.');
      }
    } catch (e) {
      alert('Login failed. Please contact support.');
      console.log(e);
    }
  };

  return <CreateOrganizationForm {...props} onSubmit={submit} />;
};
