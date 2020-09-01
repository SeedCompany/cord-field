import React from 'react';
import { Except } from 'type-fest';
import { UpdateOrganizationInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { OrgDetailsFragment } from '../Detail/OrganizationDetail.generated';
import { useUpdateOrganizationMutation } from './EditOrganization.generated';

export type EditOrganizationProps = Except<
  DialogFormProps<UpdateOrganizationInput>,
  'onSubmit' | 'initialValues'
> & {
  org: OrgDetailsFragment;
};

export const EditOrganization = ({ org, ...props }: EditOrganizationProps) => {
  const [updateOrg] = useUpdateOrganizationMutation();

  return (
    <DialogForm<UpdateOrganizationInput>
      title="Edit Partner"
      {...props}
      initialValues={{
        organization: {
          id: org.id,
          name: org.name.value,
        },
      }}
      onSubmit={async (input) => {
        await updateOrg({
          variables: { input },
        });
      }}
    >
      <SubmitError />
      <TextField
        name="organization.name"
        label="Name"
        placeholder="Enter new partner name"
        disabled={!org.name.canEdit}
        required
      />
    </DialogForm>
  );
};
