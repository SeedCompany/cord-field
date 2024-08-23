import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';

export const PnPExtractionResultDialog = ({
  children,
  ...props
}: DialogProps) => (
  <Dialog {...props} aria-labelledby="result-dialog-title" maxWidth="md">
    <DialogTitle id="result-dialog-title" sx={{ pb: 0 }}>
      Problems
    </DialogTitle>
    <DialogContent dividers sx={{ p: 0, borderTop: 'none' }}>
      {children}
    </DialogContent>
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
