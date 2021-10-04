import { pick } from 'lodash';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdatePeriodicReportInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { PeriodicReportFragment } from '../../../components/PeriodicReports/PeriodicReport.generated';
import { useUpdatePeriodicReport } from '../../../components/PeriodicReports/Upload/useUpdatePeriodicReport';
import { many, Many } from '../../../util';
import { EditablePeriodicReportField } from './UpdatePeriodicReportDialog';

interface SkipPeriodicReportFormValues {
  report: Omit<UpdatePeriodicReportInput, 'reportFile'> & {
    reportFile?: File[];
  };
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
      reportFile: report.reportFile,
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
  }, [editFields, report.skippedReason, report.reportFile, report.id]);

  return (
    <DialogForm<SkipPeriodicReportFormValues>
      {...props}
      title="Skip Report"
      closeLabel="Close"
      submitLabel="Save"
      fieldsPrefix="report"
      initialValues={initialValues}
      onSubmit={async ({ report: { id, reportFile, skippedReason } }) =>
        await updatePeriodicReport(
          id,
          reportFile,
          undefined,
          skippedReason ?? undefined
        )
      }
    >
      <SubmitError />
      <TextField
        name="skippedReason"
        label="Skipped Reason"
        placeholder="Why this report is skipped?"
      ></TextField>
    </DialogForm>
  );
};
