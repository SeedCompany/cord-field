import { Chip, Tooltip } from '@mui/material';
import { getReportLabel } from '../PeriodicReports/ReportLabel';
import { PostListItemCardFragment } from './PostListItemCard/PostListItemCard.graphql';

/**
 * Where a post came from: a quarterly report, or the engagement between them.
 *
 * This is the label that makes an aggregated feed readable. At 1-2 prayer
 * items per engagement per week a list runs to hundreds of entries, and
 * without knowing which quarter each one belongs to — or that it arrived
 * outside a report at all — it is an undated pile.
 *
 * Rendered as a chip rather than plain text because it is a classification, not
 * prose, and readers scan for it rather than reading it.
 */
export const PostProvenance = ({
  post,
}: {
  post: Pick<PostListItemCardFragment, 'report'>;
}) => {
  // Cannot read the report is different from there being no report: the first
  // should say nothing rather than claim the post was shared independently.
  if (!post.report.canRead) {
    return null;
  }

  const label = getReportLabel(post.report.value ?? undefined);
  if (!label) {
    return (
      <Tooltip title="Shared on the engagement, not as part of a quarterly report">
        <Chip label="Between reports" size="small" variant="outlined" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Submitted with this quarterly report">
      <Chip label={`${label} report`} size="small" color="info" />
    </Tooltip>
  );
};
