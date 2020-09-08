import React, { useMemo } from 'react';
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

  const initialValues = useMemo(
    () => ({
      organization: {
        id: org.id,
        name: org.name.value,
      },
    }),
    [org.id, org.name.value]
  );

  return (
    <DialogForm<UpdateOrganizationInput>
      title="Edit Partner"
      {...props}
      initialValues={initialValues}
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
