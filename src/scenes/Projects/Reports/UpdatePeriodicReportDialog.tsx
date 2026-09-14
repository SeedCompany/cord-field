import { many, Many } from '@seedcompany/common';
import { pick } from 'lodash';
import { useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import { UpdatePeriodicReport as UpdatePeriodicReportInput } from '~/api/schema.graphql';
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
import {
  dateFieldFor,
  PeriodicReportEditShape,
  PeriodicReportFileField,
} from '../../../components/PeriodicReports/fileField';
import { useUpdatePeriodicReport } from '../../../components/PeriodicReports/Upload/useUpdatePeriodicReport';

export type EditablePeriodicReportField = ExtractStrict<
  keyof UpdatePeriodicReportInput,
  // Add more fields here as needed
  | 'receivedDate'
  | 'narrativeReceivedDate'
  | 'reportFile'
  | 'narrativeFile'
  | 'skippedReason'
>;

type UpdatePeriodicReportFormValues = Merge<
  UpdatePeriodicReportInput,
  {
    reportFile?: File[];
    narrativeFile?: File[];
  }
>;

type UpdatePeriodicReportDialogProps = Except<
  DialogFormProps<UpdatePeriodicReportFormValues>,
  'onSubmit' | 'initialValues'
> & {
  report: PeriodicReportEditShape;
  editFields?: Many<EditablePeriodicReportField>;
  fileField?: PeriodicReportFileField;
};

export const UpdatePeriodicReportDialog = ({
  report,
  editFields: editFieldsProp,
  fileField = 'reportFile',
  ...props
}: UpdatePeriodicReportDialogProps) => {
  const editFields = useMemo(
    () => many(editFieldsProp ?? []),
    [editFieldsProp]
  );

  const dateField = dateFieldFor(fileField);

  const updateReceivedDateOnly =
    editFields.includes(dateField) && !editFields.includes(fileField);

  const updatePeriodicReport = useUpdatePeriodicReport(fileField);

  const initialValues = useMemo(() => {
    const date = report[dateField].value ?? null;
    const fullInitialValuesFields: Except<
      UpdatePeriodicReportFormValues,
      'id'
    > = {
      reportFile: Array.isArray(report.reportFile)
        ? report.reportFile
        : undefined,
      narrativeFile: Array.isArray(report.narrativeFile)
        ? report.narrativeFile
        : undefined,
      [dateField]: date,
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
    const filteredInitialValuesFields = pick(
      fullInitialValuesFields,
      editFields
    );
    return {
      id: report.id,
      ...filteredInitialValuesFields,
    };
  }, [editFields, dateField, report]);

  const incomingFile = initialValues[fileField];

  return (
    <DialogForm<UpdatePeriodicReportFormValues>
      title={`${updateReceivedDateOnly ? 'Update' : 'Upload'} Report`}
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      initialValues={initialValues}
      // the only time this form will have an initial value for the file field is when adding a new version
      sendIfClean={Boolean(incomingFile)}
      onSubmit={async (values) => {
        const file = values[fileField];
        const date = values[dateField];
        await updatePeriodicReport(values.id, file, date);
      }}
    >
      <SubmitError />
      {!updateReceivedDateOnly ? <DropzoneField name={fileField} /> : null}
      <DateField
        name={dateField}
        label="Received Date"
        required={!updateReceivedDateOnly}
        openTo="day"
      />
    </DialogForm>
  );
};
