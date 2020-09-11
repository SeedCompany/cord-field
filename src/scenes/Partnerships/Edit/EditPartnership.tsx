import { Box } from '@material-ui/core';
import { Decorator } from 'final-form';
import React, { FC, useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { Except } from 'type-fest';
import {
  displayFinancialReportingType,
  displayPartnershipStatus,
  FinancialReportingTypeList,
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

const clearFinancialReportingType: Decorator<UpdatePartnershipInput> = (
  form
) => {
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
        form.change('partnership.financialReportingType', null);
      }
      prevValues = values;
    },
    {
      values: true,
      initialValues: true,
    }
  );
};

const decorators = [clearFinancialReportingType];

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

  const initialValues = useMemo(
    () => ({
      partnership: {
        id: partnership.id,
        agreementStatus: partnership.agreementStatus.value ?? 'NotAttached',
        mouStatus: partnership.mouStatus.value ?? 'NotAttached',
        types: partnership.types.value,
        financialReportingType: partnership.financialReportingType.value,
      },
    }),
    [
      partnership.agreementStatus.value,
      partnership.financialReportingType.value,
      partnership.id,
      partnership.mouStatus.value,
      partnership.types.value,
    ]
  );

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
      initialValues={initialValues}
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
      <FinancialReportingType />
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

const FinancialReportingType = () => {
  const { values } = useFormState<UpdatePartnershipInput>();
  const managingTypeSelected = hasManagingType(values.partnership.types);

  return managingTypeSelected ? (
    <RadioField
      name="partnership.financialReportingType"
      label="Funding Type"
      fullWidth
      row
    >
      {FinancialReportingTypeList.map((type) => (
        <RadioOption
          key={type}
          value={type}
          label={displayFinancialReportingType(type)}
        />
      ))}
    </RadioField>
  ) : null;
};
