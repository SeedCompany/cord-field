import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdatePartnerInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { PartnerDetailsFragment } from '../Detail/PartnerDetail.generated';
import { useUpdatePartnerMutation } from './EditPartner.generated';

export type EditPartnerProps = Except<
  DialogFormProps<UpdatePartnerInput>,
  'onSubmit' | 'initialValues'
> & {
  partner: PartnerDetailsFragment;
};

export const EditPartner = ({ partner, ...props }: EditPartnerProps) => {
  const [updatePartner] = useUpdatePartnerMutation();

  const initialValues = useMemo(
    () => ({
      partner: {
        id: partner.id,
        name: partner.organization.value?.name.value,
      },
    }),
    [partner]
  );

  return (
    <DialogForm<UpdatePartnerInput>
      title="Edit Partner"
      {...props}
      initialValues={initialValues}
      onSubmit={async (input) => {
        await updatePartner({
          variables: { input },
        });
      }}
      fieldsPrefix="partner"
    >
      <SubmitError />
    </DialogForm>
  );
};
