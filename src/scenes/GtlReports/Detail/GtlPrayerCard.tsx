import { Card, CardContent, Typography } from '@mui/material';
import { useListQuery } from '../../../components/List';
import { PostList } from '../../../components/posts/PostList';
import { GtlPrayerListDocument } from './GtlPrayerList.graphql';

/**
 * Prayer on a GTL report.
 *
 * These are Posts, not prompt responses: a prayer request is written once and
 * carried forward, and the Post domain already answers who it may be shared
 * with — which is the whole question with prayer. The list is locked to the
 * Prayer category so a stray note can't land in the section.
 */
export const GtlPrayerCard = ({
  reportId,
  editable = true,
}: {
  reportId: string;
  editable?: boolean;
}) => {
  const posts = useListQuery(GtlPrayerListDocument, {
    // Only ever called with a GTL report's id, so the union is settled; the
    // narrowing is here to satisfy the type, not to handle a real case.
    listAt: ({ periodicReport: report }) =>
      (report as Extract<typeof report, { prayerRequests: unknown }>)
        .prayerRequests,
    variables: { report: reportId },
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Prayer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          What are you thankful for, and what needs can we join you in praying
          for? Each one is shared as a prayer request.
        </Typography>
        <PostList
          {...posts}
          parent={{ id: reportId, __typename: 'GTLReport' }}
          fixedType="Prayer"
          listField="prayerRequests"
          readOnly={!editable}
          headless
        />
      </CardContent>
    </Card>
  );
};
