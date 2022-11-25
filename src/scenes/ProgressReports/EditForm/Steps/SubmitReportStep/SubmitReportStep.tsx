import { useMutation } from '@apollo/client';
import { Divider, Tooltip, Typography } from '@mui/material';
import { Fragment } from 'react';
import { Form } from 'react-final-form';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { Scalars } from '~/api/schema/schema.graphql';
import { transitionTypeStyles } from '~/common/transitionTypeStyles';
import { useDialog } from '~/components/Dialog';
import { SubmitAction, SubmitButton } from '~/components/form';
import { RichTextField } from '~/components/RichText';
import { useProgressReportContext } from '../../ProgressReportContext';
import { SuccessDialog } from './SuccessDialog';
import { TransitionProgressReportDocument } from './TransitionProgressReport.graphql';

interface FormValues extends SubmitAction {
  notes: Scalars['RichText'];
}

export const SubmitReportStep = () => {
  const { report } = useProgressReportContext();

  const [executeTransition] = useMutation(TransitionProgressReportDocument);
  const [successState, showSuccess] = useDialog();

  const onSubmit = async (values: FormValues) => {
    await executeTransition({
      variables: {
        input: {
          report: report.id,
          transition: values.submitAction,
          notes: values.notes,
        },
      },
    });

    showSuccess();
  };

  const transitionDivider = (
    <Divider variant="middle" sx={{ my: 1, color: 'text.secondary' }}>
      or
    </Divider>
  );
  return (
    <Form<FormValues> onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Typography variant="h3" paragraph>
            Submit Report
          </Typography>
          <RichTextField name="notes" label="Final Notes" />
          <Typography align="center" paragraph>
            To complete this report, please choose the next action
          </Typography>
          {report.status.transitions.map(({ id, type, label, to }, index) => (
            <Fragment key={id}>
              {index > 0 && transitionDivider}
              <Tooltip
                title={`This will change the report to ${StatusLabels[to]}`}
              >
                <SubmitButton
                  size="medium"
                  {...transitionTypeStyles[type]}
                  action={id}
                >
                  {label}
                </SubmitButton>
              </Tooltip>
            </Fragment>
          ))}
          <SuccessDialog {...successState} />
        </form>
      )}
    </Form>
  );
};
