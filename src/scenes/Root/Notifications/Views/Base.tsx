import { Box, Stack, Typography } from '@mui/material';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import type { OverridableComponent } from '@mui/material/OverridableComponent';
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
      {...rest}
      sx={[
        {
          backgroundColor: unread ? 'grey.200' : 'inherit',
          '&:hover': { backgroundColor: 'grey.300' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 1,
          gap: 1,
          p: 'var(--p)',
        },
        ...extendSx(rest.sx),
      ]}
    >
      <Stack sx={{ alignItems: 'flex-start', gap: 1 }}>
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
