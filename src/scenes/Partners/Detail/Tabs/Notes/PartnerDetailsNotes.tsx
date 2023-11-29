import { Add } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { Many } from 'lodash';
import { ActionableSection } from '~/components/ActionableSection';
import { useDialog } from '~/components/Dialog';
import { IconButton } from '~/components/IconButton';
import { List, useListQuery } from '~/components/List';
import { CreatePost } from '~/components/posts/CreatePost';
import { PostableIdFragment } from '~/components/posts/PostableId.graphql';
import { PostListItem } from '~/components/posts/PostListItemCard';
import { EditablePartnerField } from '../../../Edit';
import { PartnerPostListDocument as PostListQuery } from '../../PartnerPostList.graphql';

interface Props {
  partner?: PostableIdFragment;
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
      partner: partner?.id ?? '',
    },
    skip: !partner,
  });

  return (
    <ActionableSection
      loading={!partner}
      title="Notes"
      actionTooltip={
        <Tooltip title="Add Note">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              disabled={false}
              onClick={createPost}
              loading={!partner}
              size="small"
              sx={{
                '&:hover': {
                  background: 'transparent',
                },
              }}
            >
              <Add />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Add Note
              </Typography>
            </IconButton>
          </Box>
        </Tooltip>
      }
    >
      <List
        {...posts}
        spacing={0}
        renderItem={(post) => (
          <PostListItem
            includeMembership={includeMembership}
            parent={partner!} // if we have a post, we have a partner
            post={post}
            sx={{ pb: 3 }}
          />
        )}
        skeletonCount={0}
        renderSkeleton={null}
        loading={!partner}
      />

      {partner && (
        <CreatePost
          {...createPostState}
          includeMembership={includeMembership}
          parent={partner}
        />
      )}
    </ActionableSection>
  );
};
