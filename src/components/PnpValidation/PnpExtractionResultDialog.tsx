import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
} from '@mui/material';

export const PnPExtractionResultDialog = ({
  children,
  ...props
}: DialogProps) => (
  <Dialog {...props} aria-labelledby="result-dialog-title" maxWidth="md">
    <DialogTitle id="result-dialog-title">Problems</DialogTitle>
    {children}
    <DialogActions>
      <Button
        onClick={() => props.onClose?.({}, 'backdropClick')}
        variant="text"
        color="secondary"
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
