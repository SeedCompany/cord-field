import { useMutation } from '@apollo/client';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Form } from 'react-final-form';
import { labelFrom } from '~/common';
import {
  ProgressVarianceReason,
  ProgressVarianceReasonGroups,
  ProgressVarianceReasonLabels,
} from '../../../api';
import {
  SelectField,
  SubmitButton,
  SubmitError,
  TextField,
} from '../../../components/form';
import { UpdateProgressReportDocument as UpdatePeriodicReport } from '../../../components/PeriodicReports/Upload/UpdatePeriodicReport.graphql';
import { ExplanationOfVarianceFormFragment as ProgressReport } from './ExplanationForm.graphql';

const useStyles = makeStyles(() => ({
  saveButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export interface UpdateExplanationFormParams {
  progressReport?: ProgressReport;
  setState: (isEditing: boolean) => void;
}

interface FormValues {
  varianceReasons?: ProgressVarianceReason[];
  varianceExplanation?: string;
  id: string;
}

export const ExplanationForm = ({
  progressReport,
  setState,
}: UpdateExplanationFormParams) => {
  console.log(setState);
  const classes = useStyles();
  const [updateProgressReport] = useMutation(UpdatePeriodicReport);

  const [selected, setSelected] = React.useState('');

  const changedSelectOptionHandler = (event: any) => {
    setSelected(event.target.value);
  };

  const statusGroups = Object.keys(ProgressVarianceReasonGroups);

  const reasons = selected ? ProgressVarianceReasonGroups[selected]! : [];

  const submit = async (values: FormValues) => {
    await updateProgressReport({
      variables: {
        input: {
          varianceExplanation: values.varianceExplanation,
          varianceReasons: values.varianceReasons,
          id: values.id,
        },
      },
    });
    setState(false);
  };

  return (
    <Form
      onSubmit={submit}
      initialValues={{
        varianceReasons: progressReport?.varianceReasons,
        varianceExplanation: progressReport?.varianceExplanation,
        id: progressReport?.id,
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <SubmitError />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <SelectField
                label="Choose a Status"
                name="status"
                options={statusGroups}
                onChange={changedSelectOptionHandler}
              />
            </Grid>
            <Grid item xs={8}>
              {reasons.length > 0 && (
                <SelectField
                  label="Choose an Explanation"
                  name="varianceReasons"
                  options={reasons}
                  getOptionLabel={labelFrom(ProgressVarianceReasonLabels)}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="varianceExplanation"
                label="OPTIONAL COMMENTS"
                multiline
                inputProps={{ rowsMin: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={10} />
              <Grid item xs={2}>
                <SubmitButton
                  color="primary"
                  size="medium"
                  fullWidth={false}
                  disableElevation
                >
                  Save
                </SubmitButton>
              </Grid>
            </Grid>
            {/* putting this here to pass in the id through the Form element */}
            <input name="id" value={progressReport?.id} type="hidden" />
          </Grid>
        </form>
      )}
    </Form>
  );
};

export const ExplanationInfo = ({
  progressReport,
}: UpdateExplanationFormParams) => {
  return <Typography>{progressReport?.varianceReasons}</Typography>;
};
