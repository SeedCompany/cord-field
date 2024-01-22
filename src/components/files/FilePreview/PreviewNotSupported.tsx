import { CloudDownload } from '@mui/icons-material';
import { Button, ModalProps, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(({ spacing }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: spacing(4),
    textAlign: 'center',
  },
  text: {
    lineHeight: 1.5,
  },
}));

export const PreviewNotSupported = ({
  fileUrl,
  onClose,
}: {
  fileUrl: string;
  onClose?: ModalProps['onClose'];
}) => {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h3" paragraph className={classes.text}>
        Previewing is not supported
        <br />
        for this file type
      </Typography>
      <Button
        href={fileUrl}
        color="primary"
        size="large"
        startIcon={<CloudDownload />}
        onClick={() => onClose?.({}, 'backdropClick')}
      >
        Download
      </Button>
    </div>
  );
};
