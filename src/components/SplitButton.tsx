import { ArrowDropDown as ArrowIcon } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { ReactNode, useRef, useState } from 'react';
import { extendSx } from '~/common';

export interface SplitButtonProps<T>
  extends Omit<ButtonGroupProps, 'value' | 'onChange'> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getValueLabel?: (value: T) => ReactNode;
  SplitButtonProps?: ButtonProps;
}

export const SplitButton = <T,>({
  value: selectedValue,
  onChange,
  options,
  getValueLabel,
  SplitButtonProps,
  ...rest
}: SplitButtonProps<T>) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (value: T) => {
    onChange(value);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup variant="contained" {...rest} ref={anchorRef}>
        {rest.children}
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          {...SplitButtonProps}
          onClick={handleToggle}
          sx={[{ flexBasis: 0 }, ...extendSx(SplitButtonProps?.sx)]}
        >
          <ArrowIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 2,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={option === selectedValue}
                      onClick={() => handleMenuItemClick(option)}
                    >
                      {getValueLabel
                        ? getValueLabel(option)
                        : (option as ReactNode)}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
