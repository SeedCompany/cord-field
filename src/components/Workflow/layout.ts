import Dagre from '@dagrejs/dagre';
import { mapKeys, simpleSwitch } from '@seedcompany/common';
import { Edge as E, Node as N, Position as Side, XYPosition } from 'reactflow';
import { NodeTypes } from './parse-node-edges';
import {
  WorkflowStateFragment as State,
  WorkflowTransitionFragment as Transition,
} from './workflow.graphql';

type Node = N<State | Transition, NodeTypes>;
type Edge = E<Transition>;

export const determinePositions = (nodes: Node[], edges: Edge[]) => {
  const g = new Dagre.graphlib.Graph()
    .setDefaultEdgeLabel(() => ({}))
    .setGraph({
      ranksep: 80,
      acyclicer: 'greedy',
    });

  const nodeMap = mapKeys.fromList(nodes, (n) => n.id).asMap;

  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.width!,
      height: node.height!,
    })
  );
  edges.forEach((edge) =>
    g.setEdge(edge.source, edge.target, {
      weight:
        simpleSwitch(edge.data!.type, {
          Approve: 10,
          Neutral: 2,
          Reject: 1,
        })! + (nodeMap.get(edge.source)!.type === 'state' ? 2 : 0),
    })
  );

  Dagre.layout(g);

  const max = {
    x: Math.max(...nodes.map((n) => g.node(n.id).x)),
    y: Math.max(...nodes.map((n) => g.node(n.id).y)),
  };

  return nodes.map((node) => {
    // node position was persisted keep user placement.
    if (node.position.x > 0 || node.position.y > 0) {
      return node;
    }

    const position = g.node(node.id);
    // Convert anchor point from dagre to react flow
    // center/center -> top/left
    let x = position.x - node.width! / 2;
    const y = position.y - node.height! / 2;

    // Invert x-axis because for some reason, dagre puts the starting
    // point on the right.
    x = max.x - x;

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
