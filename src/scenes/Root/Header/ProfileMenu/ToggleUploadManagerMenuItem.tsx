import { MenuItem, MenuItemProps } from '@mui/material';
import { useUpload } from '../../../../components/Upload';

export const ToggleUploadManagerMenuItem = (props: MenuItemProps) => {
  const { isManagerOpen, toggleManagerOpen } = useUpload();
  return (
    <MenuItem
      onClick={(event) => {
        toggleManagerOpen();
        props.onClick?.(event);
      }}
    >
      {(isManagerOpen ? 'Hide' : 'Show') + ' Upload Manager'}
    </MenuItem>
  );
};
