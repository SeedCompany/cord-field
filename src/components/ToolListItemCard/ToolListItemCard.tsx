import {
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { PartialDeep } from 'type-fest';
import { StyleProps } from '~/common';
import type { ToolListItemFragment } from '~/common/fragments/tool.graphql';
import { CardActionAreaLink } from '../Routing';

export interface ToolListItemCardProps extends StyleProps {
  tool?: PartialDeep<ToolListItemFragment>;
}

export const ToolListItemCard = ({
  tool,
  sx,
  className,
}: ToolListItemCardProps) => {
  const title = tool?.name?.value;
  const description = tool?.description?.value;
  const isAiBased = tool?.aiBased?.value;

  return (
    <Card
      sx={[
        (theme) => ({
          width: '100%',
          maxWidth: theme.breakpoints.values.sm,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      className={className}
    >
      <CardActionAreaLink to={`/tools/${tool?.id}`} disabled={!tool?.id}>
        <CardContent sx={{ p: 2 }}>
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Typography variant="h6" component="h3" noWrap sx={{ flex: 1 }}>
              {title ?? <Skeleton width="60%" />}
            </Typography>
            {isAiBased && (
              <Chip
                label="AI-Based"
                size="small"
                variant="outlined"
                sx={{ flexShrink: 0 }}
              />
            )}
          </Stack>
          {description ? (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          ) : (
            <>
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="85%" />
            </>
          )}
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
