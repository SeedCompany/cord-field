import { many, Many } from '@seedcompany/common';
import { pick } from 'lodash';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdatePeriodicReportInput } from '~/api/schema.graphql';
import { ExtractStrict } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  DateField,
  DropzoneField,
  SubmitError,
} from '../../../components/form';
import { PeriodicReportFragment } from '../../../components/PeriodicReports/PeriodicReport.graphql';
import { useUpdatePeriodicReport } from '../../../components/PeriodicReports/Upload/useUpdatePeriodicReport';

export type EditablePeriodicReportField = ExtractStrict<
  keyof UpdatePeriodicReportInput,
  // Add more fields here as needed
  'receivedDate' | 'reportFile' | 'skippedReason'
>;

interface UpdatePeriodicReportFormValues {
  // report.file does not have a type of CreateDefinedFileInput until the upload step has taken place
  report: Omit<UpdatePeriodicReportInput, 'reportFile'> & {
    reportFile?: File[];
  };
}

type UpdatePeriodicReportDialogProps = Except<
  DialogFormProps<UpdatePeriodicReportFormValues>,
  'onSubmit' | 'initialValues'
> & {
  report: Omit<PeriodicReportFragment, 'reportFile'> & { reportFile?: File[] };
  editFields?: Many<EditablePeriodicReportField>;
};

export const UpdatePeriodicReportDialog = ({
  report,
  editFields: editFieldsProp,
  ...props
}: UpdatePeriodicReportDialogProps) => {
  const editFields = useMemo(
    () => many(editFieldsProp ?? []),
    [editFieldsProp]
  );

  const updateReceivedDateOnly =
    editFields.includes('receivedDate') && !editFields.includes('reportFile');

  const updatePeriodicReport = useUpdatePeriodicReport();

  const initialValues = useMemo(() => {
    const receivedDate = report.receivedDate.value ?? null;
    const fullInitialValuesFields: Except<
      UpdatePeriodicReportFormValues['report'],
      'id'
    > = {
      reportFile: report.reportFile,
      receivedDate,
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
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
  }, [editFields, report.receivedDate, report.reportFile, report.id]);

  return (
    <DialogForm<UpdatePeriodicReportFormValues>
      title={`${updateReceivedDateOnly ? 'Update' : 'Upload'} Report`}
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      fieldsPrefix="report"
      initialValues={initialValues}
      // the only time this form will have an initial value for the file field is when adding a new version
      sendIfClean={Boolean(initialValues.report.reportFile)}
      onSubmit={async ({ report: { id, reportFile, receivedDate } }) =>
        await updatePeriodicReport(id, reportFile, receivedDate)
      }
    >
      <SubmitError />
      {!updateReceivedDateOnly ? <DropzoneField name="reportFile" /> : null}
      <DateField
        name="receivedDate"
        label="Received Date"
        required={!updateReceivedDateOnly}
        openTo="day"
      />
    </DialogForm>
  );
};
