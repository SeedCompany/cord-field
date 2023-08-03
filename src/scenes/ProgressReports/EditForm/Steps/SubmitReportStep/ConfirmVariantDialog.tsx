import { DialogContent, DialogProps, Typography } from '@mui/material';
import { Fragment } from 'react';
import { DialogForm } from '~/components/Dialog/DialogForm';
import { useProgressReportContext } from '../../ProgressReportContext';

interface ConfirmEmptyVariantsProps extends DialogProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmEmptyVariants = ({
  open,
  onConfirm,
  onClose,
}: ConfirmEmptyVariantsProps) => {
  const { stepsMissingData } = useProgressReportContext();

  return (
    <DialogForm
      open={open}
      title="Are you sure you want to submit report?"
      submitLabel="Confirm"
      closeLabel="Cancel"
      SubmitProps={{ color: 'primary' }}
      onSubmit={onConfirm}
      onClose={onClose}
      sendIfClean
    >
      <DialogContent dividers sx={{ ul: { paddingInlineStart: 3 } }}>
        <Typography paragraph>
          The following was not updated or left blank:
        </Typography>
        {Object.entries(stepsMissingData).map(([title, steps], index) => (
          <Fragment key={index}>
            <Typography id={title}>{title.toUpperCase()}</Typography>
            {steps.map(([label]) => (
              <Typography component="ul" id={label} key={label}>
                {label}
              </Typography>
            ))}
            <p />
          </Fragment>
        ))}
      </DialogContent>
    </DialogForm>
  );
};
