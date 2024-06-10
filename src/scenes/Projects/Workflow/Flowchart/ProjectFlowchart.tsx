import { useQuery } from '@apollo/client';
import { ComponentType } from 'react';
import ReactFlow, {
  Background,
  Controls,
  EdgeTypes,
  NodeProps,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import {
  Edge as EdgeComponent,
  FlowchartStyles,
  StateNode,
  TransitionNode,
} from './nodes';
import { NodeTypes, parseWorkflow } from './parse-node-edges';
import { ProjectFlowchartDocument } from './ProjectFlowchart.graphql';
import { useAutoLayout } from './useAutoLayout';

const WrappedFlowchart = () => (
  <ReactFlowProvider>
    <ProjectFlowchart />
  </ReactFlowProvider>
);
// eslint-disable-next-line react/display-name,import/no-default-export
export default WrappedFlowchart;

const ProjectFlowchart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const autoLayout = useAutoLayout(setNodes);

  useQuery(ProjectFlowchartDocument, {
    onCompleted: ({ workflow }) => {
      autoLayout.reset();
      const { nodes, edges } = parseWorkflow(workflow);
      setNodes(nodes);
      setEdges(edges);
    },
  });

  return (
    <FlowchartStyles sx={autoLayout.showSx}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        nodesConnectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </FlowchartStyles>
  );
};

export const nodeTypes: Record<NodeTypes, ComponentType<NodeProps>> = {
  state: StateNode,
  transition: TransitionNode,
};

const edgeTypes = {
  default: EdgeComponent,
} satisfies EdgeTypes;
