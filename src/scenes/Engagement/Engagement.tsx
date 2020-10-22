import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router';
import { EngagementDocument } from './Engagement.generated';
import { EngagementDetailLoading } from './EngagementDetailLoading';
import { InternshipEngagementDetail } from './InternshipEngagement';
import { LanguageEngagementDetail } from './LanguageEngagement';

export const Engagement = () => {
  const { engagementId, projectId } = useParams();

  const { data, loading } = useQuery(EngagementDocument, {
    variables: {
      projectId,
      engagementId,
    },
  });

  if (loading) {
    return <EngagementDetailLoading />;
  }
  if (!data) {
    return <span>Could Not Find Engagement</span>;
  }
  if (data.engagement.__typename === 'LanguageEngagement') {
    return <LanguageEngagementDetail {...data} />;
  }
  return <InternshipEngagementDetail {...data} />;
};
