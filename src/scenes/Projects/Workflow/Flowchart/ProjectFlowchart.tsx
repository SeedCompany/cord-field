import { useQuery } from '@apollo/client';
import { mapEntries } from '@seedcompany/common';
import { useDebounceFn, useLocalStorageState } from 'ahooks';
import { ComponentType, useCallback } from 'react';
import ReactFlow, {
  applyNodeChanges,
  Background,
  Controls,
  EdgeTypes,
  NodeProps,
  OnNodesChange,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  XYPosition,
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
  const [storedPos, setStoredPos] = useLocalStorageState<
    Record<string, XYPosition>
  >('project-workflow-flowchart-node-position-map');
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const autoLayout = useAutoLayout(setNodes);

  useQuery(ProjectFlowchartDocument, {
    onCompleted: ({ workflow }) => {
      autoLayout.reset();
      const { nodes, edges } = parseWorkflow(workflow);
      const persistedPosNodes = nodes.map((node) =>
        storedPos?.[node.id] ? { ...node, position: storedPos[node.id]! } : node
      );
      setNodes(persistedPosNodes);
      setEdges(edges);
    },
  });

  const persist = useDebounceFn((nextNodes: typeof nodes) => {
    setStoredPos(
      mapEntries(nextNodes, ({ id, position }) => [id, position]).asRecord
    );
  });

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((prev) => {
        const next = applyNodeChanges(changes, prev);
        persist.run(next);
        return next;
      });
    },
    [setNodes, persist]
  );

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
