import { Tab, TabProps } from '@mui/material';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';

export const TabLink = (
  props: Omit<TabProps<'a'>, 'component'> & { selected?: boolean } & LinkProps
) => (
  <Tab component={Link} {...props} aria-current={props.selected && 'page'} />
);
