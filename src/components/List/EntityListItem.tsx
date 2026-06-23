import { ChevronRight } from '@mui/icons-material';
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  SxProps,
  Theme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReactNode } from 'react';
import { ListItemLink } from '../Routing';

export interface EntityListItemProps {
  /** Internal route the row links to. Omit for a non-navigable row or while `loading`. */
  to?: string;
  /** Render a loading skeleton instead of content. */
  loading?: boolean;
  /** Leading image avatar (e.g. user photo). Takes precedence over `icon`. */
  avatar?: ReactNode;
  /** Leading type icon, rendered inside a tinted avatar circle. */
  icon?: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
  /** Trailing content; defaults to a chevron on navigable rows. */
  trailing?: ReactNode;
}

const avatarSx: SxProps<Theme> = (theme) => ({
  bgcolor: alpha(theme.palette.primary.main, 0.12),
  color: 'primary.main',
  fontWeight: 600,
});

// Slightly separated, outlined rows rather than flush divider lines. A fixed
// minHeight keeps rows uniform whether or not they have a `secondary` line
// (single-line content is vertically centered by the ListItem).
const rowSx: SxProps<Theme> = {
  minHeight: 64,
  mb: 1,
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  bgcolor: 'background.paper',
};

/**
 * A compact, full-width list row — the mobile counterpart to the desktop data
 * grids and the bulky `*ListItemCard` components. Built on MUI list primitives
 * and {@link ListItemLink} so the whole row navigates on tap. An avatar (image
 * or type icon) is shown only when provided; trails with a chevron when navigable.
 */
export const EntityListItem = ({
  to,
  loading,
  avatar,
  icon,
  primary,
  secondary,
  trailing,
}: EntityListItemProps) => {
  const hasAvatar = !!(avatar || icon);

  const leading = loading ? (
    hasAvatar ? (
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
    ) : null
  ) : avatar ? (
    <ListItemAvatar>{avatar}</ListItemAvatar>
  ) : icon ? (
    <ListItemAvatar>
      {/* Decorative — the row's primary text conveys the entity/type. */}
      <Avatar aria-hidden sx={avatarSx}>
        {icon}
      </Avatar>
    </ListItemAvatar>
  ) : null;

  const content = (
    <>
      {leading}
      <ListItemText
        primary={loading ? <Skeleton width="55%" /> : primary}
        secondary={loading ? <Skeleton width="35%" /> : secondary}
        primaryTypographyProps={{ fontWeight: 'medium', noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
      />
      {!loading &&
        (trailing != null ? (
          <Box sx={{ ml: 2, flexShrink: 0, color: 'text.secondary' }}>
            {trailing}
          </Box>
        ) : to ? (
          <ChevronRight sx={{ ml: 1, flexShrink: 0, color: 'action.active' }} />
        ) : null)}
    </>
  );

  if (loading || !to) {
    return (
      <ListItem component="div" sx={rowSx} aria-busy={loading || undefined}>
        {content}
      </ListItem>
    );
  }

  return (
    <ListItemLink to={to} selected={false} sx={rowSx}>
      {content}
    </ListItemLink>
  );
};
