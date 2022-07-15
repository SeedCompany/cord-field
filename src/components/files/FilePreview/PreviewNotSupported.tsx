import { CloudDownload } from '@mui/icons-material';
import { Button, ModalProps, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { NonDirectoryActionItem } from '../FileActions';
import { useDownloadFile } from '../hooks';

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
  file,
  onClose,
}: {
  file: NonDirectoryActionItem;
  onClose?: ModalProps['onClose'];
}) => {
  const { classes } = useStyles();
  const download = useDownloadFile();
  return (
    <div className={classes.container}>
      <Typography variant="h3" paragraph className={classes.text}>
        Previewing is not supported
        <br />
        for this file type
      </Typography>
      <Button
        color="primary"
        size="large"
        startIcon={<CloudDownload />}
        onClick={() =>
          void download(file).then(() => onClose?.({}, 'backdropClick'))
        }
      >
        Download
      </Button>
    </div>
  );
};
