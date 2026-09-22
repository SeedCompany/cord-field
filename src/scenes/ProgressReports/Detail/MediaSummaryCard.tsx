import { Audiotrack, Image as ImageIcon, Videocam } from '@mui/icons-material';
import {
  Avatar,
  AvatarGroup,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { groupToMapBy } from '@seedcompany/common';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { ProgressReportMediaSummaryFragment } from './ProgressReportDetail.graphql';

interface MediaSummaryCardProps extends StyleProps {
  items?: readonly ProgressReportMediaSummaryFragment[];
  loading: boolean;
  actions?: ReactNode;
}

const PUBLISHED_VARIANT_KEY = 'published';

/**
 * One thumbnail (or type icon, for video/audio) per photo/video/audio group,
 * plus how many of them have a published-variant item — the same signal the
 * Media step itself uses for "included in the Investor Report", so this
 * glance and that step never disagree about what's going to investors.
 */
export const MediaSummaryCard = ({
  items,
  loading,
  actions,
  ...rest
}: MediaSummaryCardProps) => {
  const groups = groupToMapBy(items ?? [], (m) => m.variantGroup);
  const publishedCount = [...groups.values()].filter((group) =>
    group.some((m) => m.variant.key === PUBLISHED_VARIANT_KEY)
  ).length;

  return (
    <Card {...rest}>
      <CardContent>
        <Typography variant="h3" paragraph>
          Media
        </Typography>
        {loading ? (
          <Skeleton width="60%" />
        ) : groups.size === 0 ? (
          <Typography color="text.secondary">None yet</Typography>
        ) : (
          <Stack spacing={1}>
            <AvatarGroup max={8} sx={{ justifyContent: 'flex-start' }}>
              {[...groups.entries()].map(([variantGroup, groupItems]) => (
                <MediaThumbnail key={variantGroup} items={groupItems} />
              ))}
            </AvatarGroup>
            <Typography variant="body2" color="text.secondary">
              {groups.size} item{groups.size === 1 ? '' : 's'}
              {publishedCount > 0 &&
                ` · ${publishedCount} in the Investor Report`}
            </Typography>
          </Stack>
        )}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

const MediaThumbnail = ({
  items,
}: {
  items: readonly ProgressReportMediaSummaryFragment[];
}) => {
  // Prefer the published (Investor Communications) item as the
  // representative thumbnail — it's the one an investor would actually see.
  const published = items.find((m) => m.variant.key === PUBLISHED_VARIANT_KEY);
  const representative = published ?? items[0];
  if (representative?.media.__typename === 'Image') {
    return <Avatar variant="rounded" src={representative.media.url} />;
  }
  const Icon =
    representative?.media.__typename === 'Video'
      ? Videocam
      : representative?.media.__typename === 'Audio'
      ? Audiotrack
      : ImageIcon;
  return (
    <Avatar variant="rounded">
      <Icon fontSize="small" />
    </Avatar>
  );
};
