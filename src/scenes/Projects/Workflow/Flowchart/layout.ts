import Dagre from '@dagrejs/dagre';
import { Edge, Node, Position as Side, XYPosition } from 'reactflow';

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

/**
 * Returns the intersection point of the line between the center of the
 * intersectionNode and the target node
 */
export function getNodeIntersection(
  intersectionNode: Node,
  targetNode: Node,
  margin: XYPosition = { x: 10, y: 0 }
) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const w = intersectionNode.width! / 2 - margin.x;
  const h = intersectionNode.height! / 2 - margin.y;

  const x2 = intersectionNode.positionAbsolute!.x + w + margin.x;
  const y2 = intersectionNode.positionAbsolute!.y + h + margin.y;
  const x1 = targetNode.positionAbsolute!.x + targetNode.width! / 2;
  const y1 = targetNode.positionAbsolute!.y + targetNode.height! / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

/**
 * Returns the Side/"Position" of the edge where the intersection point is
 */
export function getEdgeSide(node: Node, intersectsAt: XYPosition) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x!);
  const ny = Math.round(n.y!);
  const px = Math.round(intersectsAt.x);
  const py = Math.round(intersectsAt.y);

  if (px <= nx + 1) {
    return Side.Left;
  }
  if (px >= nx + n.width! - 1) {
    return Side.Right;
  }
  if (py <= ny + 1) {
    return Side.Top;
  }
  if (py >= n.y! + n.height! - 1) {
    return Side.Bottom;
  }
  return Side.Top;
}
