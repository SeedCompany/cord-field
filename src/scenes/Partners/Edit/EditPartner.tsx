import React, { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import { GQLOperations, UpdatePartner } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { UserField, UserLookupItem } from '../../../components/form/Lookup';
import { ExtractStrict, many, Many } from '../../../util';
import { PartnerDetailsFragment } from '../Detail/PartnerDetail.generated';
import { useUpdatePartnerMutation } from './EditPartner.generated';

interface PartnerFormValues {
  partner: Merge<
    UpdatePartner,
    {
      pointOfContactId?: UserLookupItem;
    }
  >;
}

export type EditablePartnerField = ExtractStrict<
  keyof UpdatePartner,
  // Add more fields here as needed
  'pointOfContactId'
>;

type EditPartnerProps = Except<
  DialogFormProps<PartnerFormValues>,
  'onSubmit' | 'initialValues'
> & {
  partner: PartnerDetailsFragment;
  editFields?: Many<EditablePartnerField>;
};
interface EngagementFieldProps {
  props: {
    name: string;
  };
}

const fieldMapping: Record<
  EditablePartnerField,
  ComponentType<EngagementFieldProps>
> = {
  pointOfContactId: ({ props }) => (
    <UserField {...props} label="Point of Contact" />
  ),
};

export const EditPartner = ({
  partner,
  editFields: editFieldsProp,
  ...props
}: EditPartnerProps) => {
  const [updatePartner] = useUpdatePartnerMutation({
    refetchQueries: [GQLOperations.Query.Partner],
  });

  const initialValues = useMemo(
    () => ({
      partner: {
        id: partner.id,
      },
    }),
    [partner]
  );

  const editFields = useMemo(() => many(editFieldsProp ?? []), [
    editFieldsProp,
  ]);

  const fields = editFields.map((name) => {
    const Field = fieldMapping[name];
    return <Field props={{ name }} key={name} />;
  });

  return (
    <DialogForm<PartnerFormValues>
      title="Edit Partner"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({ partner: { pointOfContactId, ...rest } }) => {
        await updatePartner({
          variables: {
            input: {
              partner: {
                ...rest,
                pointOfContactId: pointOfContactId?.id,
              },
            },
          },
        });
      }}
      fieldsPrefix="partner"
    >
      <SubmitError />
      {fields}
    </DialogForm>
  );
};
