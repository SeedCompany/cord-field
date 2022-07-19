import { Breadcrumbs as BreadCrumbs } from '@material-ui/core';
import { AddCurrentPath } from '../Routing/decorators.stories';
import { Breadcrumb } from './Breadcrumb';

export default {
  title: 'Components',
  decorators: [AddCurrentPath],
};

export const Breadcrumbs = () => (
  <BreadCrumbs>
    <Breadcrumb to="/">Home</Breadcrumb>
    <Breadcrumb to="/projects">Projects</Breadcrumb>
    <Breadcrumb to="/projects/1234">Labore People Group</Breadcrumb>
    <Breadcrumb to="/projects/1234/files">Files</Breadcrumb>
  </BreadCrumbs>
);
