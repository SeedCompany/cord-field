import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { NotFoundRoute } from '../../components/Error';
import { Engagement } from '../Engagement';
import { PartnershipList } from '../Partnerships/List';
import { Products } from '../Products';
import { ProjectBudget } from './Budget';
import { Files } from './Files';
import { ProjectList } from './List';
import { ProjectMembersList } from './Members/List';
import { ProjectOverview } from './Overview';

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
        {NotFoundRoute}
      </Route>
      <Route path="partnerships" element={<PartnershipList />} />
      <Route path="budget" element={<ProjectBudget />} />
      {NotFoundRoute}
    </Route>
    {NotFoundRoute}
  </Routes>
);
