import { Breadcrumbs } from '@material-ui/core';
import React from 'react';
import { Breadcrumb as BreadcrumbComponent } from './Breadcrumb';

export default { title: 'Components/Breadcrumb' };

export const Breadcrumb = () => (
  <Breadcrumbs>
    <BreadcrumbComponent to="/projects">Project</BreadcrumbComponent>
    <BreadcrumbComponent to="/projects/1234">
      Labore People Group
    </BreadcrumbComponent>
    <BreadcrumbComponent to="/">Current</BreadcrumbComponent>
  </Breadcrumbs>
);
