import { useMutation } from '@apollo/client';
import { Decorator } from 'final-form';
import React, { FC, useMemo } from 'react';
import { Except } from 'type-fest';
import {
  GQLOperations,
  removeItemFromList,
  UpdatePartnershipInput,
} from '../../../api';
import { SubmitAction, SubmitButton } from '../../../components/form';
import { PartnerLookupItem } from '../../../components/form/Lookup';
import { callAll } from '../../../util';
import { invalidateBudgetRecords } from '../InvalidateBudget/invalidateBudgetRecords';
import { ProjectPartnershipsQuery } from '../List/PartnershipList.generated';
import {
  hasManagingType,
  PartnershipForm,
  PartnershipFormFragment,
  PartnershipFormProps,
} from '../PartnershipForm';
import {
  DeletePartnershipDocument,
  UpdatePartnershipDocument,
} from './EditPartnership.generated';

export type EditPartnershipFormInput = UpdatePartnershipInput &
  SubmitAction<'delete'> & {
    partnership?: {
      partnerLookupItem?: PartnerLookupItem;
    };
  };

type EditPartnershipProps = Except<
  PartnershipFormProps<EditPartnershipFormInput>,
  'onSubmit' | 'initialValues'
> & {
  project: ProjectPartnershipsQuery['project'];
  partnership: PartnershipFormFragment;
};

const clearFinancialReportingType: Decorator<EditPartnershipFormInput> = (
  form
) => {
  let prevValues: Partial<EditPartnershipFormInput> | undefined;
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

export const EditPartnership: FC<EditPartnershipProps> = (props) => {
  const { partnership, project } = props;

  const [updatePartnership] = useMutation(UpdatePartnershipDocument, {
    update: invalidateBudgetRecords(
      project,
      partnership,
      (res) => res.updatePartnership.partnership
    ),
    refetchQueries: [GQLOperations.Query.ProjectPartnerships],
  });
  const [deletePartnership] = useMutation(DeletePartnershipDocument, {
    update: callAll(
      removeItemFromList({
        listId: [project, 'partnerships'],
        item: partnership,
      }),
      invalidateBudgetRecords(project, partnership, undefined)
    ),
  });

  const initialValues = useMemo(
    () => ({
      partnership: {
        id: partnership.id,
        agreementStatus: partnership.agreementStatus.value ?? 'NotAttached',
        mouStatus: partnership.mouStatus.value ?? 'NotAttached',
        types: partnership.types.value,
        financialReportingType: partnership.financialReportingType.value,
        mouStartOverride: partnership.mouStartOverride.value,
        mouEndOverride: partnership.mouEndOverride.value,
        primary: partnership.primary.value,
      },
    }),
    [
      partnership.agreementStatus.value,
      partnership.financialReportingType.value,
      partnership.id,
      partnership.mouEndOverride.value,
      partnership.mouStartOverride.value,
      partnership.mouStatus.value,
      partnership.types.value,
      partnership.primary.value,
    ]
  );

  return (
    <PartnershipForm<EditPartnershipFormInput>
      {...props}
      sendIfClean="delete" // Lets us delete without changing any fields
      onSubmit={async ({ submitAction, partnership }) => {
        if (submitAction === 'delete') {
          await deletePartnership({
            variables: { input: partnership.id },
          });
          return;
        }
        await updatePartnership({
          variables: { input: { partnership } },
        });
      }}
      title={`Edit Partnership with ${partnership.partner.value?.organization.value?.name.value}`}
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
    />
  );
};
