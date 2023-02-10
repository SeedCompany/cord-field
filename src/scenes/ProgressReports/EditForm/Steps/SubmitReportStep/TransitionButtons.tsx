import { ButtonProps, Divider, Tooltip } from '@mui/material';
import { Fragment } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { ProgressReportStatus as Status } from '~/api/schema/schema.graphql';
import { transitionTypeStyles } from '~/common/transitionTypeStyles';
import { SubmitButton } from '~/components/form';
import { ProgressReportEditFragment } from '../../ProgressReportEdit.graphql';
import { BypassButton } from './BypassButton';

interface TransitionButtonsProps extends Pick<ButtonProps, 'size' | 'onClick'> {
  report: ProgressReportEditFragment;
}

export const TransitionButtons = ({
  report,
  size,
  onClick,
}: TransitionButtonsProps) => {
  const form = useForm();
  const {
    submitting,
    submitSucceeded,
    values: { bypassStatus },
  } = useFormState({
    subscription: {
      submitting: true,
      submitSucceeded: true,
      values: true,
    },
  });

  const setBypassStatus = (status: Status | undefined) =>
    form.change('bypassStatus', status);

  const transitionDivider = (
    <Divider variant="middle" sx={{ my: 1, color: 'text.secondary' }}>
      or
    </Divider>
  );
  return (
    <>
      {report.status.transitions
        .slice()
        .reverse()
        .map(({ id, type, label, to }, index) => (
          <Fragment key={id}>
            {index > 0 && transitionDivider}
            <Tooltip
              title={
                !submitting &&
                !submitSucceeded &&
                `This will change the report to ${StatusLabels[to]}`
              }
            >
              {/* Span because disabled button doesn't emit blur event for tooltip */}
              <span>
                <SubmitButton
                  size={size ?? 'medium'}
                  {...transitionTypeStyles[type]}
                  action={id}
                  onClick={onClick}
                >
                  {label}
                </SubmitButton>
              </span>
            </Tooltip>
          </Fragment>
        ))}
      {report.status.canBypassTransitions && (
        <>
          {report.status.transitions.length > 0 && transitionDivider}
          <BypassButton
            value={bypassStatus}
            onChange={setBypassStatus}
            disabled={submitting}
          />
        </>
      )}
    </>
  );
};
