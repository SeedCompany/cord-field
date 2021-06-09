import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { PeriodicReportsList } from '../../../components/PeriodicReports';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { ProgressReportsDocument } from './ProgressReports.generated';

export const ProgressReports = () => {
  const { projectId = '', engagementId = '' } = useParams();
  const { data } = useQuery(ProgressReportsDocument, {
    variables: {
      projectId,
      engagementId,
    },
  });
  if (data?.engagement.__typename !== 'LanguageEngagement') {
    return null;
  }

  const language = data.engagement.language.value;
  const languageName = language?.name.value ?? language?.displayName.value;

  return (
    <PeriodicReportsList
      type="Progress"
      pageTitleSuffix={data.project.name.value ?? 'A Project'}
      breadcrumbs={[
        <ProjectBreadcrumb data={data.project} />,
        languageName ? (
          <Breadcrumb
            to={`/projects/${data.project.id}/engagements/${data.engagement.id}`}
          >
            {languageName}
          </Breadcrumb>
        ) : (
          <Redacted
            info="You do not have permission to view this engagement's name"
            width={200}
          />
        ),
      ]}
      reports={data.engagement.progressReports.items}
    />
  );
};
