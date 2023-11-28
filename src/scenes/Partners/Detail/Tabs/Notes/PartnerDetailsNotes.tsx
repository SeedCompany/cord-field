import { Add } from '@mui/icons-material';
import { Many } from 'lodash';
import { useDialog } from '~/components/Dialog';
import { EditableSection } from '~/components/EditableSection';
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
      <EditableSection
        onEdit={createPost}
        loading={!partner}
        canEdit={true}
        title="Notes"
        editTooltip="Add Note"
        editIcon={<Add />}
        iconLabel="Add Note"
      ></EditableSection>
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
