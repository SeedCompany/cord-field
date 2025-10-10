import { useMutation } from '@apollo/client';
import { PersonOutlined as PersonIcon } from '@mui/icons-material';
import { Avatar, ButtonBase, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import { extendSx, square, StyleProps } from '~/common';
import { useUploadFileAsync } from '../files/hooks';
import { DropOverlay } from '../Upload/DropOverlay';
import { UpdateUserPhotoDocument } from './UpdateUserPhoto.graphql';
import { UserPhotoFragment } from './userPhoto.graphql';

const DEFAULT_SIZE = 150;
const ACCEPTED_IMAGE_TYPES = {
  'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
};

export interface UserPhotoProps extends StyleProps {
  user: UserPhotoFragment;
  size?: number;
}

export const UserPhoto = ({ user, size, ...rest }: UserPhotoProps) => {
  const { value: photo, canEdit } = user.photo;

  const uploadFile = useUploadFileAsync();
  const [updateUser] = useMutation(UpdateUserPhotoDocument);

  const handlePhotoUpload = async (file: File) => {
    try {
      const [uploadedPhoto, finalize] = await uploadFile(file);

      await updateUser({
        variables: {
          user: user.id,
          photo: uploadedPhoto,
        },
      }).then(...finalize.tap);
    } catch (e) {
      console.error(e);
      throw new Error('Could not upload image');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => {
      if (!canEdit) return;
      const file = files[0];
      if (file) {
        void handlePhotoUpload(file);
      }
    },
    disabled: !canEdit,
    multiple: false,
    accept: ACCEPTED_IMAGE_TYPES,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <Tooltip
      title={canEdit && !isDragActive ? 'Click or drag in photo' : undefined}
    >
      <ButtonBase
        component="label"
        {...getRootProps({
          disabled: !canEdit,
          ...rest,
          sx: [
            (theme) => ({
              borderRadius: '50%',
              '&.Mui-focusVisible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: '2px',
              },
            }),
            ...extendSx(rest.sx),
          ],
          href: '', // just to make TS happy
        })}
      >
        <DropOverlay
          isDragActive={isDragActive}
          sx={(theme) => ({
            borderRadius: 'inherit',
            inset: '-2px',
            border: 'none',
            outline: `2px solid ${theme.palette.primary.main}`,
            background: alpha(theme.palette.background.paper, 0.9),
            padding: 1,
          })}
        >
          {!photo ? 'Add profile photo' : 'Drop new photo to upload'}
        </DropOverlay>
        <Avatar
          src={photo?.url}
          sx={{
            ...square('2em'),
            fontSize: (size ?? DEFAULT_SIZE) / 2,
          }}
        >
          {user.avatarLetters ?? <PersonIcon fontSize="inherit" />}
        </Avatar>
        <input {...getInputProps()} name="user_photo_uploader" />
      </ButtonBase>
    </Tooltip>
  );
};
