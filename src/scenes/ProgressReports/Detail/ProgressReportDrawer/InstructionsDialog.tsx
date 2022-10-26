import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Typography,
} from '@mui/material';

export const InstructionsDialog = ({ open, onClose }: DialogProps) => {
  const handleCloseButtonClick = () => {
    onClose?.({}, 'backdropClick');
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogContent dividers>
        <Typography sx={{ mb: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit pharetra
          enim justo, molestie amet viverra faucibus. Egestas congue felis arcu.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit pharetra
          enim justo, molestie amet viverra faucibus. Egestas congue felis arcu.{' '}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit pharetra
          enim justo, molestie amet viverra faucibus. Egestas congue felis arcu.
        </Typography>
        <Typography sx={{ mb: 2 }}>Sensitivity Check list</Typography>
        <Typography sx={{ mb: 2 }}>
          Please check over your report to make sure there are no security
          concerns.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit pharetra
          enim justo, molestie amet viverra faucibus. Egestas congue felis arcu.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit pharetra
          enim justo, molestie amet viverra faucibus. Egestas congue felis arcu.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit pharetra
          enim justo, molestie amet viverra faucibus. Egestas congue felis arcu.
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
