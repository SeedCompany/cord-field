import { Tab as BaseTab, TabProps, TabTypeMap } from '@mui/material';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link, LinkProps } from 'react-router-dom';

export const Tab: typeof BaseTab = (props: TabTypeMap['props']) => (
  <BaseTab
    {...props}
    // Wrap string labels in span so we can scale them when selected (CSS in theme)
    label={
      typeof props.label === 'string' ? <span>{props.label}</span> : props.label
    }
  />
);

export const TabLink = (
  props: Omit<TabProps<'a'>, 'component'> & { selected?: boolean } & LinkProps
) => (
  <Tab component={Link} {...props} aria-current={props.selected && 'page'} />
);
