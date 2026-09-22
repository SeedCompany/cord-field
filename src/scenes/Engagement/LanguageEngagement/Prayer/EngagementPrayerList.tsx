import { Typography } from '@mui/material';
import { useListQuery } from '~/components/List';
import { PostableIdFragment } from '~/components/posts/PostableId.graphql';
import { PostList } from '~/components/posts/PostList';
import { EngagementPrayerListDocument } from './EngagementPrayerList.graphql';

/**
 * Prayer requests and updates on a language engagement.
 *
 * The engagement is where prayer lives, not the quarterly report. Teams share
 * and answer requests continuously — expected volume is one to two a week —
 * and a report is a curation of that stream rather than its home. A post
 * submitted with a report keeps its engagement parent and carries a report
 * reference, which is why both kinds appear here together, distinguished by
 * their provenance chip.
 */
export const EngagementPrayerList = ({
  engagement,
}: {
  engagement: PostableIdFragment;
}) => {
  const posts = useListQuery(EngagementPrayerListDocument, {
    listAt: (data) => {
      // `engagement(id:)` is typed as the Engagement interface, so the compiler
      // cannot know this is the postable kind. The caller does: the detail page
      // narrows to LanguageEngagement before rendering anything, and it is the
      // only engagement kind that implements Postable today. Narrow rather than
      // returning undefined, which `listAt` does not allow.
      // Keyed on `posts` rather than `__typename`, because codegen emits
      // __typename as optional and extracting on an optional discriminant
      // collapses to never.
      const engagement = data.engagement as Extract<
        typeof data.engagement,
        { readonly posts: unknown }
      >;
      return engagement.posts;
    },
    variables: {
      engagement: engagement.id,
      input: { filter: { types: ['Prayer'] } },
    },
  });

  return (
    <>
      <Typography variant="h3" paragraph>
        Prayer
      </Typography>
      <PostList parent={engagement} headless {...posts} />
    </>
  );
};
