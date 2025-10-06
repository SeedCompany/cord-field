import { useMutation } from '@apollo/client';
import { PersonOutlined as PersonIcon } from '@mui/icons-material';
import { Avatar, Box, Card, CardActionArea, Tooltip } from '@mui/material';
import { forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Maybe } from '~/api/schema.graphql';
import { SecuredProp, StyleProps } from '~/common';
import { useUploadFileAsync } from '../files/hooks';
import { DropOverlay } from '../Upload/DropOverlay';
import { UpdateUserPhotoDocument } from './UpdateUserPhoto.graphql';

interface PhotoFile {
  url: string;
}

const DEFAULT_SIZE = 150;
const ACCEPTED_IMAGE_TYPES = {
  'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
};

export interface UserPhotoProps extends StyleProps {
  securedPhoto: SecuredProp<PhotoFile | null>;
  userId: string;
  avatarLetters?: Maybe<string>;
}

export const UserPhoto = forwardRef<any, UserPhotoProps>(function UserPhoto(
  props,
  ref
) {
  const { securedPhoto, userId, avatarLetters, ...rest } = props;

  const { value: photo, canRead, canEdit } = securedPhoto;

  const uploadFile = useUploadFileAsync();
  const [updateUser] = useMutation(UpdateUserPhotoDocument);

  const handlePhotoUpload = async (file: File) => {
    if (!canEdit) return;

    try {
      const [uploadedPhoto, finalize] = await uploadFile(file);

      await updateUser({
        variables: {
          input: {
            user: {
              id: userId,
              photo: uploadedPhoto,
            },
          },
        },
        refetchQueries: ['User'],
      }).then(...finalize.tap);
    } catch (e) {
      console.error(e);
      throw new Error('Could not upload image');
    }
  };

  const onPhotoUpload = (files: File[]) => {
    if (files.length > 0 && files[0]) {
      void handlePhotoUpload(files[0]);
    }
  };

  const isDisabled = (photo && !canRead) || (!photo && !canEdit);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onPhotoUpload,
    disabled: isDisabled,
    multiple: false,
    accept: ACCEPTED_IMAGE_TYPES,
    noClick: false,
    noKeyboard: false,
  });

  const photoUrl = photo?.url;

  return (
    <Card
      {...getRootProps()}
      sx={{
        position: 'relative',
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
        borderRadius: '50%',
      }}
    >
      <input {...getInputProps()} name="user_photo_uploader" />
      <DropOverlay
        isDragActive={isDragActive}
        sx={{
          borderRadius: '50%',
          inset: 0,
        }}
      >
        {!photo ? 'Add profile photo' : 'Drop new photo to upload'}
      </DropOverlay>
      <Tooltip title={canEdit ? 'Click or drag in photo' : undefined}>
        <CardActionArea
          {...rest}
          ref={ref}
          disabled={isDisabled}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {!photo ? (
            <Avatar
              sx={{
                width: '100%',
                height: '100%',
                fontSize: 70,
              }}
            >
              {avatarLetters ? (
                avatarLetters
              ) : (
                <PersonIcon fontSize="inherit" />
              )}
            </Avatar>
          ) : (
            <Box
              component="img"
              src={photoUrl}
              alt="Profile photo"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </CardActionArea>
      </Tooltip>
    </Card>
  );
});
