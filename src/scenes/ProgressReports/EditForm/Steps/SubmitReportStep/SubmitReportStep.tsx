import { Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { defer } from '~/common/defer';
import {
  explosionFromElement,
  randomColorPalette,
  useConfetti,
} from '~/components/Confetti';
import { RichTextField } from '~/components/RichText';
import { useProgressReportContext } from '../../ProgressReportContext';
import { StepComponent } from '../../Steps';
import { TransitionButtons } from '../../Steps/SubmitReportStep/TransitionButtons';
import {
  TransitionFormValues,
  useExecuteTransition,
} from '../../Steps/SubmitReportStep/useExecuteTransition';
import { ConfirmIncompleteSubmissionDialog } from './ConfirmIncompleteSubmissionDialog';
import { ProgressReportStatusFragment } from './ProgressReportStatus.graphql';

export const SubmitReportStep: StepComponent = ({ report }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const createConfetti = useConfetti();
  const lastSubmitButton = useRef<HTMLElement>();

  // Maintain the old status state while closing the drawer.
  // Prevents a flash of the new status before the drawer closes.
  const [prevStatus, setPrevStatus] = useState<ProgressReportStatusFragment>();

  const { incompleteSteps } = useProgressReportContext();
  const isIncomplete = Object.keys(incompleteSteps).length;
  const onConfirmRef = useRef<((confirm: boolean) => void) | undefined>();

  const executeTransition = useExecuteTransition({
    id: report.id,
    before: () => {
      setPrevStatus(report.status);
    },
    after: (values) => {
      const transition = report.status.transitions.find(
        (transition) => transition.id === values.submitAction
      );
      const buttonEl = lastSubmitButton.current;

      if (transition?.type === 'Approve' && buttonEl) {
        const confettiOptions = {
          ...explosionFromElement(buttonEl),
          colors: randomColorPalette(),
        };
        createConfetti(confettiOptions);
        setTimeout(() => navigate('..'), confettiOptions.tweenDuration);
      } else {
        enqueueSnackbar('Report submitted — Thanks!', {
          variant: 'success',
        });
        navigate('..');
      }
    },
  });

  const handleFormSubmit = async (values: TransitionFormValues) => {
    const transition = report.status.transitions.find(
      (transition) => transition.id === values.submitAction
    );
    const isApprovalTransition = transition?.type === 'Approve';
    if (isApprovalTransition && isIncomplete) {
      const confirming = defer<boolean>();
      onConfirmRef.current = confirming.resolve;
      const confirmed = await confirming;
      onConfirmRef.current = undefined;
      if (!confirmed) {
        return {};
      }
    }
    await executeTransition(values);
  };

  return (
    <Form<TransitionFormValues> onSubmit={handleFormSubmit}>
      {({ handleSubmit }) => (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 'sm', mx: 'auto' }}
        >
          <Typography variant="h3" paragraph>
            Submit Report
          </Typography>
          <RichTextField
            name="notes"
            label="Final Notes"
            placeholder="Optional: Audience - internal - Share additional information related to the team or language engagement not covered in the Quarterly Report with Seed Co team members"
          />
          <Typography align="center" paragraph>
            To complete this report, please choose the next action
          </Typography>
          <Box maxWidth={450} mx="auto">
            <TransitionButtons
              status={prevStatus ?? report.status}
              onClick={(event) => {
                lastSubmitButton.current = event.currentTarget;
              }}
            />
          </Box>
          <ConfirmIncompleteSubmissionDialog
            open={!!onConfirmRef.current}
            onSubmit={() => onConfirmRef.current?.(true)}
            onClose={() => onConfirmRef.current?.(false)}
          />
        </Box>
      )}
    </Form>
  );
};

SubmitReportStep.enableWhen = ({ report }) =>
  report.status.canBypassTransitions || report.status.transitions.length > 0;
