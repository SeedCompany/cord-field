import { TabList as MuiTabList, TabListProps } from '@mui/lab';
// `useTabContext` isn't re-exported from the `@mui/lab` barrel in a way the build
// can resolve, so import it from its subpath.
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { useTabContext } from '@mui/lab/TabContext';
import { MenuItem, TextField } from '@mui/material';
import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  SyntheticEvent,
} from 'react';
import { To, useNavigate } from 'react-router-dom';
import { useIsMobile } from '~/common';

interface TabChildProps {
  value: string;
  label?: ReactNode;
  /** Present on route-based tabs (`TabLink`); selecting navigates here. */
  to?: To;
}

/**
 * MUI Lab `TabList` that collapses into a dropdown select on mobile, so tabbed
 * detail pages stay usable on small screens. Drop-in replacement for `@mui/lab`'s
 * `TabList` for the `value`/`onChange` pattern — it reads each tab's `value` and
 * `label` from the `<Tab>` children and drives the same `onChange`.
 */
export const TabList = ({ children, onChange, ...props }: TabListProps) => {
  const isMobile = useIsMobile();
  const context = useTabContext();
  const navigate = useNavigate();

  if (!isMobile) {
    return (
      <MuiTabList onChange={onChange} {...props}>
        {children}
      </MuiTabList>
    );
  }

  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<TabChildProps> => isValidElement(child)
  );
  const ariaLabel = (props as { 'aria-label'?: string })['aria-label'];

  return (
    <TextField
      select
      // Outlined (not the theme's default filled) so the value is vertically
      // centered — filled reserves top space for a label this field doesn't have.
      variant="outlined"
      size="small"
      fullWidth
      value={context?.value ?? ''}
      onChange={(event) => {
        const value = event.target.value;
        const selected = tabs.find((tab) => tab.props.value === value);
        // Route-based tabs (TabLink) navigate; value-based tabs drive onChange.
        if (selected?.props.to != null) {
          navigate(selected.props.to);
        } else {
          onChange?.(event as unknown as SyntheticEvent, value);
        }
      }}
      SelectProps={{ 'aria-label': ariaLabel }}
      sx={{ mb: 2 }}
    >
      {tabs.map((tab) => (
        <MenuItem key={tab.props.value} value={tab.props.value}>
          {tab.props.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
