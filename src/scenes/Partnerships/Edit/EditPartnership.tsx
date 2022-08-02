import { useMutation } from '@apollo/client';
import { Decorator } from 'final-form';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { onUpdateInvalidateProps, removeItemFromList } from '~/api';
import { PeriodType, UpdatePartnershipInput } from '~/api/schema.graphql';
import { callAll } from '~/common';
import { SubmitAction, SubmitButton } from '../../../components/form';
import { PartnerLookupItem } from '../../../components/form/Lookup';
import { invalidateBudgetRecords } from '../InvalidateBudget';
import { ProjectPartnershipsQuery } from '../List/PartnershipList.graphql';
import {
  hasManagingType,
  PartnershipForm,
  PartnershipFormFragment,
  PartnershipFormProps,
} from '../PartnershipForm';
import {
  DeletePartnershipDocument,
  UpdatePartnershipDocument,
  UpdatePartnershipMutation,
} from './EditPartnership.graphql';
import { updateOldPrimaryPartnership } from './UpdateOldPrimaryPartnership';

export type EditPartnershipFormInput = UpdatePartnershipInput &
  SubmitAction<'delete'> & {
    partnership?: {
      partnerLookupItem?: PartnerLookupItem;
      financialReportPeriod?: PeriodType;
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

const updatedPartnership = (res: UpdatePartnershipMutation) =>
  res.updatePartnership.partnership;

export const EditPartnership = (props: EditPartnershipProps) => {
  const { partnership, project } = props;

  const [updatePartnership] = useMutation(UpdatePartnershipDocument);
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
        mouStartOverride: partnership.mouRangeOverride.value.start,
        mouEndOverride: partnership.mouRangeOverride.value.end,
        primary: partnership.primary.value,
        financialReportPeriod: project.financialReportPeriod.value!,
      },
    }),
    [
      partnership.id,
      partnership.agreementStatus.value,
      partnership.mouStatus.value,
      partnership.types.value,
      partnership.financialReportingType.value,
      partnership.mouRangeOverride.value.start,
      partnership.mouRangeOverride.value.end,
      partnership.primary.value,
      project.financialReportPeriod.value,
    ]
  );

  const name = partnership.partner.value?.organization.value?.name.value;
  return (
    <PartnershipForm<EditPartnershipFormInput>
      {...props}
      sendIfClean="delete" // Lets us delete without changing any fields
      validate={(values) => {
        const start = values.partnership.mouStartOverride;
        const end = values.partnership.mouEndOverride;

        if (start && end) {
          if (start > end) {
            return {
              partnership: {
                mouStartOverride: 'Start date should come before end date',
                mouEndOverride: 'End date should come after start date',
              },
            };
          }

          return undefined;
        }
        if (
          start &&
          partnership.mouRange.value.end &&
          start > partnership.mouRange.value.end
        ) {
          return {
            partnership: {
              mouStartOverride: `Start date should come before project's end date`,
            },
          };
        }

        if (
          end &&
          partnership.mouRange.value.start &&
          end < partnership.mouRange.value.start
        ) {
          return {
            partnership: {
              mouEndOverride: `End date should come after project's start date`,
            },
          };
        }
      }}
      onSubmit={async ({ submitAction, partnership: values }) => {
        if (submitAction === 'delete') {
          await deletePartnership({
            variables: {
              input: partnership.id,
              changeset: props.partnership.changeset?.id,
            },
          });
          return;
        }
        const { financialReportPeriod, ...rest } = values;
        const financialReportPeriodChanged =
          financialReportPeriod !== project.financialReportPeriod.value;

        await updatePartnership({
          variables: {
            changes: {
              ...rest,
              primary: values.primary || undefined,
            },
            changeset: partnership.changeset?.id,
            financialReportPeriodChanged,
            projectId: project.id,
            period: financialReportPeriod,
          },
          update: callAll(
            invalidateBudgetRecords(project, partnership, updatedPartnership),
            updateOldPrimaryPartnership(project, updatedPartnership),
            // Invalidate financial reports as they are now different
            financialReportPeriodChanged &&
              onUpdateInvalidateProps(project, [
                'financialReports',
                'currentFinancialReportDue',
                'nextFinancialReportDue',
              ])
          ),
        });
      }}
      title={`Edit Partnership ${name ? `with ${name}` : ''}`}
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
      changesetAware
    />
  );
};
