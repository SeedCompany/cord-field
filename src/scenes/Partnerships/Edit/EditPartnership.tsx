import { useMutation } from '@apollo/client';
import { Decorator } from 'final-form';
import React, { FC, useMemo } from 'react';
import { Except } from 'type-fest';
import {
  invalidateProps,
  PeriodType,
  removeItemFromList,
  UpdatePartnershipInput,
} from '../../../api';
import { SubmitAction, SubmitButton } from '../../../components/form';
import { PartnerLookupItem } from '../../../components/form/Lookup';
import { callAll } from '../../../util';
import { UpdateProjectDocument } from '../../Projects/Update/UpdateProject.generated';
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
  UpdatePartnershipMutation,
} from './EditPartnership.generated';
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

export const EditPartnership: FC<EditPartnershipProps> = (props) => {
  const { partnership, project } = props;

  const [updatePartnership] = useMutation(UpdatePartnershipDocument, {
    update: callAll(
      invalidateBudgetRecords(project, partnership, updatedPartnership),
      updateOldPrimaryPartnership(project, updatedPartnership)
    ),
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
  const [updateProject] = useMutation(UpdateProjectDocument);

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
      onSubmit={async ({ submitAction, partnership }) => {
        if (submitAction === 'delete') {
          await deletePartnership({
            variables: {
              input: partnership.id,
              changeset: props.partnership.changeset?.id,
            },
          });
          return;
        }
        const { financialReportPeriod, ...rest } = partnership;
        const {
          financialReportPeriod: { value: prevFinancialReportPeriod },
        } = project;

        await updatePartnership({
          variables: {
            input: {
              partnership: {
                ...rest,
                primary: partnership.primary || undefined,
              },
              changeset: props.partnership.changeset?.id,
            },
          },
        });
        if (financialReportPeriod !== prevFinancialReportPeriod) {
          await updateProject({
            variables: {
              input: {
                project: {
                  id: project.id,
                  financialReportPeriod: financialReportPeriod,
                },
                changeset: project.changeset?.id,
              },
            },
            update: (cache) => {
              // Invalidate financial reports as they are now different
              invalidateProps(cache, project, [
                'financialReports',
                'currentFinancialReportDue',
                'nextFinancialReportDue',
              ]);
            },
          });
        }
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
