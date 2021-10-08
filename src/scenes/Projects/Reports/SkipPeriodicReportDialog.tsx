import { pick } from 'lodash';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdatePeriodicReportInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitButton, SubmitError, TextField } from '../../../components/form';
import { PeriodicReportFragment } from '../../../components/PeriodicReports/PeriodicReport.generated';
import { useUpdatePeriodicReport } from '../../../components/PeriodicReports/Upload/useUpdatePeriodicReport';
import { many, Many } from '../../../util';
import { EditablePeriodicReportField } from './UpdatePeriodicReportDialog';

interface SkipPeriodicReportFormValues {
  report: UpdatePeriodicReportInput;
}

type SkipPeriodicReportDialogProps = Except<
  DialogFormProps<SkipPeriodicReportFormValues>,
  'onSubmit' | 'initialValues'
> & {
  report: Omit<PeriodicReportFragment, 'reportFile'> & { reportFile?: File[] };
  editFields?: Many<EditablePeriodicReportField>;
};

export const SkipPeriodicReportDialog = ({
  report,
  editFields: editFieldsProp,
  ...props
}: SkipPeriodicReportDialogProps) => {
  const editFields = useMemo(
    () => many(editFieldsProp ?? []),
    [editFieldsProp]
  );
  const updatePeriodicReport = useUpdatePeriodicReport();

  const initialValues = useMemo(() => {
    const skippedReason = report.skippedReason.value;
    const fullInitialValuesFields: Except<
      SkipPeriodicReportFormValues['report'],
      'id'
    > = {
      skippedReason,
    };

    const filteredInitialValuesFields = pick(
      fullInitialValuesFields,
      editFields
    );
    return {
      report: {
        id: report.id,
        ...filteredInitialValuesFields,
      },
    };
  }, [editFields, report.skippedReason, report.id]);

  return (
    <DialogForm<SkipPeriodicReportFormValues>
      {...props}
      title={`${
        report.skippedReason.value ? 'Edit Skip Reason' : 'Skip Report'
      }`}
      closeLabel="Close"
      submitLabel="Save"
      fieldsPrefix="report"
      initialValues={initialValues}
      onSubmit={async ({ report: { id, skippedReason } }) => {
        await updatePeriodicReport(
          id,
          undefined,
          undefined,
          skippedReason ?? undefined
        );
      }}
      leftAction={
        report.skippedReason.value ? (
          <SubmitButton
            action="delete"
            color="error"
            fullWidth={false}
            variant="text"
            onClick={async () =>
              await updatePeriodicReport(report.id, undefined, undefined, null)
            }
          >
            Left Action
          </SubmitButton>
        ) : null
      }
    >
      <SubmitError />
      <TextField
        name="skippedReason"
        label="Skip Reason"
        placeholder="Why this report is skipped?"
      ></TextField>
    </DialogForm>
  );
};
