import { MenuItem, MenuItemProps } from '@mui/material';
import { useDialog } from '../../../../components/Dialog';
import { ChangePassword } from '../../../Authentication';

export const ChangePasswordMenuItem = (props: MenuItemProps) => {
  const [state, changePassword] = useDialog();
  return (
    <>
      <MenuItem
        onClick={(event) => {
          changePassword();
          props.onClick?.(event);
        }}
      >
        Change Password
      </MenuItem>
      <ChangePassword {...state} />
    </>
  );
};
