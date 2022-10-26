import { Clear as ClearIcon } from '@mui/icons-material';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Except } from 'type-fest';
import { fileIcon } from '../files/fileTypes';
import { FieldConfig, useField } from './useField';

const dropzoneHoverStyle = {
  backgroundColor: 'grey.200',
  borderColor: 'primary.main',
};

export type DropzoneFieldProps = Except<FieldConfig<File, true>, 'multiple'> & {
  label?: string;
  multiple?: boolean;
  className?: string;
};

export function DropzoneField({
  multiple = false,
  label = 'Click or drag files here',
  name: nameProp,
  className,
}: DropzoneFieldProps) {
  const {
    input: { name, onChange, value: currentFiles },
  } = useField<File, true, HTMLInputElement>({
    name: nameProp,
    multiple: true, // always list for FF
  });

  const onDrop = (acceptedFiles: File[]) => {
    const updatedFiles =
      // If no files are accepted, we want to leave the existing ones in place
      acceptedFiles.length === 0
        ? currentFiles
        : // If we allow multiples, we want to add all new files
        // to the existing ones. If not, we will overwrite.
        // `react-dropzone` won't accept more than one file if
        // `multiple` is false.
        multiple
        ? currentFiles.concat(acceptedFiles)
        : acceptedFiles;
    onChange(updatedFiles);
  };

  const handleRemoveFileClick = (index: number) => {
    const updatedFiles = currentFiles
      .slice(0, index)
      .concat(currentFiles.slice(index + 1));
    onChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    onDrop,
  });

  return (
    <Box className={className} sx={{ mb: 2 }}>
      <Box
        sx={[
          {
            backgroundColor: 'grey.300',
            border: `2px dashed`,
            borderColor: 'divider',
            cursor: 'pointer',
            p: 3,
            '&:hover': dropzoneHoverStyle,
          },
          isDragActive && dropzoneHoverStyle,
        ]}
        {...getRootProps()}
      >
        <input {...getInputProps()} name={name} />
        <Typography
          variant="h4"
          sx={{ color: 'text.secondary', textAlign: 'center' }}
        >
          {label}
        </Typography>
      </Box>
      {currentFiles.length > 0 && (
        <List dense sx={{ pb: 0 }}>
          {currentFiles.map((file, index) => {
            const { name, type } = file;
            const Icon = fileIcon(type);
            return (
              <ListItem key={index}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    size="small"
                    onClick={() => handleRemoveFileClick(index)}
                  >
                    <ClearIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
