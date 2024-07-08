import { Box, Card, CardProps } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { forwardRef, useCallback } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSimpleBezierPath as getPath,
  Handle,
  Node as N,
  NodeProps,
  Position,
  useStore,
} from 'reactflow';
import { ChildrenProp, extendSx } from '~/common';
import { transitionTypeStyles } from '~/common/transitionTypeStyles';
import { getEdgeSide, getNodeIntersection } from './layout';
import { isBack, NodeTypes } from './parse-node-edges';
import { TransitionNodeExtra } from './transition-info';
import { useHighlightedState } from './useHighlightedState';
import {
  WorkflowStateFragment as State,
  WorkflowTransitionFragment as Transition,
} from './workflow.graphql';

import 'reactflow/dist/style.css';

type Node = N<State | Transition, NodeTypes>;

export const FlowchartStyles = styled(Box)(({ theme }) => ({
  height: '100%',
  '& .react-flow': {
    '.react-flow__edge-textbg': {
      fill: theme.palette.background.paper,
    },
    '.react-flow__handle': {
      opacity: 0,
      pointerEvents: 'none',
      cursor: 'unset',
    },
    '.react-flow__edge': {
      '.react-flow__edge-path': {
        stroke: 'var(--color)',
        strokeWidth: 2,
      },
      '&.selected, &:focus, &:focus-visible': {
        '.react-flow__edge-path': {
          strokeWidth: 3,
        },
      },
    },
  },
}));

export function StateNode({ data, selected }: NodeProps<State>) {
  const highlightedState = useHighlightedState();
  return (
    <>
      <Handle id="forward" type="target" position={Position.Top} />
      <NodeCard
        selected={selected}
        color="info"
        sx={
          data.value === highlightedState
            ? {
                borderColor: yellow.A700,
                borderWidth: 3,
              }
            : {}
        }
      >
        {data.label}
      </NodeCard>
      <Handle id="back" type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export function TransitionNode({ data, selected }: NodeProps<Transition>) {
  const { color } = transitionTypeStyles[data.type];
  const back = isBack(data);
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <TransitionNodeExtra transition={data}>
        <NodeCard
          selected={selected}
          color={color}
          sx={{
            borderRadius: 6,
            py: 1,
            px: 2,
            fontSize: 'small',
            textAlign: 'center',
          }}
        >
          <div>{data.devName}</div>
          {data.devName.toLowerCase() !== data.label.toLowerCase() && (
            <div>“{data.label}”</div>
          )}
        </NodeCard>
      </TransitionNodeExtra>
      <Handle type="source" position={back ? Position.Left : Position.Bottom} />
    </>
  );
}

const NodeCard = forwardRef<
  HTMLDivElement,
  CardProps & Pick<NodeProps, 'selected'>
>(function NodeCard({ children, selected, color, sx, ...rest }, ref) {
  return (
    <Card
      {...rest}
      ref={ref}
      elevation={selected ? 4 : 1}
      sx={[
        (theme) => ({
          transition: theme.transitions.create(['box-shadow', 'border-color'], {
            duration: theme.transitions.duration.shorter,
          }),
          borderColor: selected ? `${color}.dark` : 'transparent',
          borderWidth: 1,
          borderStyle: 'solid',
          p: 2,
          bgcolor: `${color}.main`,
          color: `${color}.contrastText`,
        }),
        ...extendSx(sx),
      ]}
    >
      {children}
    </Card>
  );
});

export const Edge = ({
  id,
  source,
  target,
  ...props
}: EdgeProps<Transition>) => {
  const transition = props.data!;

  const sourceNode: Node = useStore(
    useCallback((store) => store.nodeInternals.get(source)!, [source])
  );
  const targetNode: Node = useStore(
    useCallback((store) => store.nodeInternals.get(target)!, [target])
  );

  const stateMargin = { x: 6, y: 6 };
  const transitionMargin = { x: 6, y: 6 };
  const sourceMargin =
    sourceNode.type === 'transition' ? transitionMargin : stateMargin;
  const targetMargin =
    targetNode.type === 'transition' ? transitionMargin : stateMargin;
  const sourceIntersectsAt = getNodeIntersection(
    sourceNode,
    targetNode,
    sourceMargin
  );
  const targetIntersectsAt = getNodeIntersection(
    targetNode,
    sourceNode,
    targetMargin
  );
  const [path, labelX, labelY, offsetX, offsetY] = getPath({
    sourceX: sourceIntersectsAt.x,
    sourceY: sourceIntersectsAt.y,
    sourcePosition: getEdgeSide(sourceNode, sourceIntersectsAt, sourceMargin),
    targetX: targetIntersectsAt.x,
    targetY: targetIntersectsAt.y,
    targetPosition: getEdgeSide(targetNode, targetIntersectsAt, targetMargin),
  });
  const pathProps = { path, labelX, labelY, offsetX, offsetY };

  const back =
    sourceNode.type === 'transition' && isBack(sourceNode.data as Transition);
  const { color } = transitionTypeStyles[transition.type];

  const conditions = sourceNode.type === 'state' ? transition.conditions : [];

  return (
    <Box
      component="g"
      id={id}
      sx={(theme) => ({
        '--color': back
          ? theme.palette.grey[props.selected ? 600 : 300]
          : theme.palette[color][props.selected ? 'main' : 'light'],
      })}
    >
      <BaseEdge {...props} {...pathProps} />
      {(conditions.length > 0 || back) && (
        <LabelContainer labelX={labelX} labelY={labelY}>
          {conditions.map((c) => (
            <div key={c.label}>{c.label}</div>
          ))}
          {back && <div>Back</div>}
        </LabelContainer>
      )}
    </Box>
  );
};

const LabelContainer = ({
  labelX,
  labelY,
  children,
}: {
  labelX: number;
  labelY: number;
} & ChildrenProp) => (
  <EdgeLabelRenderer>
    <Box
      sx={{
        position: 'absolute',
        bgcolor: 'background.paper',
        p: 1,
        borderRadius: 1,
        fontSize: 12,
        textAlign: 'center',
      }}
      style={{
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
      }}
    >
      {children}
    </Box>
  </EdgeLabelRenderer>
);
