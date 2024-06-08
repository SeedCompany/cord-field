import { useQuery } from '@apollo/client';
import { ComponentType, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  EdgeTypes,
  NodeProps,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { determinePositions } from './layout';
import {
  Edge as EdgeComponent,
  FlowchartStyles,
  StateNode,
  TransitionNode,
} from './nodes';
import { NodeTypes, parseWorkflow } from './parse-node-edges';
import { ProjectFlowchartDocument } from './ProjectFlowchart.graphql';

const WrappedFlowchart = () => (
  <ReactFlowProvider>
    <ProjectFlowchart />
  </ReactFlowProvider>
);
// eslint-disable-next-line react/display-name,import/no-default-export
export default WrappedFlowchart;

const ProjectFlowchart = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { data } = useQuery(ProjectFlowchartDocument);
  useEffect(() => {
    const workflow = data?.workflow;
    if (!workflow) {
      return;
    }
    const { nodes, edges } = parseWorkflow(workflow);

    const positionedNodes = determinePositions(nodes, edges);
    setNodes([...positionedNodes]);
    setEdges([...edges]);
    window.requestAnimationFrame(() => {
      fitView();
    });

    // TODO Better: render, to get size, then do layout
    setTimeout(() => {
      setNodes((prev) => {
        const positionedNodes = determinePositions(prev, edges);
        setTimeout(() => {
          fitView();
        }, 100);
        return positionedNodes;
      });
    }, 100);
  }, [data, fitView, setEdges, setNodes]);

  return (
    <FlowchartStyles>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        fitView
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
