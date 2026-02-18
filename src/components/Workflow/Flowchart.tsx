import { TypedDocumentNode as DocumentNode, useQuery } from '@apollo/client';
import { mapEntries } from '@seedcompany/common';
import { useDebounceFn, useLocalStorageState } from 'ahooks';
import { OperationDefinitionNode } from 'graphql';
import { ComponentType, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  applyNodeChanges,
  Background,
  EdgeTypes,
  NodeProps,
  OnNodesChange,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  XYPosition,
} from 'reactflow';
import { Controls } from './Controls';
import {
  Edge as EdgeComponent,
  FlowchartStyles,
  StateNode,
  TransitionNode,
} from './nodes';
import { NodeTypes, parseWorkflow } from './parse-node-edges';
import { useAutoLayout } from './useAutoLayout';
import { WorkflowFragment } from './workflow.graphql';

interface Props {
  doc: DocumentNode<{ workflow: WorkflowFragment }, Record<string, never>>;
}

const WrappedFlowchart = (props: Props) => (
  <ReactFlowProvider>
    <Flowchart {...props} />
  </ReactFlowProvider>
);
// eslint-disable-next-line react/display-name,import/no-default-export
export default WrappedFlowchart;

const Flowchart = (props: Props) => {
  const opName = useMemo(
    () =>
      props.doc.definitions.find(
        (d): d is OperationDefinitionNode => d.kind === 'OperationDefinition'
      )!.name!.value,
    [props.doc]
  );

  const [storedPos, setStoredPos] = useLocalStorageState<
    Record<string, XYPosition>
  >(`${opName}-flowchart-node-position-map`);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const autoLayout = useAutoLayout(setNodes);

  const { data } = useQuery(props.doc);
  useEffect(() => {
    const workflow = data?.workflow;
    if (!workflow) return;

    autoLayout.restart();
    const { nodes, edges } = parseWorkflow(workflow);
    const persistedPosNodes = nodes.map((node) =>
      storedPos?.[node.id] ? { ...node, position: storedPos[node.id]! } : node
    );
    setNodes(persistedPosNodes);
    setEdges(edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls onResetLayout={autoLayout.reset} />
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
