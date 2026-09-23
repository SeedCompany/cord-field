import Flowchart from '../../../components/Workflow/Flowchart';
import { ProjectFlowchartDocument } from './ProjectFlowchart.graphql.ts';

export const ProjectFlowchart = () => (
  <Flowchart doc={ProjectFlowchartDocument} />
);
