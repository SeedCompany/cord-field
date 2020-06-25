import React from 'react';
import { useParams } from 'react-router';
import { useEngagementQuery } from './Engagement.generated';
import { EngagementDetailLoading } from './EngagementDetailLoading';
import { InternshipEngagementDetail } from './InternshipEngagement';
import { LanguageEngagementDetail } from './LanguageEngagement';

export const Engagement = () => {
  const { engagementId } = useParams();

  const { data, loading } = useEngagementQuery({
    variables: {
      input: engagementId,
    },
  });
  const engagement = data?.engagement;

  if (loading) return <EngagementDetailLoading />;
  if (engagement && engagement.__typename === 'LanguageEngagement')
    return <LanguageEngagementDetail {...engagement} />;
  if (engagement && engagement.__typename === 'InternshipEngagement')
    return <InternshipEngagementDetail {...engagement} />;
  return <span>Could Not Find Engagement</span>;
};
