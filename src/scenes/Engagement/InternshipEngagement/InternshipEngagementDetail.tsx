import React, { FC } from 'react';
import { ProjectBreadcrumbFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import { InternshipEngagementDetailFragment } from './InternshipEngagement.generated';

interface InternshipEngagementDetailProps {
  engagement: InternshipEngagementDetailFragment;
  project: ProjectBreadcrumbFragment;
}

export const InternshipEngagementDetail: FC<InternshipEngagementDetailProps> = () => {
  return <div>Internship Engagement Detail Scene</div>;
};
