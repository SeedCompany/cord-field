import loadable from '@loadable/component';
import { Route, Routes, useLocation } from 'react-router-dom';
import { splicePath } from '~/common';
import { NotFoundRoute } from '../../components/Error';
import { Navigate } from '../../components/Routing';
import { useBetaFeatures } from '../../components/Session';
import { ProjectChangesetContext } from './ProjectChangesetContext';

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
  <Routes>
    <Route
      path=""
      element={
        <ProjectChangesetContext>
          <ProjectOverview />
        </ProjectChangesetContext>
      }
    />
    <Route path="files/*" element={<Files />} />
    <Route path="members" element={<ProjectMembersList />} />
    <Route path="engagements/:engagementId/*" element={<Engagements />} />
    <Route path="partnerships" element={<PartnershipList />} />
    <Route path="budget" element={<ProjectBudget />} />
    <Route path="reports/financial" element={<Reports type="Financial" />} />
    <Route path="reports/narrative" element={<Reports type="Narrative" />} />
    <Route
      path="change-requests"
      element={
        useBetaFeatures().has('projectChangeRequests') ? (
          <ChangeRequestList />
        ) : (
          <Navigate to=".." replace />
        )
      }
    />
    {NotFoundRoute}
  </Routes>
);

const Engagements = () => (
  <Navigate replace permanent to={splicePath(useLocation(), 1, 2)} />
);
