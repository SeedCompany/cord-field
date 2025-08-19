import { Add } from '@mui/icons-material';
import { Button, ButtonProps, Menu, MenuItem, MenuProps } from '@mui/material';
import { entries } from '@seedcompany/common';
import { startCase } from 'lodash';
import { useContext, useMemo, useState } from 'react';
import { Power } from '~/api/schema.graphql';
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

  const allowedCreates = useMemo(
    () =>
      entries(creates).flatMap(([power, [_, maybeLabel]]) =>
        powers?.includes(power)
          ? {
              power,
              label: maybeLabel ?? startCase(power.replace('Create', '')),
            }
          : []
      ),
    [powers]
  );

  if (allowedCreates.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color="error"
        aria-controls="create-menu"
        aria-haspopup="true"
        startIcon={<Add />}
        onClick={openAddMenu}
        {...rest}
      >
        Create New Item
      </Button>
      <Menu
        id="create-menu"
        open={anchorEl !== null}
        anchorEl={anchorEl}
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
        {allowedCreates.map(({ power, label }) => (
          <MenuItem key={power} onClick={openCreate(power)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
