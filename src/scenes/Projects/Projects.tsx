import loadable from '@loadable/component';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';

const Engagement = loadable(() => import('../Engagement'), {
  resolveComponent: (m) => m.Engagement,
});
const PartnershipList = loadable(() => import('../Partnerships/List'), {
  resolveComponent: (m) => m.PartnershipList,
});
const Products = loadable(() => import('../Products'), {
  resolveComponent: (m) => m.Products,
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
const ProjectReports = loadable(() => import('./Reports'), {
  resolveComponent: (m) => m.Reports,
});

const EngagementReports = loadable(() => import('../Engagement/Reports'), {
  resolveComponent: (m) => m.Reports,
});

const EngagementReport = loadable(() => import('../Engagement/Report'), {
  resolveComponent: (m) => m.Report,
});

export const Projects = () => (
  <Routes>
    <Route path="" element={<ProjectList />} />
    <Route path=":projectId">
      <Route path="" element={<ProjectOverview />} />
      <Route path="files/*" element={<Files />} />
      <Route path="members" element={<ProjectMembersList />} />
      <Route path="engagements/:engagementId">
        <Route path="" element={<Engagement />} />
        <Route path="products/*" element={<Products />} />
        <Route path="reports" element={<EngagementReports />} />
        <Route path="report/:reportId" element={<EngagementReport />} />
        {NotFoundRoute}
      </Route>
      <Route path="partnerships" element={<PartnershipList />} />
      <Route path="budget" element={<ProjectBudget />} />
      <Route path="reports/:reportType" element={<ProjectReports />} />
      {NotFoundRoute}
    </Route>
    {NotFoundRoute}
  </Routes>
);
