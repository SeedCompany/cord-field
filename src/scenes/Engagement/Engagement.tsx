import React from 'react';
import { useParams } from 'react-router';
import { useEngagementQuery } from './Engagement.generated';
import { EngagementDetailLoading } from './EngagementDetailLoading';
import { InternshipEngagementDetail } from './InternshipEngagement';
import { LanguageEngagementDetail } from './LanguageEngagement';

export const Engagement = () => {
  const { engagementId } = useParams();

  const { data, loading, error } = useEngagementQuery({
    variables: {
      input: engagementId,
    },
  });
  console.log('data: ', data);

  return loading ? (
    <EngagementDetailLoading />
  ) : error ? (
    <span>ERROR</span>
  ) : data!.engagement.__typename === 'LanguageEngagement' ? (
    <LanguageEngagementDetail />
  ) : (
    <InternshipEngagementDetail />
  );
};
