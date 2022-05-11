import { useMutation } from '@apollo/client';
import { Grid } from '@material-ui/core';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { ExtractStrict, labelFrom } from '~/common';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import {
  ProgressVarianceReasonLabels,
  ProgressVarianceReasonList,
  UpdateProgressReportInput,
} from '../../../api';
import {
  SecuredField,
  SelectField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { UpdateProgressReportDocument as UpdatePeriodicReport } from '../../../components/PeriodicReports/Upload/UpdatePeriodicReport.graphql';
import { ExplanationOfVarianceFormFragment as ProgressReport } from './ExplanationForm.graphql';

export type EditableExplanationField = ExtractStrict<
  keyof UpdateProgressReportInput,
  'varianceReasons' | 'varianceExplanation'
>;

export interface UpdateExplanationFormParams {
  progressReport: ProgressReport;
}

export type UpdateVarianceFormProps = Except<
  DialogFormProps<UpdateProgressReportInput>,
  'onSubmit' | 'initialValues'
> &
  UpdateExplanationFormParams;

export const ExplanationForm = ({
  progressReport,
  ...props
}: UpdateVarianceFormProps) => {
  const [updateProgressReport] = useMutation(UpdatePeriodicReport);

  const initialValues = useMemo(
    () => ({
      progressReport: {
        id: progressReport.id,
        varianceExplanation: progressReport.varianceExplanation.value,
        varianceReasons: progressReport.varianceReasons.value,
      },
    }),
    [progressReport]
  );

  return (
    <DialogForm<UpdateProgressReportInput>
      {...props}
      title={`Update Variance`}
      initialValues={initialValues.progressReport}
      onSubmit={async (input) => {
        await updateProgressReport({ variables: { input } });
      }}
    >
      <SubmitError />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SecuredField obj={progressReport} name="varianceReasons">
            {(props) => (
              <SelectField
                {...props}
                label="Reasons for Variance"
                multiple
                options={ProgressVarianceReasonList}
                getOptionLabel={labelFrom(ProgressVarianceReasonLabels)}
              />
            )}
          </SecuredField>
        </Grid>
        <Grid item xs={12}>
          <SecuredField obj={progressReport} name="varianceExplanation">
            {(props) => (
              <TextField {...props} label="Explanation of Variance" />
            )}
          </SecuredField>
        </Grid>
      </Grid>
    </DialogForm>
  );
};
