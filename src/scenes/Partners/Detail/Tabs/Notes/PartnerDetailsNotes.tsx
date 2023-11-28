import { Add } from '@mui/icons-material';
import { Many } from 'lodash';
import { ActionableSection } from '~/components/ActionableSection';
import { useDialog } from '~/components/Dialog';
import { List, useListQuery } from '~/components/List';
import { CreatePost } from '~/components/posts/CreatePost';
import { PostableIdFragment } from '~/components/posts/PostableId.graphql';
import { PostListItem } from '~/components/posts/PostListItemCard';
import { EditablePartnerField } from '../../../Edit';
import { PartnerPostListDocument as PostListQuery } from '../../PartnerPostList.graphql';

interface Props {
  partner: PostableIdFragment;
  editPartner: (item: Many<EditablePartnerField>) => void;
  includeMembership?: boolean | undefined;
}

export const PartnerDetailNotes = ({
  partner,
  includeMembership = false,
}: Props) => {
  const [createPostState, createPost] = useDialog();

  const posts = useListQuery(PostListQuery, {
    listAt: (data) => data.partner.posts,
    variables: {
      partner: partner.id,
    },
  });

  return (
    <>
      <ActionableSection
        onAction={createPost}
        loading={!partner}
        canPerformAction={true}
        title="Notes"
        actionTooltip="Add Note"
        actionIcon={<Add />}
        iconLabel="Add Note"
      ></ActionableSection>
      <List
        {...posts}
        spacing={3}
        renderItem={(post) => (
          <PostListItem
            includeMembership={includeMembership}
            parent={partner}
            post={post}
          />
        )}
        skeletonCount={0}
        renderSkeleton={null}
        loading={!partner}
        wideList={true}
      />
      <CreatePost
        {...createPostState}
        includeMembership={includeMembership}
        parent={partner}
      />
    </>
  );
};
