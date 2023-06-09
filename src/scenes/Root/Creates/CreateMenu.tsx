import { ButtonProps, Menu, MenuItem, MenuProps } from '@mui/material';
import { startCase } from 'lodash';
import { useContext, useState } from 'react';
import { Power } from '~/api/schema.graphql';
import { CreateButton } from '../../../components/CreateButton';
import { useSession } from '../../../components/Session';
import { CreateItemContext } from './CreateDialogProviders';
import { creates } from './Creates';

export interface CreateButtonMenuProps extends ButtonProps {
  MenuProps?: MenuProps;
}

export const CreateButtonMenu = (props: CreateButtonMenuProps) => {
  const { MenuProps, ...rest } = props;

  const { powers } = useSession();
  const openDialog = useContext(CreateItemContext);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const openAddMenu = (e: any) => setAnchorEl(e.currentTarget);
  const closeAddMenu = () => setAnchorEl(null);
  const openCreate = (power: Power) => () => {
    closeAddMenu();
    openDialog(power);
  };

  const allowed = creates.filter(([power]) => powers?.includes(power));

  if (allowed.length === 0) {
    return null;
  }

  return (
    <>
      <CreateButton
        aria-controls="create-menu"
        aria-haspopup="true"
        // startIcon={<Add />}
        onClick={openAddMenu}
        {...rest}
      >
        Add Item
      </CreateButton>
      <Menu
        id="create-menu"
        open={anchorEl !== null}
        anchorEl={anchorEl}
        keepMounted
        onClose={closeAddMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        {...MenuProps}
      >
        {allowed.map(([power, _, maybeLabel]) => (
          <MenuItem key={power} onClick={openCreate(power)}>
            {maybeLabel ?? startCase(power.replace('Create', ''))}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
