import Dagre from '@dagrejs/dagre';
import { Edge, Node } from 'reactflow';

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export const determinePositions = (nodes: Node[], edges: Edge[]) => {
  g.setGraph({ rankdir: 'TB' });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node as any));

  Dagre.layout(g);

  return nodes.map((node) => {
    const position = g.node(node.id);
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    const x = position.x - (node.width ?? 0) / 2;
    const y = position.y - (node.height ?? 0) / 2;

    return { ...node, position: { x, y } };
  });
};
