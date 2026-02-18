import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdatePeriodicReport as UpdatePeriodicReportInput } from '~/api/schema.graphql';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  SubmitAction,
  SubmitButton,
  SubmitError,
  TextField,
} from '../../../components/form';
import { PeriodicReportFragment } from '../../../components/PeriodicReports/PeriodicReport.graphql';
import { useUpdatePeriodicReport } from '../../../components/PeriodicReports/Upload/useUpdatePeriodicReport';

type SkipPeriodicReportFormValues = Pick<
  UpdatePeriodicReportInput,
  'skippedReason'
> &
  SubmitAction<'unskip'>;

export type SkipPeriodicReportDialogProps = Except<
  DialogFormProps<SkipPeriodicReportFormValues>,
  'onSubmit' | 'initialValues'
> & {
  report: Pick<PeriodicReportFragment, 'id' | 'skippedReason'>;
};

export const SkipPeriodicReportDialog = ({
  report,
  ...props
}: SkipPeriodicReportDialogProps) => {
  const updatePeriodicReport = useUpdatePeriodicReport();

  const initialValues = useMemo(
    () => ({
      skippedReason: report.skippedReason.value,
    }),
    [report.skippedReason]
  );

  return (
    <DialogForm<SkipPeriodicReportFormValues>
      {...props}
      title={`${
        report.skippedReason.value ? 'Edit Skip Reason' : 'Skip Report'
      }`}
      initialValues={initialValues}
      sendIfClean="unskip"
      onSubmit={async ({ skippedReason, submitAction }) => {
        await updatePeriodicReport(
          report.id,
          undefined,
          undefined,
          submitAction === 'unskip' ? null : skippedReason ?? null
        );
      }}
      leftAction={
        report.skippedReason.value ? (
          <SubmitButton
            action="unskip"
            color="secondary"
            fullWidth={false}
            variant="text"
          >
            Unskip
          </SubmitButton>
        ) : null
      }
    >
      <SubmitError />
      <TextField
        name="skippedReason"
        label="Reason"
        placeholder="Why is this report being skipped?"
        multiline
        minRows={2}
      />
    </DialogForm>
  );
};
