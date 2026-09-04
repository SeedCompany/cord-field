import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { ProgressReportPrayerSummaryFragment } from './ProgressReportDetail.graphql';

interface PrayerSummaryCardProps extends StyleProps {
  items?: readonly ProgressReportPrayerSummaryFragment[];
  loading: boolean;
  actions?: ReactNode;
}

/**
 * Requests submitted with this report specifically — not the engagement's
 * whole prayer stream, which runs continuously between reports too. Each
 * line shows the same two signals the Prayer step itself leads with: how
 * widely it's cleared to reach, and whether it's one of the ones actually
 * going into this report's Investor Report.
 */
export const PrayerSummaryCard = ({
  items,
  loading,
  actions,
  ...rest
}: PrayerSummaryCardProps) => (
  <Card {...rest}>
    <CardContent>
      <Typography variant="h3" paragraph>
        Prayer
      </Typography>
      {loading ? (
        <>
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </>
      ) : !items || items.length === 0 ? (
        <Typography color="text.secondary">Nothing added yet</Typography>
      ) : (
        <Stack spacing={1.5}>
          {items.map((post) => (
            <Stack
              key={post.id}
              direction="row"
              spacing={1}
              alignItems="flex-start"
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {post.body.value}
              </Typography>
              {post.featured.value && (
                <Chip label="Investor Report" color="primary" size="small" />
              )}
              <Chip
                label={post.effectiveShareability}
                size="small"
                variant="outlined"
              />
            </Stack>
          ))}
        </Stack>
      )}
    </CardContent>
    {actions && <CardActions>{actions}</CardActions>}
  </Card>
);
