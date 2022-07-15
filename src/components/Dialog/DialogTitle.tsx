import { Cancel } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  DialogTitle as MuiDialogTitle,
  Typography,
} from '@mui/material';

export interface DialogTitleProps {
  id?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const DialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <>
      <MuiDialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 3,
        }}
        {...other}
      >
        <Typography variant="h4">{children}</Typography>
        {onClose ? (
          <IconButton size="small" aria-label="close" onClick={onClose}>
            <Cancel />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
      <Divider />
    </>
  );
};
