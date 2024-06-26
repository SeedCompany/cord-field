import { Add } from '@mui/icons-material';
import { Many } from 'lodash';
import { ActionableSection } from '~/components/ActionableSection';
import { useDialog } from '~/components/Dialog';
import { List, useListQuery } from '~/components/List';
import { CreatePost } from '~/components/posts/CreatePost';
import { PostableIdFragment } from '~/components/posts/PostableId.graphql';
import { PostListItem } from '~/components/posts/PostListItemCard';
import { ProgressButton } from '~/components/ProgressButton';
import { TabPanelContent } from '~/components/Tabs';
import { EditablePartnerField } from '../../../Edit';
import { PartnerPostListDocument as PostListQuery } from '../../PartnerPostList.graphql';

interface Props {
  partner?: PostableIdFragment;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

export const PartnerDetailNotes = ({ partner }: Props) => {
  const [createPostState, createPost] = useDialog();

  const posts = useListQuery(PostListQuery, {
    listAt: (data) => data.partner.posts,
    variables: {
      partner: partner?.id ?? '',
    },
    skip: !partner,
  });

  return (
    <TabPanelContent>
      <ActionableSection
        loading={!partner}
        title="Notes"
        action={
          <ProgressButton
            onClick={createPost}
            progress={!partner}
            startIcon={<Add />}
          >
            Add Note
          </ProgressButton>
        }
      >
        <List
          {...posts}
          spacing={0}
          renderItem={(post) => (
            <PostListItem
              parent={partner!} // if we have a post, we have a partner
              post={post}
              sx={{ pb: 3 }}
            />
          )}
          skeletonCount={0}
          renderSkeleton={null}
          loading={!partner}
        />

        {partner && <CreatePost {...createPostState} parent={partner} />}
      </ActionableSection>
    </TabPanelContent>
  );
};
