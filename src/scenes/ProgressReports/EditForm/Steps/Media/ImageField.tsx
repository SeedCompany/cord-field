import {
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  MoreVert as TripleDotIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Fab,
  FabProps,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useId, useState } from 'react';
import { Sensitivity } from '~/api/schema.graphql';
import { extendSx, square, StyleProps } from '~/common';
import { DropzoneField, useSubmitButton } from '~/components/form';
import { SensitivityIcon } from '../../../../../components/Sensitivity';
import { VisualMediaFragment as VisualMedia } from './progressReportMedia.graphql';

export interface ImageFieldProps extends StyleProps {
  name: string;
  disabled?: boolean;
  sensitivity?: Sensitivity;
  current?: VisualMedia;
  canDelete: boolean;
  instructionMessage?: string;
}

export const ImageField = ({
  name,
  disabled,
  sensitivity,
  current,
  canDelete,
  instructionMessage,
  ...props
}: ImageFieldProps) => {
  return !current ? (
    <DropzoneField
      name={name}
      disabled={disabled}
      disableFileList
      {...props}
      accept={{ 'image/*': [] }}
      sx={[
        {
          m: 0,
          display: 'flex',
          flexDirection: 'column',
          '> *': {
            flex: 1,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          position: 'relative',
        },
        ...extendSx(props.sx),
      ]}
      label={
        <>
          <AddPhotoIcon sx={square(48)} />
          <div>{instructionMessage || 'Click or drop to add photo'}</div>
          {sensitivity && (
            <SensitivityIcon
              value={sensitivity}
              sx={{
                position: 'absolute',
                top: '2px',
                left: '2px',
              }}
            />
          )}
        </>
      }
    />
  ) : (
    <Box
      component="figure"
      {...props}
      sx={[
        {
          m: 0,
          position: 'relative',
        },
        ...extendSx(props.sx),
      ]}
    >
      {current.__typename === 'Image' ? (
        <Box
          component="img"
          src={current.url}
          crossOrigin="use-credentials"
          sx={{
            maxWidth: 1,
            borderRadius: 1,
          }}
        />
      ) : (
        <Card
          elevation={5}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 1,
            borderRadius: 1,
            aspectRatio: current.dimensions.aspectRatio,
          }}
        >
          <Typography variant="button">Not an image</Typography>
        </Card>
      )}
      {sensitivity && (
        <SensitivityIcon
          value={sensitivity}
          sx={(theme) => ({
            position: 'absolute',
            top: 0,
            left: 0,
            bgcolor: 'background.paper',
            borderEndEndRadius: theme.shape.borderRadius,
          })}
        />
      )}
      <MoreActionsButton
        size="small"
        sx={(theme) => ({
          position: 'absolute',
          top: theme.spacing(1),
          right: theme.spacing(1),
          bgcolor: theme.palette.background.paper,
        })}
      >
        <MenuItem
          component="a"
          href={current.url}
          download
          sx={{ underline: 'none' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.click();
            }
          }}
        >
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          Download
        </MenuItem>
        {canDelete && <DeleteImageMenuItem />}
      </MoreActionsButton>
    </Box>
  );
};

const DeleteImageMenuItem = () => {
  const sb = useSubmitButton({ action: 'delete' });
  return (
    <MenuItem onClick={sb.submit}>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

type MoreActionsButtonProps = FabProps;

export const MoreActionsButton = ({
  children,
  ...props
}: MoreActionsButtonProps) => {
  const id = useId();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Fab
        {...props}
        id={`image-button-${id}`}
        aria-label="more image actions"
        aria-controls={`image-menu-${id}`}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <TripleDotIcon />
      </Fab>
      <Menu
        id={`image-menu-${id}`}
        aria-labelledby={`image-button-${id}`}
        variant="menu"
        open={anchorEl !== null}
        anchorEl={anchorEl}
        keepMounted
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleClose}
        onClick={handleClose}
        onKeyDownCapture={(e) => {
          if (e.key === 'Enter') {
            setTimeout(() => handleClose(), 0);
            return;
          }
        }}
      >
        {children}
      </Menu>
    </>
  );
};
