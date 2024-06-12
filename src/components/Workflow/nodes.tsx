import { Box, Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef, useCallback } from 'react';
import {
  BaseEdge,
  EdgeProps,
  getSimpleBezierPath as getPath,
  Handle,
  NodeProps,
  Position,
  useStore,
} from 'reactflow';
import { extendSx } from '~/common';
import { transitionTypeStyles } from '~/common/transitionTypeStyles';
import { getEdgeSide, getNodeIntersection } from './layout';
import { isBack } from './parse-node-edges';
import { TransitionNodeExtra } from './transition-info';
import {
  WorkflowStateFragment as State,
  WorkflowTransitionFragment as Transition,
} from './workflow.graphql';

import 'reactflow/dist/style.css';

export const FlowchartStyles = styled(Box)(({ theme }) => ({
  height: '100%',
  '.react-flow__attribution': { display: 'none' },
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
  return (
    <>
      <Handle id="forward" type="target" position={Position.Top} />
      <NodeCard selected={selected} color="info">
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
          }}
        >
          {data.label}
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
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source)!, [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target)!, [target])
  );

  const sourceIntersectsAt = getNodeIntersection(sourceNode, targetNode);
  const targetIntersectsAt = getNodeIntersection(targetNode, sourceNode);
  const [path, labelX, labelY, offsetX, offsetY] = getPath({
    sourceX: sourceIntersectsAt.x,
    sourceY: sourceIntersectsAt.y,
    sourcePosition: getEdgeSide(sourceNode, sourceIntersectsAt),
    targetX: targetIntersectsAt.x,
    targetY: targetIntersectsAt.y,
    targetPosition: getEdgeSide(targetNode, targetIntersectsAt),
  });
  const pathProps = { path, labelX, labelY, offsetX, offsetY };

  const back = sourceNode.type === 'transition' && isBack(sourceNode.data);
  const { color } = transitionTypeStyles[props.data!.type];
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
    </Box>
  );
};
