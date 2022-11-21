import { DoneOutline } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Typography,
} from '@mui/material';

export const SuccessDialog = ({ open, onClose }: DialogProps) => {
  const handleCloseButtonClick = () => {
    onClose?.({}, 'backdropClick');
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        borderRadius: 0,
      }}
      PaperProps={{ square: true }}
    >
      <DialogContent dividers>
        <DoneOutline color="success" sx={{ mb: 2 }} />
        <Typography sx={{ mb: 2 }}>Success</Typography>
        <Typography sx={{ mb: 2 }}>
          Thank you for submitting your report.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseButtonClick}
          variant="text"
          sx={{ color: 'gray' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
