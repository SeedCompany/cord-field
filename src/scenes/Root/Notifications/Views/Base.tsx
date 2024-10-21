import { Box, Stack, Theme, Typography } from '@mui/material';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import { alpha } from '@mui/material/styles';
import { ElementType } from 'react';
import { ChildrenProp, extendSx, StyleProps } from '~/common';
import { RelativeDateTime } from '~/components/Formatters';
import { ReadIndicator } from '../ReadIndicator';
import { NotificationFragment } from './index';

// Re-export type to simplify imports for concretes which will always need this.
export type { Views } from '../NotificationViewer';

export interface NotificationProp {
  notification: NotificationFragment;
}

interface NotificationTypeMap<
  AdditionalProps = object,
  RootComponent extends ElementType = typeof Box
> {
  props: NotificationProp & ChildrenProp & StyleProps & AdditionalProps;
  defaultComponent: RootComponent;
}

export const BaseView: OverridableComponent<NotificationTypeMap> = (
  props: NotificationTypeMap['props'] & { component?: ElementType }
) => {
  const { component: Root = Box, notification, children, ...rest } = props;
  const { unread, createdAt } = notification;
  return (
    <Root
      color="primary"
      {...rest}
      sx={[
        (theme: Theme) => ({
          width: 1,
          backgroundColor: unread
            ? alpha(theme.palette.primary.light, 0.1)
            : undefined,
          borderRadius: 1,
          padding: 'var(--p)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }),
        ...extendSx(rest.sx),
      ]}
    >
      <Stack sx={{ flex: 1, gap: 1, alignItems: 'flex-start' }}>
        {children}
        <Typography variant="caption" color="textSecondary">
          <RelativeDateTime date={createdAt} />
        </Typography>
      </Stack>
      {/* Just to reserve layout */}
      <ReadIndicator disabled sx={{ visibility: 'hidden' }} />
    </Root>
  );
};
