import Flowchart from '../../../components/Workflow/Flowchart';
import { ProjectFlowchartDocument } from './ProjectFlowchart.graphql';

export const ProjectFlowchart = () => (
  <Flowchart doc={ProjectFlowchartDocument} />
);
