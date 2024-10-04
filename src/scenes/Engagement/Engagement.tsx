import { useQuery } from '@apollo/client';
import { useChangesetAwareIdFromUrl } from '../../components/Changeset';
import { useComments } from '../../components/Comments/CommentsContext';
import { NotFoundPage } from '../../components/Error';
import { EngagementDocument } from './Engagement.graphql';
import { EngagementDetailLoading } from './EngagementDetailLoading';
import { InternshipEngagementDetail } from './InternshipEngagement';
import { LanguageEngagementDetail } from './LanguageEngagement';

export const Engagement = () => {
  const { id: engagementId, changesetId } =
    useChangesetAwareIdFromUrl('engagementId');
  const { data, loading } = useQuery(EngagementDocument, {
    variables: {
      engagementId,
      changeset: changesetId,
    },
  });
  useComments(engagementId);

  if (loading) {
    return <EngagementDetailLoading />;
  }
  if (!data) {
    return <NotFoundPage>Could not find engagement</NotFoundPage>;
  }
  if (data.engagement.__typename === 'LanguageEngagement') {
    return <LanguageEngagementDetail {...data} />;
  }
  return <InternshipEngagementDetail {...data} />;
};
