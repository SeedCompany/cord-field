import { ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { FC, ReactElement } from 'react';
import * as React from 'react';
import { ListItemLink } from '../Routing';

const LIST_LINK_COLOR = '#8f928b';
const LIST_LINK_BACKGROUND_COLOR = '#252d35';

const useStyles = makeStyles(() => ({
  listItem: {
    borderRadius: '14px',
    // TODO I don't like doing the styles this way but having difficulty overriding
    '&.Mui-selected': {
      backgroundColor: `${LIST_LINK_BACKGROUND_COLOR} !important`,
    },
    '&.Mui-selected .MuiTypography-root': {
      color: 'white',
    },
    '&.Mui-selected svg': {
      color: 'white',
    },
  },
  itemText: {
    color: LIST_LINK_COLOR,
  },
  listIcon: {
    color: LIST_LINK_COLOR,
  },
}));

export interface SidebarListLinkProps {
  to: string;
  linkName: string;
  icon: ReactElement;
}

export const SidebarListLink: FC<SidebarListLinkProps> = ({
  to,
  linkName,
  icon,
}) => {
  const { listItem, itemText, listIcon } = useStyles();

  return (
    <ListItemLink className={listItem} to={to} external={false}>
      <ListItemIcon className={listIcon}>{icon}</ListItemIcon>
      <ListItemText primaryTypographyProps={{ className: itemText }}>
        {linkName}
      </ListItemText>
    </ListItemLink>
  );
};
