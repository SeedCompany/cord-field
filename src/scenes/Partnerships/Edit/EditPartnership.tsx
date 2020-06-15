import { Box, Button } from '@material-ui/core';
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

  const onDeleteClick = () => {
    const { id } = partnership;
    deletePartnership({
      variables: { input: id },
      refetchQueries: [GQLOperations.Query.ProjectPartnerships],
    });
    //TODO: correctly handle closing the dialog.  props.onClose has a TS errors
    // props.onClose && props.onClose('cancel');
  };

  const radioOptions = PartnershipStatuses.map((status) => (
    <RadioOption
      key={status}
      label={displayPartnershipStatus(status)}
      value={status}
    />
  ));

  return (
    <DialogForm<UpdatePartnershipInput>
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={(input) => {
        updatePartnership({
          variables: { input },
          refetchQueries: [GQLOperations.Query.ProjectPartnerships],
        });
      }}
      title={`Edit Partnership with ${partnership.organization.name.value}`}
      leftAction={<Button onClick={onDeleteClick}>Delete</Button>}
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
