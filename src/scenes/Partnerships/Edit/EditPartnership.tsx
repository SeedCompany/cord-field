import { Box } from '@material-ui/core';
import { Decorator } from 'final-form';
import React, { FC } from 'react';
import { useFormState } from 'react-final-form';
import { Except } from 'type-fest';
import {
  displayPartnershipFundingType,
  displayPartnershipStatus,
  GQLOperations,
  PartnershipFundingTypeList,
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
import { Nullable } from '../../../util';
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

const hasManagingType = (types: Nullable<readonly PartnershipType[]>) =>
  types?.includes('Managing') ?? false;

const clearFundingType: Decorator<UpdatePartnershipInput> = (form) => {
  let prevValues: Partial<UpdatePartnershipInput> | undefined;
  return form.subscribe(
    ({ initialValues, values }) => {
      if (prevValues === undefined || prevValues !== initialValues) {
        prevValues = initialValues;
      }
      if (
        hasManagingType(prevValues.partnership?.types) &&
        !hasManagingType(values.partnership.types)
      ) {
        // @ts-expect-error types don't account for nesting
        form.change('partnership.fundingType', null);
      }
      prevValues = values;
    },
    {
      values: true,
      initialValues: true,
    }
  );
};

const decorators = [clearFundingType];

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
          agreementStatus: partnership.agreementStatus.value ?? 'NotAttached',
          mouStatus: partnership.mouStatus.value ?? 'NotAttached',
          types: partnership.types.value,
          fundingType: partnership.fundingType.value,
        },
      }}
      decorators={decorators}
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
      <FundingType />
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

const FundingType = () => {
  const { values } = useFormState<UpdatePartnershipInput>();
  const managingTypeSelected = hasManagingType(values.partnership.types);

  return managingTypeSelected ? (
    <RadioField
      name="partnership.fundingType"
      label="Funding Type"
      fullWidth
      row
    >
      {PartnershipFundingTypeList.map((type) => (
        <RadioOption
          key={type}
          value={type}
          label={displayPartnershipFundingType(type)}
        />
      ))}
    </RadioField>
  ) : null;
};
