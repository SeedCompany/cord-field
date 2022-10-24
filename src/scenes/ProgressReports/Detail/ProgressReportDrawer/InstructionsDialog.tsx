import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';

export const InstructionsDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <div>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit
            pharetra enim justo, molestie amet viverra faucibus. Egestas congue
            felis arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Elit pharetra enim justo, molestie amet viverra faucibus. Egestas
            congue felis arcu.{' '}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit
            pharetra enim justo, molestie amet viverra faucibus. Egestas congue
            felis arcu.
          </Typography>
          <Typography sx={{ mb: 2 }}>Sensitivity Check list</Typography>
          <Typography sx={{ mb: 2 }}>
            Please check over your report to make sure there are no security
            concerns.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit
            pharetra enim justo, molestie amet viverra faucibus. Egestas congue
            felis arcu.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit
            pharetra enim justo, molestie amet viverra faucibus. Egestas congue
            felis arcu.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit
            pharetra enim justo, molestie amet viverra faucibus. Egestas congue
            felis arcu.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
