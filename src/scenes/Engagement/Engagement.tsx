import React from 'react';
import { useParams } from 'react-router';
import {
  useEngagementQuery,
  useProjectBreadcrumbQuery,
} from './Engagement.generated';
import { EngagementDetailLoading } from './EngagementDetailLoading';
import { InternshipEngagementDetail } from './InternshipEngagement';
import { LanguageEngagementDetail } from './LanguageEngagement';

export const Engagement = () => {
  const { engagementId, projectId } = useParams();

  const { data: engagementData, loading } = useEngagementQuery({
    variables: {
      input: engagementId,
    },
  });

  const {
    data: projectData,
    loading: projectBreadcrumbLoading,
  } = useProjectBreadcrumbQuery({
    variables: {
      input: projectId,
    },
  });

  const engagement = engagementData?.engagement;
  const project = projectData?.project;

  if (loading || projectBreadcrumbLoading) return <EngagementDetailLoading />;
  if (project && engagement && engagement.__typename === 'LanguageEngagement')
    return (
      <LanguageEngagementDetail engagement={engagement} project={project} />
    );
  if (project && engagement && engagement.__typename === 'InternshipEngagement')
    return (
      <InternshipEngagementDetail engagement={engagement} project={project} />
    );
  return <span>Could Not Find Engagement</span>;
};
