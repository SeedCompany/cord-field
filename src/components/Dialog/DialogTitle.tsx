import { Cancel } from '@mui/icons-material';
import {
  IconButton,
  DialogTitle as MuiDialogTitle,
  DialogTitleProps as MuiDialogTitleProps,
} from '@mui/material';
import { extendSx } from '../../common';

export interface DialogTitleProps extends MuiDialogTitleProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const DialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle
      variant="h4"
      {...other}
      sx={[
        ({ palette }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `thin solid ${palette.divider}`,
          pr: '16px', // match top
        }),
        ...extendSx(props.sx),
      ]}
    >
      {children}
      {onClose ? (
        <IconButton size="small" aria-label="close" onClick={onClose}>
          <Cancel />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};
