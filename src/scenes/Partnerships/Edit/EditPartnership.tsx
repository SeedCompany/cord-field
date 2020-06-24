import { Box } from '@material-ui/core';
import React, { FC } from 'react';
import { Except } from 'type-fest';
import {
  displayPartnershipStatus,
  GQLOperations,
  PartnershipStatuses,
  PartnershipType,
  UpdatePartnershipInput,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxesField,
  CheckboxOption,
  RadioField,
  RadioOption,
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import {
  EditPartnershipFragment,
  useDeletePartnershipMutation,
  useUpdatePartnershipMutation,
} from './EditPartnership.generated';

type EditPartnershipProps = Except<
  DialogFormProps<UpdatePartnershipInput>,
  'onSubmit' | 'initialValues'
> & {
  partnership: EditPartnershipFragment;
};

export const EditPartnership: FC<EditPartnershipProps> = ({
  partnership,
  ...props
}) => {
  const [updatePartnership] = useUpdatePartnershipMutation();
  const [deletePartnership] = useDeletePartnershipMutation();

  const radioOptions = PartnershipStatuses.map((status) => (
    <RadioOption
      key={status}
      label={displayPartnershipStatus(status)}
      value={status}
    />
  ));

  return (
    <DialogForm<UpdatePartnershipInput & SubmitAction<'delete'>>
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={async (input) => {
        const refetchQueries = [GQLOperations.Query.ProjectPartnerships];
        if (input.submitAction === 'delete') {
          await deletePartnership({
            variables: { input: input.partnership.id },
            refetchQueries,
          });
          return;
        }
        await updatePartnership({
          variables: { input },
          refetchQueries,
        });
      }}
      title={`Edit Partnership with ${partnership.organization.name.value}`}
      leftAction={
        <SubmitButton
          action="delete"
          color="error"
          fullWidth={false}
          variant="text"
        >
          Delete
        </SubmitButton>
      }
      initialValues={{
        partnership: {
          id: partnership.id,
          agreementStatus: partnership.agreementStatus.value,
          mouStatus: partnership.mouStatus.value,
          types: partnership.types.value,
        },
      }}
    >
      <SubmitError />
      <CheckboxesField
        name="partnership.types"
        label="Types"
        row
        disabled={!partnership.types.canEdit}
      >
        {([
          'Managing',
          'Funding',
          'Impact',
          'Technical',
          'Resource',
        ] as PartnershipType[]).map((type: PartnershipType) => (
          <Box width="50%" key={type}>
            <CheckboxOption key={type} label={type} value={type} />
          </Box>
        ))}
      </CheckboxesField>
      <RadioField
        name="partnership.agreementStatus"
        label="Agreement Status"
        disabled={!partnership.agreementStatus.canEdit}
      >
        {radioOptions}
      </RadioField>
      <RadioField
        name="partnership.mouStatus"
        label="Mou Status"
        disabled={!partnership.mouStatus.canEdit}
      >
        {radioOptions}
      </RadioField>
    </DialogForm>
  );
};
