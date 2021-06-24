import loadable from '@loadable/component';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { ProjectDetailWrapper } from './DetailWrapper/DetailWrapper';

const Engagements = loadable(() => import('../Engagement'), {
  resolveComponent: (m) => m.Engagements,
});
const PartnershipList = loadable(() => import('../Partnerships/List'), {
  resolveComponent: (m) => m.PartnershipList,
});
const ProjectBudget = loadable(() => import('./Budget'), {
  resolveComponent: (m) => m.ProjectBudget,
});
const Files = loadable(() => import('./Files'), {
  resolveComponent: (m) => m.Files,
});
const ProjectList = loadable(
  () => import(/* webpackChunkName: "Project-List" */ './List'),
  {
    resolveComponent: (m) => m.ProjectList,
  }
);
const ProjectMembersList = loadable(() => import('./Members/List'), {
  resolveComponent: (m) => m.ProjectMembersList,
});
const ProjectOverview = loadable(
  () => import(/* webpackChunkName: "Project-Overview" */ './Overview'),
  {
    resolveComponent: (m) => m.ProjectOverview,
  }
);
const Reports = loadable(() => import('./Reports'), {
  resolveComponent: (m) => m.ProjectReports,
});

const ChangeRequestList = loadable(() => import('./ChangeRequest/List'), {
  resolveComponent: (m) => m.ProjectChangeRequestList,
});

export const Projects = () => (
  <Routes>
    <Route path="" element={<ProjectList />} />
    <Route path=":projectId/*" element={<ProjectDetails />} />
    {NotFoundRoute}
  </Routes>
);

const ProjectDetails = () => (
  <ProjectDetailWrapper>
    <Routes>
      <Route path="" element={<ProjectOverview />} />
      <Route path="files/*" element={<Files />} />
      <Route path="members" element={<ProjectMembersList />} />
      <Route path="engagements/:engagementId/*" element={<Engagements />} />
      <Route path="partnerships" element={<PartnershipList />} />
      <Route path="budget" element={<ProjectBudget />} />
      <Route path="reports/financial" element={<Reports type="Financial" />} />
      <Route path="reports/narrative" element={<Reports type="Narrative" />} />
      <Route path="change-requests" element={<ChangeRequestList />} />
      {NotFoundRoute}
    </Routes>
  </ProjectDetailWrapper>
);
