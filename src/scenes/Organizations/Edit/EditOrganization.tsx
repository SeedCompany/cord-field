import React, { FC } from 'react';
import { Except } from 'type-fest';
import { UpdateOrganization } from '../../../api';
import { DialogState } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { useUpdateOrganizationMutation } from './EditOrganization.generated';

type EditOrganizationProps = DialogState & { orgId: string };

interface UpdateOrganizationFormInput {
  organization: Except<UpdateOrganization, 'id'>;
}

export const EditOrganization: FC<EditOrganizationProps> = (props) => {
  const { orgId, ...rest } = props;
  const [updateOrg] = useUpdateOrganizationMutation();
  const submit = (input: UpdateOrganizationFormInput) => {
    const organizationInputWithId = {
      organization: {
        ...input.organization,
        id: orgId,
      },
    };
    updateOrg({
      variables: { input: organizationInputWithId },
    });
  };

  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...rest}
      title="Edit Partner"
      onSubmit={submit}
    >
      <SubmitError />
      <TextField
        name="organization.name"
        label="Name"
        placeholder="Enter new partner name"
        autoFocus
      />
    </DialogForm>
  );
};
