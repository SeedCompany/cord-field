import { useMutation } from '@apollo/client';
import { Divider, Tooltip, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Fragment } from 'react';
import { Form } from 'react-final-form';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { Scalars } from '~/api/schema/schema.graphql';
import { transitionTypeStyles } from '~/common/transitionTypeStyles';
import { SubmitAction, SubmitButton } from '~/components/form';
import { RichTextField } from '~/components/RichText';
import { useNavigate } from '~/components/Routing';
import { useProgressReportContext } from '../../ProgressReportContext';
import { TransitionProgressReportDocument } from './TransitionProgressReport.graphql';

interface FormValues extends SubmitAction {
  notes: Scalars['RichText'];
}

export const SubmitReportStep = () => {
  const { report } = useProgressReportContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [executeTransition] = useMutation(TransitionProgressReportDocument);

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

    enqueueSnackbar('Report submitted — Thanks!', {
      variant: 'success',
    });
    navigate('..');
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
        </form>
      )}
    </Form>
  );
};
