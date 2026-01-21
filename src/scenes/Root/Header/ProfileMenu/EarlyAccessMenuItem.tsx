import { MenuItem, MenuItemProps } from '@mui/material';
import { useDialog } from '../../../../components/Dialog';
import { EarlyAccessDialog } from '../../../EarlyAccess/EarlyAccess';

export const EarlyAccessMenuItem = (props: MenuItemProps) => {
  const [state, open] = useDialog();
  return (
    <>
      <MenuItem
        onClick={(event) => {
          open();
          props.onClick?.(event);
        }}
      >
        Early Access Features
      </MenuItem>
      <EarlyAccessDialog {...state} />
    </>
  );
};
