import { CloudDownload } from '@mui/icons-material';
import { Box, Button, ModalProps, Typography } from '@mui/material';
import { NonDirectoryActionItem } from '../FileActions';
import { useDownloadFile } from '../hooks';

export const PreviewNotSupported = ({
  file,
  onClose,
}: {
  file: NonDirectoryActionItem;
  onClose?: ModalProps['onClose'];
}) => {
  const download = useDownloadFile();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        m: 4,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h3"
        paragraph
        sx={{
          lineHeight: 1.5,
        }}
      >
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
    </Box>
  );
};
