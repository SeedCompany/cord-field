import { DoneOutlineRounded as CheckmarkIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Typography,
} from '@mui/material';

export const SuccessDialog = (props: DialogProps) => (
  <Dialog {...props}>
    <DialogContent sx={{ textAlign: 'center' }}>
      <CheckmarkIcon
        fontSize="large"
        color="success"
        sx={{ mb: 2 }}
        aria-label="success"
      />
      <Typography>Thank you for submitting your report</Typography>
    </DialogContent>
    <DialogActions>
      <Button
        color="secondary"
        onClick={() => props.onClose?.({}, 'backdropClick')}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
