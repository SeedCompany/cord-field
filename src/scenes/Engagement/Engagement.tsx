import React from 'react';
import { useParams } from 'react-router';
import { useEngagementQuery } from './Engagement.generated';
import { EngagementDetailLoading } from './EngagementDetailLoading';
import { InternshipEngagementDetail } from './InternshipEngagement';
import { LanguageEngagementDetail } from './LanguageEngagement';

export const Engagement = () => {
  const { engagementId, projectId } = useParams();

  const { data, loading } = useEngagementQuery({
    variables: {
      projectId,
      engagementId,
    },
  });

  if (loading) {
    return <EngagementDetailLoading projectId={projectId} />;
  }
  if (!data) {
    return <span>Could Not Find Engagement</span>;
  }
  if (data.engagement.__typename === 'LanguageEngagement') {
    return <LanguageEngagementDetail {...data} />;
  }
  return <InternshipEngagementDetail {...data} />;
};
